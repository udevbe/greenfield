'use strict'

const gstreamer = require('gstreamer-superficial')

const WlShmFormat = require('./protocol/wayland/WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedBuffer = require('./EncodedBuffer')
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
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @param {Array<Rect>}damageRects
   * @return {Promise<EncodedFrame>}
   * @override
   */
  encodeBuffer (pixelBuffer, wlShmFormat, bufferWidth, bufferHeight, serial, damageRects) {
    // TODO use damage rects & pixman to only encode those parts of the pixelBuffer that have changed

    return new Promise((resolve, reject) => {
      if (this._width !== bufferWidth || this._height !== bufferHeight || this._wlShmFormat !== wlShmFormat) {
        this._width = bufferWidth
        this._height = bufferHeight
        this._wlShmFormat = wlShmFormat

        const gstBufferFormat = gstFormats[wlShmFormat]
        this._configure(bufferWidth, bufferHeight, gstBufferFormat)
      }

      // TODO use libpng directly
      this._sink.pull((pngImage) => {
        if (pngImage) {
          const encodedFrame = EncodedFrame.create(serial, png, bufferWidth, bufferHeight, [
            EncodedBuffer.create(0, 0, bufferWidth, bufferHeight, pngImage)
          ], [])
          resolve(encodedFrame)
        } else {
          reject(new Error('Pulled empty buffer. Gstreamer png encoder pipeline is probably in error.'))
        }
      })

      this._src.push(pixelBuffer)
    })
  }
}

module.exports = PNGEncoder
