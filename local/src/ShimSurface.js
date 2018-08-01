'use strict'

const {Shm} = require('wayland-server-bindings-runtime')

const WlSurfaceRequests = require('./protocol/wayland/WlSurfaceRequests')
const WlCallback = require('./protocol/wayland/WlCallback')
const Encoder = require('./Encoder')

const LocalCallback = require('./LocalCallback')

class ShimSurface extends WlSurfaceRequests {
  /**
   * @param {GrSurface}grSurfaceProxy
   * @return {ShimSurface}
   */
  static create (grSurfaceProxy) {
    const rtcBufferFactory = grSurfaceProxy.connection._rtcBufferFactory
    const localRtcDcBuffer = rtcBufferFactory.createLocalRtcDcBuffer()
    return new ShimSurface(grSurfaceProxy, localRtcDcBuffer)
  }

  /**
   * @private
   * @param {GrSurface}grSurfaceProxy
   * @param {LocalRtcDcBuffer}localRtcDcBuffer
   */
  constructor (grSurfaceProxy, localRtcDcBuffer) {
    super()
    /**
     * @type {GrSurface}
     */
    this.proxy = grSurfaceProxy
    /**
     * @type {{buffer: WlBuffer|null, bufferTransform: number, bufferScale: number, bufferDamage: Array<{x:number, y:number, width:number, height:number}>, surfaceDamage: Array<{x:number, y:number, width:number, height:number}>}}
     * @private
     */
    this._pending = {
      /**
       * @type {WlBuffer|null}
       */
      buffer: null,
      /**
       * @type {number}
       */
      bufferTransform: 0,
      /**
       * @type {number}
       */
      bufferScale: 1,
      /**
       * @type {Array<{x:number, y:number, width:number, height:number}>}
       */
      bufferDamage: [],
      /**
       * @type {Array<{x:number, y:number, width:number, height:number}>}
       */
      surfaceDamage: []
    }
    /**
     * @type {number}
     * @private
     */
    this._bufferTransform = 0
    /**
     * @type {number}
     * @private
     */
    this._bufferScale = 1

    /**
     * @type {number}
     * @private
     */
    this._synSerial = 0
    /**
     * @private
     * @type {number}
     */
    this._ackSerial = 0
    /**
     * @type {Encoder}
     * @private
     */
    this._encoder = Encoder.create()
    /**
     * @type {LocalRtcDcBuffer}
     */
    this.localRtcDcBuffer = localRtcDcBuffer
    /**
     * @type {function(number):void}
     * @param serial
     */
    // use a single buffer to communicate with the browser. Contents of the buffer will be copied when send.
    this.localRtcDcBuffer.ack = (serial) => {
      if (serial > this._ackSerial) {
        this._ackSerial = serial
      } // else we received an outdated ack serial, ignore it.
    }
    /**
     * @type {function(number,number):void}
     * @param serial
     * @param frameDuration
     */
    this.localRtcDcBuffer.latency = (serial, frameDuration) => {
      this._frameDuration = frameDuration
    }
    /**
     * @type {function():void}
     * @private
     */
    this._pendingBufferDestroyListener = () => {
      this._pending.buffer = null
    }
    /**
     * @type {number}
     * @private
     */
    this._frameDuration = 0
    /**
     * @type {number}
     * @private
     */
    this._commitDuration = 0
    /**
     * @type {boolean}
     * @private
     */
    this._destroyed = false

    this._total = 0
    this._count = 0
  }

  /**
   * @param {WlSurface}resource
   */
  destroy (resource) {
    this.proxy.destroy()
    resource.destroy()
    this.localRtcDcBuffer.destroy()
    this.localRtcDcBuffer = null
    this._destroyed = true
  }

  get destroyed () {
    return this._destroyed
  }

  /**
   * @param {WlSurface}resource
   * @param {WlBuffer}buffer
   * @param {number}x
   * @param {number}y
   */
  attach (resource, buffer, x, y) {
    // TODO listen for buffer destruction & signal buffer proxy & remove local pending buffer
    if (this._pending.buffer) {
      this._pending.buffer.removeDestroyListener(this._pendingBufferDestroyListener)
    }
    this._pending.buffer = buffer
    if (this._pending.buffer) {
      this._pending.buffer.addDestroyListener(this._pendingBufferDestroyListener)
      this.proxy.attach(this.localRtcDcBuffer.grBufferProxy, x, y)
    } else {
      this.proxy.attach(null, x, y)
    }
  }

  /**
   * @param {WlSurface}resource
   * @param {number}x
   * @param {number}y
   * @param {number}width
   * @param {number}height
   */
  damage (resource, x, y, width, height) {
    this._pending.surfaceDamage.push({
      x: x,
      y: y,
      width: width,
      height: height
    })
    this.proxy.damage(x, y, width, height)
  }

