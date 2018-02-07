'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class H264AlphaEncoder {
  static create (width, height) {
    const scaledWidth = width + (width % 2)
    const scaledHeight = height + (height % 2)

    const pipeline = new gstreamer.Pipeline(
      'appsrc name=source ! ' +
      'glupload ! ' +
      'glcolorconvert ! video/x-raw(memory:GLMemory),format=RGBA ! ' +
      'glcolorscale ! video/x-raw(memory:GLMemory),width=' + scaledWidth + ',height=' + scaledHeight + ' ! ' +
      'glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! ' +
      'gldownload ! ' +
      'x264enc key-int-max=900 byte-stream=true pass=pass1 qp-max=32 tune=zerolatency speed-preset=veryfast intra-refresh=0 ! ' +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=20/1 ! ' +
      'appsink name=sink'
    )

    const appsink = pipeline.findChild('sink')
    const alphasink = pipeline.findChild('alphasink')
    const appsrc = pipeline.findChild('source')
    return new H264AlphaEncoder(pipeline, appsink, alphasink, appsrc, width, height)
  }

  constructor (pipeline, appsink, alphasink, appsrc, width, height) {
    this.pipeline = pipeline
    this.sink = appsink
    this.alpha = alphasink
    this.src = appsrc
    this.width = width
    this.height = height
  }
}
