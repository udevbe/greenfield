'use strict'

const H264OpaqueEncoder = require('./H264AlphaEncoder')
const H264AlphaEncoder = require('./H264AlphaEncoder')
const PNGEncoder = require('./PNGEncoder')
const WlShmFormat = require('./protocol/wayland/WlShmFormat')

class Encoder {
  static create () {
    return new Encoder()
  }

  /**
   * Use Encoder.create() instead.
   * @private
   */
  constructor () {
    /**
     * @type {number}
     * @private
     */
    this._bufferFormat = null
    /**
     * @type {string}
     * @private
     */
    this._gstFormat = null
    /**
     * @type {H264AlphaEncoder | H264OpaqueEncoder}
     * @private
     */
    this._frameEncoder = null
    /**
     * @type {PNGEncoder}
     * @private
     */
    this._pngFrameEncoder = null
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {string}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}synSerial
   * @return {Promise<{type:number, width:number, height:number, synSerial:number, opaque: Buffer, alpha: Buffer}>}
   */
  encodeBuffer (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, synSerial) {
    if (this._bufferFormat !== bufferFormat) {
      this._bufferFormat = bufferFormat
      this._gstFormat = Encoder.types[bufferFormat].gstFormat
      this._frameEncoder = null
    }

    if (bufferWidth <= 128 || bufferHeight <= 128) {
      return this._encodePNGFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, synSerial)
    } else {
      return this._encodeFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, synSerial)
    }
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {string}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}synSerial
   * @return {Promise<{type:number, width:number, height:number, synSerial:number, opaque: Buffer, alpha: Buffer}>}
   * @private
   */
  _encodePNGFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, synSerial) {
    if (!this._pngFrameEncoder) {
      this._pngFrameEncoder = PNGEncoder.create(bufferWidth, bufferHeight, this._gstFormat)
    }
    return this._pngFrameEncoder.encode(pixelBuffer, this._gstFormat, bufferWidth, bufferHeight, synSerial)
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {string}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}synSerial
   * @return {Promise<{type:number, width:number, height:number, synSerial:number, opaque: Buffer, alpha: Buffer}>}
   * @private
   */
  _encodeFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, synSerial) {
    if (!this._frameEncoder) {
      this._frameEncoder = Encoder.types[this._bufferFormat].FrameEncoder.create(bufferWidth, bufferHeight, this._gstFormat)
    }
    return this._frameEncoder.encode(pixelBuffer, this._gstFormat, bufferWidth, bufferHeight, synSerial)
  }
}

// wayland to gstreamer mappings
Encoder.types = {}
// TODO add more types
// TODO different frame encoders could probably share code from a common super class
Encoder.types[WlShmFormat.argb8888] = {
  gstFormat: 'BGRA',
  FrameEncoder: H264AlphaEncoder
}
Encoder.types[WlShmFormat.xrgb8888] = {
  gstFormat: 'BGRx',
  FrameEncoder: H264OpaqueEncoder
}

module.exports = Encoder
