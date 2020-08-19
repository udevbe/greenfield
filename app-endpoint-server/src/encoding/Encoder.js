// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

const { sessionConfig } = require('../../config.json5')

const X264OpaqueEncoder = require('./X264OpaqueEncoder')
const NVH264OpaqueEncoder = require('./NVH264OpaqueEncoder')
const X264AlphaEncoder = require('./X264AlphaEncoder')
const NVH264AlphaEncoder = require('./NVH264AlphaEncoder')
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
     * @type {X264AlphaEncoder | X264OpaqueEncoder}
     * @private
     */
    this._frameEncoder = null
    /**
     * @type {PNGEncoder}
     * @private
     */
    this._pngFrameEncoder = null
    /**
     * @type {Array<{pixelBuffer:Buffer, bufferFormat:number, bufferWidth:number, bufferHeight:number, bufferStride:number, serial:number, resolve: function(EncodedFrame):void}>}
     * @private
     */
    this._queue = []
  }

  /**
   * @private
   */
  _doEncodeBuffer () {
    const { pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial, resolve, reject } = this._queue[0]

    try {
      let encodingPromise = null

      const bufferArea = bufferWidth * bufferHeight
      if (bufferArea <= sessionConfig.encoder.maxPngBufferSize) {
        encodingPromise = this._encodePNGFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial)
      } else {
        encodingPromise = this._encodeFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial)
      }

      encodingPromise.then(encodedFrame => {
        this._queue.shift()
        if (this._queue.length) {
          this._doEncodeBuffer()
        }
        resolve(encodedFrame)
      }).catch(error => reject(error))
    } catch (e) {
      reject(e)
    }
  }

  /**
   * @param {Object}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}bufferStride
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @override
   */
  encodeBuffer (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial) {
    if (this._bufferFormat !== bufferFormat) {
      this._bufferFormat = bufferFormat
      this._frameEncoder = null
    }

    return new Promise((resolve, reject) => {
      this._queue.push({ pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial, resolve, reject })
      if (this._queue.length === 1) {
        this._doEncodeBuffer()
      }
    })
  }

  /**
   * @param {Object}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @private
   */
  _encodePNGFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial) {
    if (!this._pngFrameEncoder) {
      this._pngFrameEncoder = PNGEncoder.create(bufferWidth, bufferHeight, bufferFormat)
    }
    return this._pngFrameEncoder.encodeBuffer(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial)
  }

  /**
   * @param {Object}pixelBuffer
   * @param {number}bufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @private
   */
  async _encodeFrame (pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial) {
    if (!this._frameEncoder) {
      this._frameEncoder = Encoder.types[bufferFormat][sessionConfig.encoder.h264Encoder].create(bufferWidth, bufferHeight, bufferFormat)
    }
    return this._frameEncoder.encodeBuffer(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial)
  }
}

// wayland to gstreamer mappings
Encoder.types = {}
// TODO add more types
// TODO different frame encoders could probably share code from a common super class
Encoder.types[WlShmFormat.argb8888] = {
  x264: X264AlphaEncoder,
  nvh264: NVH264AlphaEncoder
}
Encoder.types[WlShmFormat.xrgb8888] = {
  x264: X264OpaqueEncoder,
  nvh264: NVH264OpaqueEncoder
}

module.exports = Encoder
