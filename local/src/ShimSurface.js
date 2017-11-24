'use strict'

const {Shm} = require('wayland-server-bindings-runtime')

const WlSurfaceRequests = require('./protocol/wayland/WlSurfaceRequests')
const WlCallback = require('./protocol/wayland/WlCallback')
const LocalCallback = require('./LocalCallback')
const ShimCallback = require('./ShimCallback')
const H264Encoder = require('./H264Encoder')

module.exports = class ShimSurface extends WlSurfaceRequests {

  /**
   * @param grSurfaceProxy
   * @param grSurfaceResource
   * @return {module.ShimSurface}
   */
  static create (grSurfaceProxy, grSurfaceResource) {
    const rtcBufferFactory = grSurfaceProxy.connection._rtcBufferFactory
    return new ShimSurface(grSurfaceProxy, rtcBufferFactory, grSurfaceResource)
  }

  /**
   * @private
   * @param grSurfaceProxy
   * @param rtcBufferFactory
   * @param grSurfaceResource
   */
  constructor (grSurfaceProxy, rtcBufferFactory) {
    super()
    this.proxy = grSurfaceProxy
    this.rtcBufferFactory = rtcBufferFactory

    this.pendingBuffer = null
    this.buffer = null
    this.synSerial = 0
    this.ackSerial = 0
    this.h264Encoder = null

    // use a single buffer to communicate with the browser. Contents of the buffer will be copied when send.
    this.localRtcDcBuffer = this.rtcBufferFactory.createLocalRtcDcBuffer()

    this.pendingBufferDestroyListener = () => {
      this.pendingBuffer = null
    }
    this.bufferDestroyListener = () => {
      this.buffer = null
    }
  }

  destroy (resource) {
    this.proxy.destroy()
    resource.destroy()
    this.localRtcDcBuffer.destroy()
    this.localRtcDcBuffer = null
  }

  attach (resource, buffer, x, y) {
    // TODO listen for buffer destruction & signal buffer proxy & remove local pending buffer
    if (this.pendingBuffer) {
      this.pendingBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
    }
    this.pendingBuffer = buffer
    if (this.pendingBuffer) {
      this.pendingBuffer.addDestroyListener(this.pendingBufferDestroyListener)
      this.proxy.attach(this.localRtcDcBuffer.grBufferProxy, x, y)
    } else {
      this.proxy.attach(null, x, y)
    }
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
    const regionProxy = region === null ? null : region.implementation.proxy
    this.proxy.setOpaqueRegion(regionProxy)
  }

  setInputRegion (resource, region) {
    const regionProxy = region === null ? null : region.implementation.proxy
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

      const pixelBuffer = shm.getData().reinterpret(bufferWidth * bufferHeight * 4)

      // TODO how to dynamically update the pipeline video resolution?
      if (!this.h264Encoder || this.h264Encoder.width !== bufferWidth || this.h264Encoder.height !== bufferHeight) {
        this.h264Encoder = H264Encoder.create(bufferWidth, bufferHeight)
        // FIXME derive fromat from actual shm format
        this.h264Encoder.src.setCapsFromString('video/x-raw,format=BGRA,width=' + bufferWidth + ',height=' + bufferHeight + ',framerate=30/1')
        this.h264Encoder.pipeline.play()
      }

      this.h264Encoder.src.push(pixelBuffer)

      const frame = {
        width: bufferWidth,
        height: bufferHeight,
        synSerial: synSerial,
        opaque: null,
        alpha: null
      }

      // FIXME check buffer format if alpha is required. If not, use an empty buffer instead.

      this.h264Encoder.sink.pull((opaqueH264Nal) => {
        if (opaqueH264Nal) {
          frame.opaque = opaqueH264Nal
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          // TODO error?
        }
      })

      this.h264Encoder.alpha.pull((alphaH264Nal) => {
        if (alphaH264Nal) {
          frame.alpha = alphaH264Nal
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          // TODO error?
        }
      })
    })
  }

  _frameToBuffer (frame) {
    const header = Buffer.allocUnsafe(12)
    const frameBuffer = Buffer.concat([header, frame.opaque, frame.alpha], header.length + frame.opaque.length + frame.alpha.length)

    frameBuffer.writeUInt16BE(frameBuffer.length, 0, true) // total buffer length
    frameBuffer.writeUInt16BE(header.length + frame.opaque.length, 2, true) // alpha offset
    frameBuffer.writeUInt16BE(frame.width, 4, true) // buffer width
    frameBuffer.writeUInt16BE(frame.height, 6, true) // buffer height
    frameBuffer.writeUInt32BE(frame.synSerial, 8, true) // frame serial

    return frameBuffer
  }

  sendFrame (frame) {
    if (this.localRtcDcBuffer === null) {
      return
    }

    if (this.localRtcDcBuffer.dataChannel.readyState === 'open') {
      const frameBuffer = this._frameToBuffer(frame)
      this.localRtcDcBuffer.dataChannel.send(frameBuffer.buffer.slice(frameBuffer.byteOffset, frameBuffer.byteOffset + frameBuffer.byteLength))
    } else {
      this.localRtcDcBuffer.dataChannel.onopen = () => {
        this.localRtcDcBuffer.dataChannel.onopen = null
        // make sure we don't send an old buffer
        if (frame.synSerial >= this.synSerial) {
          this.sendFrame(frame)
        }
      }
    }
    // if the ack times out & no newer serial is expected, we can retry sending the buffer contents
    setTimeout(() => {
      // If the syn serial at the time the timer was created is greater than the latest received ack serial and no newer serial is expected,
      // then we have not received an ack that matches or is newer than the syn we're checking. We resend the frame.
      if (frame.synSerial > this.ackSerial && frame.synSerial === this.synSerial) {
        // console.log('send timed out. resending')
        this.sendFrame(frame)
      }
      // TODO dynamically adjust to expected roundtrip time which could (naively) be calculated by measuring the latency
      // between a (syn & ack)/2 + frame bandwidth.
    }, 500)
  }

  commit (resource) {
    if (this.buffer) {
      this.buffer.release()
      this.buffer.removeDestroyListener(this.bufferDestroyListener)
    }

    if (this.pendingBuffer) {
      this.pendingBuffer.removeDestroyListener(this.pendingBufferDestroyListener)
    }
    this.buffer = this.pendingBuffer
    this.pendingBuffer = null
    // TODO handle destruction of committed buffer?

    if (this.buffer && this.localRtcDcBuffer) {
      this.buffer.addDestroyListener(this.bufferDestroyListener)
      this.localRtcDcBuffer.ack = (serial) => {
        if (serial > this.ackSerial) {
          this.ackSerial = serial
        } // else we received an outdated ack serial, ignore it.
      }

      this.synSerial++
      const synSerial = this.synSerial

      this.localRtcDcBuffer.rtcDcBufferProxy.syn(synSerial)
      this.encodeBuffer(this.buffer, synSerial).then((frame) => {
        this.sendFrame(frame)
      }).catch((error) => {
        console.log(error)
        // TODO Failed to encode buffer. What to do here?
      })
    }

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
