'use strict'

const gstreamer = require('gstreamer-superficial')
const WlShmFormat = require('./protocol/wayland/WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedFrameFragment = require('./EncodedFrameFragment')

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
      this._sink.pull((opaqueJpeg) => {
        if (opaqueJpeg) {
          resolve(opaqueJpeg)
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer opaque jpeg encoder pipeline is probably in error.'))
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
   * @param {Array<{x:number, y:number, width:number, height:number}>}damage
   * @return {Promise<EncodedFrame>}
   * @override
   */
  async encodeBuffer (pixelBuffer, wlShmFormat, bufferWidth, bufferHeight, serial, damage) {
    if (damage.length) {
      const encodedFrameFragments = await Promise.all(damage.map(damageRect => {
        return this._encodeFragment(pixelBuffer, wlShmFormat, damageRect.x, damageRect.y, damageRect.width, damageRect.height)
      }))
      return EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, encodedFrameFragments)
    } else {
      const encodedFrameFragment = await this._encodeFragment(pixelBuffer, wlShmFormat, 0, 0, bufferWidth, bufferHeight)
      return EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, [encodedFrameFragment])
    }
  }
}

module.exports = JpegOpaqueEncoder
