'use strict'

const {Shm} = require('wayland-server-bindings-runtime')

const WlSurfaceRequests = require('./protocol/wayland/WlSurfaceRequests')
const WlCallback = require('./protocol/wayland/WlCallback')
const LocalCallback = require('./LocalCallback')
const ShimCallback = require('./ShimCallback')
const Encoder = require('./Encoder')

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
   */
  constructor (grSurfaceProxy, rtcBufferFactory) {
    super()
    this.proxy = grSurfaceProxy
    this.rtcBufferFactory = rtcBufferFactory

    this.pendingBuffer = null
    this.buffer = null
    this.synSerial = 0
    this.ackSerial = 0
    this._encoder = Encoder.create()

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

  _encodeBuffer (buffer, synSerial) {
    const shm = Shm.get(buffer)
    if (shm === null) {
      // FIXME protocol error & disconnect client
      throw new Error('Unsupported buffer type.')
    }

    const bufferWidth = shm.getWidth()
    const bufferHeight = shm.getHeight()
    const pixelBuffer = shm.getData().reinterpret(bufferWidth * bufferHeight * 4)
    const format = shm.getFormat()

    return this._encoder.encodeBuffer(pixelBuffer, format, bufferWidth, bufferHeight, synSerial)
  }

  _frameToBuffer (frame) {
    const header = Buffer.allocUnsafe(13)
    const frameBuffer = Buffer.concat([header, frame.opaque, frame.alpha], header.length + frame.opaque.length + frame.alpha.length)

    frameBuffer.writeUInt32BE(header.length + frame.opaque.length, 0, true) // alpha offset
    frameBuffer.writeUInt16BE(frame.width, 4, true) // buffer width
    frameBuffer.writeUInt16BE(frame.height, 6, true) // buffer height
    frameBuffer.writeUInt32BE(frame.synSerial, 8, true) // frame serial
    frameBuffer.writeUInt8(frame.type, 12, true) // frame type

    return frameBuffer
  }

  _toBufferChunks (buffer, serial) {
    // certain webrtc implementations don't like it when data is > 16kb, so have have to split our buffer in chunks
    // TODO we could also set our chunk size to MTU (~1280 bytes) so they fit into a single UDP packet, on the receiving
    // end we could reconstruct these chunks and construct an incomplete NAL for partial decoding in case a chunk is missing.
    // ...patches welcome!
    const chunkSize = 16 * (1024 - 12) // 1012 because we reserve another 12 for the chunk header 1012+12=1024
    let nroChunks = 1
    if (buffer.length > chunkSize) {
      nroChunks = Math.ceil(buffer.length / chunkSize)
    }

    const chunks = []
    let chunkIdx = nroChunks
    while (chunkIdx > 0) {
      chunkIdx--
      const chunkHeader = Buffer.allocUnsafe(12)
      chunkHeader.writeUInt32BE(serial, 0, true)
      chunkHeader.writeUInt32BE(nroChunks, 4, true)
      chunkHeader.writeUInt32BE(chunkIdx, 8, true)
      const chunkStart = chunkIdx * chunkSize
      const chunkEnd = chunkStart + chunkSize
      const bufferChunk = Buffer.concat([chunkHeader, buffer.slice(chunkStart, chunkEnd)])
      chunks.push(bufferChunk)
    }
    return chunks
  }

  async sendFrame (frame) {
    if (this.localRtcDcBuffer === null) {
      return
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

    const dataChannel = await this.localRtcDcBuffer.localRtcBlobTransfer.open()
    const frameBuffer = this._frameToBuffer(frame)
    const bufferChunks = this._toBufferChunks(frameBuffer, frame.synSerial)
    bufferChunks.forEach((chunk) => {
      dataChannel.send(chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength))
    })
  }

  async commit (resource) {
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
      this.proxy.commit()
      const frame = await this._encodeBuffer(this.buffer, synSerial)
      this.sendFrame(frame)
    }
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
