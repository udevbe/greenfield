'use strict'

const gstreamer = require('gstreamer-superficial')
const WlShmFormat = require('./protocol/wayland/WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedBuffer = require('./EncodedBuffer')

const {jpeg} = require('./EncodingTypes')

const gstFormats = {
  [WlShmFormat.argb8888]: 'BGRA',
  [WlShmFormat.xrgb8888]: 'BGRx'
}

// TODO replace gstreamer pipeline with a custom opengl accelrated jpeg encoder implementation
/**
 * @implements FrameEncoder
 */
class JpegOpaqueEncoder {
  /**
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @return {JpegOpaqueEncoder}
   */
  static create (width, height, wlShmFormat) {
    const gstBufferFormat = gstFormats[wlShmFormat]
    const pipeline = new gstreamer.Pipeline(
      `appsrc name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1 ! 
      glupload ! 
      glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! 
      gldownload ! 
      jpegenc ! 
      appsink name=sink`
    )

    const sink = pipeline.findChild('sink')
    const src = pipeline.findChild('source')
    pipeline.play()

    return new JpegOpaqueEncoder(pipeline, sink, src, width, height, wlShmFormat)
  }

  /**
   * @param {Object}pipeline
   * @param {Object}sink
   * @param {Object}src
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @private
   */
  constructor (pipeline, sink, src, width, height, wlShmFormat) {
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
  }

  /**
   * @param {number}width
   * @param {number}height
   * @param {string}gstBufferFormat
   * @private
   */
  _configure (width, height, gstBufferFormat) {
    this._src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1`
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

      const opaqueEncodedBuffers = []
      const alphaEncodedBuffers = []
      const encodedFrame = EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, opaqueEncodedBuffers, alphaEncodedBuffers)

      this._sink.pull((opaqueJpeg) => {
        if (opaqueJpeg) {
          opaqueEncodedBuffers.push(EncodedBuffer.create(0, 0, bufferWidth, bufferHeight, opaqueJpeg))
          if (opaqueEncodedBuffers.length) {
            resolve(encodedFrame)
          }
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer opaque jpeg encoder pipeline is probably in error.'))
        }
      })

      this._src.push(pixelBuffer)
    })
  }
}

module.exports = JpegOpaqueEncoder
