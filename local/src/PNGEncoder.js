'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class PNGEncoder {
  /**
   * @return {module.PNGEncoder}
   */
  static create (width, height, gstBufferFormat) {
    const pipeline = new gstreamer.Pipeline(
      `appsrc name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=0/1 ! ` +
      `videoconvert ! videoscale  ! capsfilter name=scale caps=video/x-raw,format=RGBA,width=${width},height=${height},framerate=0/1 !` +
      'pngenc !' +
      'appsink name=sink'
    )
    const sink = pipeline.findChild('sink')
    const src = pipeline.findChild('source')
    const scale = pipeline.findChild('scale')
    pipeline.play()

    return new PNGEncoder(pipeline, sink, src, scale, width, height, gstBufferFormat)
  }

  constructor (pipeline, sink, src, scale, width, height, gstBufferFormat) {
    this.pipeline = pipeline
    this.sink = sink
    this.src = src
    this.scale = scale
    this.width = width
    this.height = height
    this.format = gstBufferFormat
  }

  /**
   * @param {number}width
   * @param {number}height
   * @param {string}gstBufferFormat
   */
  configure (width, height, gstBufferFormat) {
    // source caps describe what goes in
    this.src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=0/1`
    // target caps describe what we want
    this.scale.caps = `video/x-raw,width=${width},height=${height},framerate=0/1`
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {string}gstBufferFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}synSerial
   */
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
