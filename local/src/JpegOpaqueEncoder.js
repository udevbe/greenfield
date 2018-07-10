'use strict'

const gstreamer = require('gstreamer-superficial')

// TODO replace gstreamer pipeline with a custom opengl accelrated jpeg encoder implementation
module.exports = class H264OpaqueEncoder {
  static create (width, height, gstBufferFormat) {
    const pipeline = new gstreamer.Pipeline(
      `appsrc name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1 ! 
      glupload ! 
      glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! 
      gldownload ! 
      jpegenc ! 
      appsink name=sink`
    )

    const alphasink = pipeline.findChild('alphasink')
    const sink = pipeline.findChild('sink')
    const src = pipeline.findChild('source')
    pipeline.play()

    return new H264OpaqueEncoder(pipeline, sink, alphasink, src, width, height)
  }

  constructor (pipeline, appsink, alphasink, appsrc, width, height) {
    this.pipeline = pipeline
    this.sink = appsink
    this.alpha = alphasink
    this.src = appsrc
    this.width = width
    this.height = height
  }

  /**
   * @param {number}width
   * @param {number}height
   * @param {string}gstBufferFormat
   */
  configure (width, height, gstBufferFormat) {
    this.width = width
    this.height = height
    this.format = gstBufferFormat
    this.pipeline.pause()
    this.src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=0/1`
    this.pipeline.play()
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

      const frame = {
        type: 2, // 0=jpeg
        width: bufferWidth,
        height: bufferHeight,
        synSerial: synSerial,
        opaque: null, // only use opaque, as plain jpeg has no alpha channel
        alpha: Buffer.allocUnsafe(0) // alloc empty buffer to avoid null errors
      }

      this.sink.pull((opaqueH264Nal) => {
        if (opaqueH264Nal) {
          frame.opaque = opaqueH264Nal
          resolve(frame)
        } else {
          reject(new Error('Pulled empty buffer. Gstreamer h264 encoder pipeline is probably in error.'))
        }
      })

      this.src.push(pixelBuffer)
    })
  }
}
