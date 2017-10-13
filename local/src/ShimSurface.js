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

    this.pendingBufferDestroyListener = () => {
      this.pendingBuffer.localRtcDcBuffer.grBufferProxy.destroy()
      this.pendingBuffer.localRtcDcBuffer.rtcDcBufferProxy.destroy()
      delete this.pendingBuffer.localRtcDcBuffer
      this.pendingBuffer = null
    }
  }

  destroy (resource) {
    this.proxy.destroy()
  }

  attach (resource, buffer, x, y) {
    if (this.buffer) {
      this.buffer.release()
    }
    // TODO listen for buffer destruction & signal buffer proxy & remove local pending buffer
    if (this.pendingBuffer) {
      this.pendingBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
    }
    this.pendingBuffer = buffer
    if (this.pendingBuffer !== null) {
      this.pendingBuffer.addDestroyListener(this.pendingBufferDestroyListener)
    }

    if (!this.pendingBuffer.localRtcDcBuffer) {
      this.pendingBuffer.localRtcDcBuffer = this.rtcBufferFactory.createLocalRtcDcBuffer()
    }

    this.proxy.attach(this.pendingBuffer.localRtcDcBuffer.grBufferProxy, x, y)
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

      // TODO how to dynamically update the pipeline video resolution?
      if (!this.h264Encoder || this.h264Encoder.width !== bufferWidth || this.h264Encoder.height !== bufferHeight) {
        this.buffer.localRtcDcBuffer.rtcDcBufferProxy.size(bufferWidth, bufferHeight)
        this.h264Encoder = H264Encoder.create(bufferWidth, bufferHeight)
      }

      // TODO we interpret the buffer as always being xRGB. However we could also support ARGB if we split out the
      // the alpha channel as a greyscale and send it as a second h264 frame we reconstruct in the browser into ARGB
      // after decoding with the aid of a simple webgl shader.
      this.h264Encoder.src.push(shm)
      const pullFrame = () => {
        // TODO use gst_app_sink_set_callbacks instead. Requires modifications to the node-gstreamer-superficial lib.
        this.h264Encoder.sink.pull((buf) => {
          if (buf) {
            // resolve
            buf.writeUInt32LE(synSerial, 0, false)
            resolve(buf)
          } else {
            // frame not yet encoded, retry
            setTimeout(pullFrame, 33)
          }
        })
      }
      pullFrame()
    })
  }

  sendBuffer (buf, localRtcDcBuffer, synSerial) {
    localRtcDcBuffer.dataChannel.send(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
    // if the ack times out & no newer serial is expected, we can retry sending the buffer contents
    setTimeout(() => {
      // If the syn serial at the time the timer was created is greater than the latest received ack serial,
      // then we have not received an ack that matches or is newer than the syn we're checking. We resend the frame.
      if (synSerial > this.ackSerial) {
        this.sendBuffer(buf, this.buffer.localRtcDcBuffer)
      }
      // TODO dynamically adjust to expected roundtrip time which could (naively) be calculated by measuring the time
      // between a syn & ack.
    }, 250)
  }

  commit (resource) {
    this.pendingBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
    this.buffer = this.pendingBuffer
    this.pendingBuffer = null
    // TODO handle destruction of committed buffer

    // TODO get buffer width & height
    // TODO create encoder if it doesn't exist
    // TODO create encoder if it's width & height don't match the buffer

    this.buffer.localRtcDcBuffer.ack = (serial) => {
      if (serial > this.ackSerial) {
        this.ackSerial = serial
      } // else we received an outdated ack serial, ignore it.
    }

    this.synSerial++
    const currentSynSerial = this.synSerial

    this.buffer.localRtcDcBuffer.rtcDcBufferProxy.syn(currentSynSerial)
    this.encodeBuffer(this.buffer, currentSynSerial).then((buf) => {
      this.sendBuffer(buf, this.buffer.localRtcDcBuffer, currentSynSerial)
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
