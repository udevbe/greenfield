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

const WlShmFormat = require('./WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedFrameFragment = require('./EncodedFrameFragment')
const EncodingOptions = require('./EncodingOptions')

const { h264 } = require('./EncodingTypes')

const appEndpointNative = require('../../build/Release/app-endpoint-encoding')

const gstFormats = {
  [WlShmFormat.argb8888]: 'BGRA',
  [WlShmFormat.xrgb8888]: 'BGRx'
}

/**
 * @implements FrameEncoder
 */
class NVH264AlphaEncoder {
  /**
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @return {NVH264AlphaEncoder}
   */
  static create (width, height, wlShmFormat) {
    const gstBufferFormat = gstFormats[wlShmFormat]
    const nvh264AlphaEncoder = new NVH264AlphaEncoder()
    nvh264AlphaEncoder._encodingContext = appEndpointNative.createEncoder(
      'nv264_alpha', gstBufferFormat, width, height,
      opaqueH264 => {
        nvh264AlphaEncoder._opaque = opaqueH264
        if (nvh264AlphaEncoder._opaque && nvh264AlphaEncoder._alpha) {
          nvh264AlphaEncoder._encodingResolve()
        }
      },
      alphaH264 => {
        nvh264AlphaEncoder._alpha = alphaH264
        if (nvh264AlphaEncoder._opaque && nvh264AlphaEncoder._alpha) {
          nvh264AlphaEncoder._encodingResolve()
        }
      })
    return nvh264AlphaEncoder
  }

  /**
   * @private
   */
  constructor () {
    /**
     * @type {Object}
     * @private
     */
    this._encodingContext = null
    this._opaque = null
    this._alpha = null
    this._encodingResolve = null
  }

  /**
   * @param {Object}pixelBuffer
   * @param {number}wlShmFormat
   * @param {number}x
   * @param {number}y
   * @param {number}width
   * @param {number}height
   * @param {number}stride
   * @return {Promise<EncodedFrameFragment>}
   * @private
   */
  async _encodeFragment (pixelBuffer, wlShmFormat, x, y, width, height, stride) {
    const gstBufferFormat = gstFormats[wlShmFormat]

    const encodingPromise = new Promise(resolve => {
      this._alpha = null
      this._opaque = null
      this._encodingResolve = resolve
      appEndpointNative.encodeBuffer(this._encodingContext, pixelBuffer, gstBufferFormat, width, height, stride)
    })

    await encodingPromise
    return EncodedFrameFragment.create(x, y, width, height, this._opaque, this._alpha)
  }

  /**
   * @param {Object}pixelBuffer
   * @param {number}wlShmFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}bufferStride
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @override
   */
  async encodeBuffer (pixelBuffer, wlShmFormat, bufferWidth, bufferHeight, bufferStride, serial) {
    let encodingOptions = 0
    encodingOptions = EncodingOptions.enableSplitAlpha(encodingOptions)
    encodingOptions = EncodingOptions.enableFullFrame(encodingOptions)
    const encodedFrameFragment = await this._encodeFragment(pixelBuffer, wlShmFormat, 0, 0, bufferWidth, bufferHeight, bufferStride)
    return EncodedFrame.create(serial, h264, encodingOptions, bufferWidth, bufferHeight, [encodedFrameFragment])
  }
}

module.exports = NVH264AlphaEncoder
