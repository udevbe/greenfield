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

const gstreamer = require('gstreamer-superficial')
const Logger = require('pino')

const WlShmFormat = require('./WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedFrameFragment = require('./EncodedFrameFragment')
const EncodingOptions = require('./EncodingOptions')
const { png } = require('./EncodingTypes')

const gstFormats = {
  [WlShmFormat.argb8888]: 'BGRA',
  [WlShmFormat.xrgb8888]: 'BGRx'
}

const logger = Logger({
  name: `png-encoder`,
  prettyPrint: (process.env.DEBUG && process.env.DEBUG == true),
  level: (process.env.DEBUG && process.env.DEBUG == true) ? 20 : 30
})

/**
 * @implements FrameEncoder
 */
class PNGEncoder {
  /**
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @return {PNGEncoder}
   */
  static create (width, height, wlShmFormat) {
    const gstBufferFormat = gstFormats[wlShmFormat]
    // This adds transparent padding to make the image at least 16x16, else the png encoder will resize the image
    const rightPadding = width < 16 ? width - 16 : 0
    const bottomPadding = height < 16 ? height - 16 : 0

    const pipeline = new gstreamer.Pipeline(
      `appsrc do-timestamp=true name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1 !
      videobox name=videobox border-alpha=0.0 bottom=${bottomPadding} right=${rightPadding} !
      videoconvert ! videoscale ! 
      pngenc ! 
      appsink name=sink`
    )
    const sink = pipeline.findChild('sink')
    const src = pipeline.findChild('source')
    const videobox = pipeline.findChild('videobox')
    pipeline.play()

    return new PNGEncoder(pipeline, sink, src, width, height, wlShmFormat, videobox)
  }

  /**
   * @param {Object}pipeline
   * @param {Object}sink
   * @param {Object}src
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @param {Object}videobox
   */
  constructor (pipeline, sink, src, width, height, wlShmFormat, videobox) {
    /**
     * @type {Object}
     * @private
     */
    this._pipeline = pipeline
    /**
     * @type {Object}
     * @private
     */
    this._sink = sink
    /**
     * @type {Object}
     * @private
     */
    this._src = src
    /**
     * @type {number}
     * @private
     */
    this._width = width
    /**
     * @type {number}
     * @private
     */
    this._height = height
    /**
     * @type {number}
     * @private
     */
    this._wlShmFormat = wlShmFormat
    /**
     * @type {Object}
     * @private
     */
    this._videobox = videobox
  }

  /**
   * @param {number}width
   * @param {number}height
   * @param {string}gstBufferFormat
   * @private
   */
  _configure (width, height, gstBufferFormat) {
    this._src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1`
    const rightPadding = width < 16 ? width - 16 : 0
    const bottomPadding = height < 16 ? height - 16 : 0
    this._videobox.bottom = bottomPadding
    this._videobox.right = rightPadding
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}wlShmFormat
   * @param {number}x
   * @param {number}y
   * @param {number}width
   * @param {number}height
   * @return {Promise<EncodedFrameFragment>}
   * @private
   */
  async _encodeFragment (pixelBuffer, wlShmFormat, x, y, width, height) {
    if (this._width !== width || this._height !== height || this._wlShmFormat !== wlShmFormat) {
      this._width = width
      this._height = height
      this._wlShmFormat = wlShmFormat

      const gstBufferFormat = gstFormats[wlShmFormat]
      this._configure(width, height, gstBufferFormat)
    }

    const opaquePromise = new Promise((resolve, reject) => {
      this._sink.pull((pngImage) => {
        if (pngImage) {
          resolve(pngImage)
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer png encoder pipeline is probably in error.'))
        }
      })
    })

    this._src.push(pixelBuffer)

    logger.debug(`Waiting for PNG encoder to finish...`)
    const opaque = await opaquePromise
    logger.debug(`...PNG encoder finished.`)

    return EncodedFrameFragment.create(x, y, width, height, opaque, Buffer.allocUnsafe(0))
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}wlShmFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @return {Promise<EncodedFrame>}
   * @override
   */
  async encodeBuffer (pixelBuffer, wlShmFormat, bufferWidth, bufferHeight, serial) {
    const encodingOptions = EncodingOptions.enableFullFrame(0)
    const encodedFrameFragment = await this._encodeFragment(pixelBuffer, wlShmFormat, 0, 0, bufferWidth, bufferHeight)
    return EncodedFrame.create(serial, png, encodingOptions, bufferWidth, bufferHeight, [encodedFrameFragment])
  }
}

module.exports = PNGEncoder
