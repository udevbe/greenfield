'use strict'

const gstreamer = require('gstreamer-superficial')

const WlShmFormat = require('./WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedFrameFragment = require('./EncodedFrameFragment')
const EncodingOptions = require('./EncodingOptions')
const {png} = require('./EncodingTypes')

const gstFormats = {
  [WlShmFormat.argb8888]: 'BGRA',
  [WlShmFormat.xrgb8888]: 'BGRx'
}

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
    const pipeline = new gstreamer.Pipeline(
      `appsrc name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1 ! 
      videoconvert ! videoscale  ! capsfilter name=scale caps=video/x-raw,format=RGBA,width=${width},height=${height},framerate=60/1 ! 
      pngenc ! 
      appsink name=sink`
    )
    const sink = pipeline.findChild('sink')
    const src = pipeline.findChild('source')
    const scale = pipeline.findChild('scale')
    pipeline.play()

    return new PNGEncoder(pipeline, sink, src, scale, width, height, wlShmFormat)
  }

  /**
   * @param {Object}pipeline
   * @param {Object}sink
   * @param {Object}src
   * @param {Object}scale
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   */
  constructor (pipeline, sink, src, scale, width, height, wlShmFormat) {
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
     * @type {Object}
     * @private
     */
    this._scale = scale
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
  }

  /**
   * @param {number}width
   * @param {number}height
   * @param {string}gstBufferFormat
   * @private
   */
  _configure (width, height, gstBufferFormat) {
    this._src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1`
    this._scale.caps = `video/x-raw,width=${width},height=${height},framerate=60/1`
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

    // TODO we probably want to put this in it's own process so we can easily run this long running task in parallel
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

    const opaque = await opaquePromise
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
