'use strict'

const gstreamer = require('gstreamer-superficial')
const WlShmFormat = require('./WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedFrameFragment = require('./EncodedFrameFragment')
const EncodingOptions = require('./EncodingOptions')

const {h264} = require('./EncodingTypes')

const gstFormats = {
  [WlShmFormat.argb8888]: 'BGRA',
  [WlShmFormat.xrgb8888]: 'BGRx'
}

/**
 * @implements FrameEncoder
 */
class H264OpaqueEncoder {
  /**
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @return {H264OpaqueEncoder}
   */
  static create (width, height, wlShmFormat) {
    const gstBufferFormat = gstFormats[wlShmFormat]
    const pipeline = new gstreamer.Pipeline(
      `appsrc name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1 ! 
      videoscale ! capsfilter name=scale caps=video/x-raw,width=${width + (width % 2)},height=${height + (height % 2)} ! 
      glupload ! 
      glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! 
      gldownload ! 
      x264enc key-int-max=1 byte-stream=true pass=quant qp-max=32 tune=zerolatency speed-preset=veryfast intra-refresh=0 ! 
      video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=60/1 ! 
      appsink name=sink`
    )

    const sink = pipeline.findChild('sink')
    const src = pipeline.findChild('source')
    const scale = pipeline.findChild('scale')
    pipeline.play()

    return new H264OpaqueEncoder(pipeline, sink, src, width, height, wlShmFormat, scale)
  }

  /**
   * @param {Object}pipeline
   * @param {Object}sink
   * @param {Object}src
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @param {Object}scale
   * @private
   */
  constructor (pipeline, sink, src, width, height, wlShmFormat, scale) {
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
    this._scale = scale
  }

  /**
   * @param {number}width
   * @param {number}height
   * @param {string}gstBufferFormat
   * @private
   */
  _configure (width, height, gstBufferFormat) {
    this._pipeline.pause()
    this._src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1`
    this._scale.caps = `video/x-raw,width=${width + (width % 2)},height=${height + (height % 2)}`
    this._pipeline.play()
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
      this._sink.pull((opaqueH264) => {
        if (opaqueH264) {
          resolve(opaqueH264)
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer opaque h264 encoder pipeline is probably in error.'))
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
    let encodingOptions = 0
    if (damage.length) {
      const encodedFrameFragments = await Promise.all(damage.map(damageRect => {
        return this._encodeFragment(pixelBuffer, wlShmFormat, damageRect.x, damageRect.y, damageRect.width, damageRect.height)
      }))
      return EncodedFrame.create(serial, h264, encodingOptions, bufferWidth, bufferHeight, encodedFrameFragments)
    } else {
      encodingOptions = EncodingOptions.enableFullFrame(encodingOptions)
      const encodedFrameFragment = await this._encodeFragment(pixelBuffer, wlShmFormat, 0, 0, bufferWidth, bufferHeight)
      return EncodedFrame.create(serial, h264, encodingOptions, bufferWidth, bufferHeight, [encodedFrameFragment])
    }
  }
}

module.exports = H264OpaqueEncoder
