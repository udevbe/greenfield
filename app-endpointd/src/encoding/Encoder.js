'use strict'

const config = require('../config')

// const JpegOpaqueEncoder = require('./JpegOpaqueEncoder')
// const JpegAlphaEncoder = require('./JpegAlphaEncoder')
const H264OpaqueEncoder = require('./H264OpaqueEncoder')
const H264AlphaEncoder = require('./H264AlphaEncoder')
const PNGEncoder = require('./PNGEncoder')
const WlShmFormat = require('./WlShmFormat')

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
    this._bufferFormat = 0
    /**
     * @type {JpegAlphaEncoder | JpegOpaqueEncoder | H264AlphaEncoder | H264OpaqueEncoder}
     * @private
     */
    this._frameEncoder = null
    /**
     * @type {PNGEncoder}
     * @private
     */
    this._pngFrameEncoder = null
    /**
     * @type {Array<{pixelBuffer:Buffer, bufferFormat:number, bufferWidth:number, bufferHeight:number, serial:number, resolve: function(EncodedFrame):void}>}
     * @private
     */
    this._queue = []
  }

  _doEncodeBuffer () {
    const { pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, resolve } = this._queue[0]

    let encodingPromise = null

    const bufferArea = bufferWidth * bufferHeight
    if (bufferArea <= config['encoder']['max-png-buffer-size']) {
      encodingPromise = this._encodePNGFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial)
    } else {
      encodingPromise = this._encodeFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial)
    }

    encodingPromise.then((encodedFrame) => {
      this._queue.shift()
      if (this._queue.length) {
        this._doEncodeBuffer()
      }
      resolve(encodedFrame)
    })
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @override
   */
  encodeBuffer (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial) {
    if (this._bufferFormat !== bufferFormat) {
      this._bufferFormat = bufferFormat
      this._frameEncoder = null
    }

    return new Promise((resolve) => {
      this._queue.push({ pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial, resolve })
      if (this._queue.length === 1) {
        this._doEncodeBuffer()
      }
    })
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @private
   */
  _encodePNGFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial) {
    if (!this._pngFrameEncoder) {
      this._pngFrameEncoder = PNGEncoder.create(bufferWidth, bufferHeight, bufferFormat)
    }
    return this._pngFrameEncoder.encodeBuffer(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial)
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @private
   */
  async _encodeFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial) {
    if (!this._frameEncoder) {
      this._frameEncoder = Encoder.types[bufferFormat].FrameEncoder.create(bufferWidth, bufferHeight, bufferFormat)
    }
    return this._frameEncoder.encodeBuffer(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, serial)
  }
}

// wayland to gstreamer mappings
Encoder.types = {}
// TODO add more types
// TODO different frame encoders could probably share code from a common super class
Encoder.types[WlShmFormat.argb8888] = {
  FrameEncoder: H264AlphaEncoder
}
Encoder.types[WlShmFormat.xrgb8888] = {
  FrameEncoder: H264OpaqueEncoder
}

module.exports = Encoder