  /**
   * @param {WlSurface}resource
   * @param {WlCallback}callback
   */
  frame (resource, callback) {
    const callbackProxy = this.proxy.frame()
    const localCallback = LocalCallback.create(callbackProxy)
    localCallback.resource = WlCallback.create(resource.client, 4, callback, {}, null)
    callbackProxy.listener = localCallback
  }

  /**
   * @param {WlSurface}resource
   * @param {WlRegion}region
   */
  setOpaqueRegion (resource, region) {
    const regionProxy = region === null ? null : region.implementation.proxy
    this.proxy.setOpaqueRegion(regionProxy)
  }

  /**
   * @param {WlSurface}resource
   * @param {WlRegion}region
   */
  setInputRegion (resource, region) {
    const regionProxy = region === null ? null : region.implementation.proxy
    this.proxy.setInputRegion(regionProxy)
  }

  /**
   * @param buffer
   * @param {number}synSerial
   * @param {Array<{x:number, y:number, width:number, height:number}>}surfaceDamage
   * @return {Promise<EncodedFrame>}
   * @private
   */
  _encodeBuffer (buffer, synSerial, surfaceDamage) {
    const shm = Shm.get(buffer)
    if (shm === null) {
      // FIXME protocol error & disconnect client
      throw new Error('Unsupported buffer type.')
    }

    const bufferWidth = shm.getWidth()
    const bufferHeight = shm.getHeight()
    const pixelBuffer = shm.getData().reinterpret(bufferWidth * bufferHeight * 4)
    const format = shm.getFormat()

    const bufferDamage = [] // TODO calculate buffer damage rectangles in native code using pixman & surface 2 buffer transformations
    return this._encoder.encodeBuffer(pixelBuffer, format, bufferWidth, bufferHeight, synSerial, bufferDamage)
  }

  /**
   * @param {Buffer}buffer
   * @param {number}serial
   * @return {Buffer[]}
   * @private
   */
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

  /**
   * @param {EncodedFrame}frame
   * @return {Promise<void>}
   */
  async sendFrame (frame) {
    if (this.localRtcDcBuffer === null) {
      return
    }

    // // TODO we could also try to ack each individual chunk, and only re-send missing ones
    // // if the ack times out & no newer serial is expected, we can retry sending the buffer contents
    // // TODO cancel timeout of we received the corresponding ack
    // setTimeout(async () => {
    //   // If the syn serial at the time the timer was created is greater than the latest received ack serial and no newer serial is expected,
    //   // then we have not received an ack that matches or is newer than the syn we're checking. We resend the frame.
    //   if (frame.serial > this._ackSerial && frame.serial === this._synSerial) {
    //     await this.sendFrame(frame)
    //   }
    //   // TODO keep sending until we received an ack
    // }, 250)

    const dataChannelPromise = this.localRtcDcBuffer.localRtcBlobTransfer.open()
    const frameBuffer = frame.toBuffer()
    const bufferChunks = this._toBufferChunks(frameBuffer, frame.serial)
    const dataChannel = await dataChannelPromise
    bufferChunks.forEach((chunk) => {
      dataChannel.send(chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength))
    })
  }

  /**
   * @param {WlSurface}resource
   * @return {Promise<void>}
   */
  async commit (resource) {
    const start = Date.now()
    // copy state to local variables
    this._synSerial++
    const synSerial = this._synSerial
    const buffer = this._pending.buffer
    const surfaceDamage = this._pending.surfaceDamage
    this._resetPendingState()

    if (buffer) {
      buffer.removeDestroyListener(this._pendingBufferDestroyListener)
      const frame = await this._encodeBuffer(buffer, synSerial, surfaceDamage)
      // surface might have been destroyed while we were busy encoding.
      if (this.destroyed) {
        return
      }
      buffer.release()
      this.localRtcDcBuffer.rtcDcBufferProxy.syn(synSerial)
      this.proxy.commit()

      await this.sendFrame(frame)
    } else {
      this.proxy.commit()
    }

    this._total += (Date.now() - start)
    this._count++
    console.log('commit avg', this._total / this._count)
  }

  _resetPendingState () {
    this._pending.buffer = null
    this._pending.bufferDamage = []
    this._pending.surfaceDamage = []
  }

  /**
   * @param {WlSurface}resource
   * @param {number}transform
   */
  setBufferTransform (resource, transform) {
    this._pending.bufferTransform = transform
    this.proxy.setBufferTransform(transform)
  }

  /**
   * @param {WlSurface}resource
   * @param {number}scale
   */
  setBufferScale (resource, scale) {
    this._pending.bufferScale = scale
    this.proxy.setBufferScale(scale)
  }

  /**
   * @param {WlSurface}resource
   * @param {number}x
   * @param {number}y
   * @param {number}width
   * @param {number}height
   */
  damageBuffer (resource, x, y, width, height) {
    this._pending.bufferDamage.push({
      x: x,
      y: y,
      width,
      height: height
    })
    this.proxy.damageBuffer(x, y, width, height)
  }
}

module.exports = ShimSurface
