'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class H264AlphaEncoder {
  static create (width, height) {
    const multipassCacheFileName = `x264_${Math.random() * 1024}.log`
    const pipeline = new gstreamer.Pipeline(
      'appsrc name=source ! ' + // source caps are set in configure method
      'videoconvert ! videoscale ! video/x-raw,format=I420 ! ' +
      'capsfilter name=scale ! ' + // target caps are set in configure method
      `x264enc multipass-cache-file=${multipassCacheFileName} key-int-max=900 byte-stream=true pass=pass1 qp-max=32 tune=zerolatency speed-preset=veryfast intra-refresh=0 ! ` +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=20/1 ! ' +
      'appsink name=sink'
    )

    const appsink = pipeline.findChild('sink')
    const alphasink = pipeline.findChild('alphasink')
    const appsrc = pipeline.findChild('source')
    const scale = pipeline.findChild('scale')
    return new H264AlphaEncoder(pipeline, appsink, alphasink, appsrc, scale, width, height)
  }

  constructor (pipeline, appsink, alphasink, appsrc, scale, width, height) {
    this.pipeline = pipeline
    this.sink = appsink
    this.alpha = alphasink
    this.src = appsrc
    this.scale = scale
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
    // source caps describe what goes in
    this.src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=20/1`
    // x264 encoder requires size to be a multiple of 2
    const vidWidth = width + (width % 2)
    const vidHeight = height + (height % 2)
    // target caps describe what we want
    this.scale.caps = `video/x-raw,width=${vidWidth},height=${vidHeight}`
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

      this.src.push(pixelBuffer)

      const frame = {
        type: 0, // 0=h264
        width: bufferWidth,
        height: bufferHeight,
        synSerial: synSerial,
        opaque: null, // only use opaque, as plain h264 has no alpha channel
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
    })
  }
}
