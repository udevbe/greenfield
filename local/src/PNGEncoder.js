'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class PNGEncoder {
  /**
   * @return {module.PNGEncoder}
   */
  static create () {
    const pipeline = new gstreamer.Pipeline(
      'appsrc name=source ! ' + // source caps are set in configure method
      'videoconvert ! capsfilter name=scale !' + // target caps are set in configure method
      'pngenc !' +
      'appsink name=sink'
    )
    const appsink = pipeline.findChild('sink')
    const appsrc = pipeline.findChild('source')
    const scale = pipeline.findChild('scale')
    return new PNGEncoder(pipeline, appsink, appsrc, scale)
  }

  constructor (pipeline, appsink, appsrc, scale) {
    this.pipeline = pipeline
    this.sink = appsink
    this.src = appsrc
    this.scale = scale
    this.width = null
    this.height = null
    this.format = null
  }

  configure (width, height, gstBufferFormat) {
    this.width = width
    this.height = height
    this.format = gstBufferFormat
    this.pipeline.pause()
    this.src.setCapsFromString(`video/x-raw,format=${gstBufferFormat},width=${width},height=${height}`)
    this.scale.setCapsFromString(`video/x-raw,format=RGBA,width=${width},height=${height}`)
    this.pipeline.play()
  }

  encode (pixelBuffer, gstBufferFormat, bufferWidth, bufferHeight, synSerial) {
    return new Promise((resolve, reject) => {
      if (this.width !== bufferWidth || this.height !== bufferHeight || this.format !== gstBufferFormat) {
        this.configure(bufferWidth, bufferHeight, gstBufferFormat)
      }

      this.src.push(pixelBuffer)

      const frame = {
        type: 1, // 1=png
        width: bufferWidth,
        height: bufferHeight,
        synSerial: synSerial,
        opaque: null, // only use opaque, as png has build in alpha channel
        alpha: Buffer.allocUnsafe(0) // alloc empty buffer to avoid null errors
      }

      this.sink.pull((pngImage) => {
        if (pngImage) {
          frame.opaque = pngImage
          resolve(frame)
        } else {
          reject(new Error('Pulled empty buffer. Gstreamer png encoder pipeline is probably in error.'))
        }
      })
    })
  }
}
