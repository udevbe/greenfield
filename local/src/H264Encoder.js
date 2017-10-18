'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class H264Encoder {
  static create (width, height) {
    const pipeline = new gstreamer.Pipeline('appsrc name=source ! ' +
      'videoconvert ! video/x-raw,format=I420,width=' + width + ',height=' + height + ' !' +
      'x264enc byte-stream=true key-int-max=30 pass=pass1 tune=zerolatency threads=2 ip-factor=2 speed-preset=veryfast intra-refresh=0 qp-max=43 !' +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,framerate=30/1 !' +
      'appsink name=sink')
    const appsink = pipeline.findChild('sink')
    const appsrc = pipeline.findChild('source')
    return new H264Encoder(pipeline, appsink, appsrc, width, height)
  }

  constructor (pipeline, appsink, appsrc, width, height) {
    this.pipeline = pipeline
    this.sink = appsink
    this.src = appsrc
    this.width = width
    this.height = height
  }
}
