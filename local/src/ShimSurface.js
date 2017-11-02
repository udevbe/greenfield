'use strict'

const {Shm} = require('wayland-server-bindings-runtime')

const WlSurfaceRequests = require('./protocol/wayland/WlSurfaceRequests')
const WlCallback = require('./protocol/wayland/WlCallback')
const LocalCallback = require('./LocalCallback')
const ShimCallback = require('./ShimCallback')
const H264Encoder = require('./H264Encoder')

module.exports = class ShimSurface extends WlSurfaceRequests {
  static create (grSurfaceProxy) {
    const rtcBufferFactory = grSurfaceProxy.connection._rtcBufferFactory
    return new ShimSurface(grSurfaceProxy, rtcBufferFactory)
  }

  constructor (grSurfaceProxy, rtcBufferFactory) {
    super()
    this.proxy = grSurfaceProxy
    this.rtcBufferFactory = rtcBufferFactory

    this.pendingBufferDestroyListener = null
    this.pendingBuffer = null
    this.buffer = null
    this.synSerial = 0
    this.ackSerial = 0
    this.h264Encoder = null

    // use a single buffer to communicate with the browser. Contents of the buffer will be copied when send.
    this.localRtcDcBuffer = this.rtcBufferFactory.createLocalRtcDcBuffer()

    this.pendingBufferDestroyListener = () => {
      this.localRtcDcBuffer.grBufferProxy.destroy()
      this.localRtcDcBuffer.rtcDcBufferProxy.destroy()
      this.pendingBuffer = null
    }
  }

  destroy (resource) {
    this.proxy.destroy()
  }

  attach (resource, buffer, x, y) {
    // TODO listen for buffer destruction & signal buffer proxy & remove local pending buffer
    if (this.pendingBuffer) {
      this.pendingBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
    }
    this.pendingBuffer = buffer
    if (this.pendingBuffer !== null) {
      this.pendingBuffer.addDestroyListener(this.pendingBufferDestroyListener)
    }

    this.proxy.attach(this.localRtcDcBuffer.grBufferProxy, x, y)
  }

  damage (resource, x, y, width, height) {
    this.proxy.damage(x, y, width, height)
  }

  frame (resource, callback) {
    const callbackProxy = this.proxy.frame()
    const localCallback = LocalCallback.create()
    callbackProxy.listener = localCallback

    const shimCallback = ShimCallback.create(callbackProxy)
    localCallback.resource = WlCallback.create(resource.client, 4, callback, shimCallback, null)
  }

  setOpaqueRegion (resource, region) {
    const regionProxy = region.implementation.proxy
    this.proxy.setOpaqueRegion(regionProxy)
  }

  setInputRegion (resource, region) {
    const regionProxy = region.implementation.proxy
    this.proxy.setInputRegion(regionProxy)
  }

  encodeBuffer (buffer, synSerial) {
    return new Promise((resolve, reject) => {
      const shm = Shm.get(buffer)
      if (shm === null) {
        reject(new Error('Unsupported buffer format.'))
      }

      const bufferWidth = shm.getWidth()
      const bufferHeight = shm.getHeight()

      // TODO we interpret the buffer as always being xRGB. However we could also support ARGB if we split out the
      // the alpha channel as a greyscale yuv and send it as a second h264 frame. We can then reconstruct in the browser
      // into RGBA using the grayscale as the alpha channel with the use of a simple webgl shader.

      const pixelBuffer = shm.getData().reinterpret(bufferWidth * bufferHeight * 4)

      // TODO how to dynamically update the pipeline video resolution?
      if (!this.h264Encoder || this.h264Encoder.width !== bufferWidth || this.h264Encoder.height !== bufferHeight) {
        this.h264Encoder = H264Encoder.create(bufferWidth, bufferHeight)
        // BGRx because of little endian blob
        this.h264Encoder.src.setCapsFromString('video/x-raw,format=BGRx,width=' + bufferWidth + ',height=' + bufferHeight + ',bpp=32,depth=32,framerate=30/1')
        this.h264Encoder.pipeline.play()
      }

      // shm.beginAccess()
      // console.log('pushing buffer')
      this.h264Encoder.src.push(pixelBuffer)
      const pullFrame = () => {
        // TODO use gst_app_sink_set_callbacks instead. Requires modifications to the node-gstreamer-superficial lib.
        this.h264Encoder.sink.pull((h264Nal) => {
          // console.log('pulled encoded buffer: ' + h264Nal.toString('hex'))
          if (h264Nal) {
            // shm.endAccess()
            // resolve
            h264Nal.writeUInt32LE(synSerial, 0, false)
            resolve(h264Nal)
          } else {
            // console.log('frame not yet encoded, retry')
            setTimeout(pullFrame, 50)
          }
        })
      }
      pullFrame()
    })
  }

  sendBuffer (h264Nal, localRtcDcBuffer, synSerial) {
    if (localRtcDcBuffer.dataChannel.readyState === 'open') {
      // console.log('sending buffer')
      localRtcDcBuffer.dataChannel.send(h264Nal.buffer.slice(h264Nal.byteOffset, h264Nal.byteOffset + h264Nal.byteLength))
    } else {
      // console.log('buffer channel not yet open')
      localRtcDcBuffer.dataChannel.onopen = () => {
        localRtcDcBuffer.dataChannel.onopen = null
        // make sure we don't send an old buffer
        if (synSerial >= this.synSerial) {
          this.sendBuffer(h264Nal, localRtcDcBuffer, synSerial)
        }
      }
    }
    // if the ack times out & no newer serial is expected, we can retry sending the buffer contents
    setTimeout(() => {
      // If the syn serial at the time the timer was created is greater than the latest received ack serial and no newer serial is expected,
      // then we have not received an ack that matches or is newer than the syn we're checking. We resend the frame.
      if (synSerial > this.ackSerial && synSerial === this.synSerial) {
        // console.log('send timed out. resending')
        this.sendBuffer(h264Nal, localRtcDcBuffer, synSerial)
      }
      // TODO dynamically adjust to expected roundtrip time which could (naively) be calculated by measuring the latency
      // between a (syn & ack)/2 + frame bandwidth.
    }, 500)
  }

  commit (resource) {
    if (this.buffer) {
      this.buffer.release()
    }

    this.pendingBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
    this.buffer = this.pendingBuffer
    this.pendingBuffer = null
    // TODO handle destruction of committed buffer?

    this.localRtcDcBuffer.ack = (serial) => {
      if (serial > this.ackSerial) {
        this.ackSerial = serial
      } // else we received an outdated ack serial, ignore it.
    }

    this.synSerial++
    const currentSynSerial = this.synSerial

    const shm = Shm.get(this.buffer)
    const bufferWidth = shm.getWidth()
    const bufferHeight = shm.getHeight()
    this.localRtcDcBuffer.rtcDcBufferProxy.syn(currentSynSerial, bufferWidth, bufferHeight)
    this.encodeBuffer(this.buffer, currentSynSerial).then((h264Nal) => {
      this.sendBuffer(h264Nal, this.localRtcDcBuffer, currentSynSerial)
    }).catch((error) => {
      console.log(error)
      // TODO Failed to encode buffer. What to do here?
    })
    this.proxy.commit()
  }

  setBufferTransform (resource, transform) {
    this.proxy.setBufferTransform(transform)
  }

  setBufferScale (resource, scale) {
    this.proxy.setBufferScale(scale)
  }

  damageBuffer (resource, x, y, width, height) {
    this.proxy.damageBuffer(x, y, width, height)
  }
}
