'use strict'

const config = require('./config')

const JpegOpaqueEncoder = require('./JpegOpaqueEncoder')
const JpegAlphaEncoder = require('./JpegAlphaEncoder')
const PNGEncoder = require('./PNGEncoder')
const WlShmFormat = require('./protocol/wayland/WlShmFormat')

/**
 * @implements FrameEncoder
 */
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
     * @type {JpegAlphaEncoder | JpegOpaqueEncoder}
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
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @param {Array<{x:number, y:number, width:number, height:number}>}bufferDamage
   * @return {Promise<EncodedFrame>}
   * @override
   */
  encodeBuffer (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage) {
    if (this._bufferFormat !== bufferFormat) {
      this._bufferFormat = bufferFormat
      this._frameEncoder = null
    }

    const bufferArea = bufferWidth * bufferHeight
    if (bufferArea <= config['png-encoder']['max-target-buffer-size']) {
      return this._encodePNGFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage)
    } else {
      return this._encodeFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage)
    }
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @param {Array<{x:number, y:number, width:number, height:number}>}bufferDamage
   * @return {Promise<EncodedFrame>}
   * @private
   */
  _encodePNGFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage) {
    if (!this._pngFrameEncoder) {
      this._pngFrameEncoder = PNGEncoder.create(bufferWidth, bufferHeight, bufferFormat)
    }
    return this._pngFrameEncoder.encodeBuffer(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage)
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @param {Array<{x:number, y:number, width:number, height:number}>}bufferDamage
   * @return {Promise<EncodedFrame>}
   * @private
   */
  _encodeFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage) {
    if (!this._frameEncoder) {
      this._frameEncoder = Encoder.types[bufferFormat].FrameEncoder.create(bufferWidth, bufferHeight, bufferFormat)
    }
    return this._frameEncoder.encodeBuffer(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, bufferDamage)
  }
}

// wayland to gstreamer mappings
Encoder.types = {}
// TODO add more types
// TODO different frame encoders could probably share code from a common super class
Encoder.types[WlShmFormat.argb8888] = {
  // gstFormat: 'BGRA',
  FrameEncoder: JpegAlphaEncoder
}
Encoder.types[WlShmFormat.xrgb8888] = {
  // gstFormat: 'BGRx',
  FrameEncoder: JpegOpaqueEncoder
}

module.exports = Encoder
