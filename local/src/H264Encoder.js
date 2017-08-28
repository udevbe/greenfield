'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class H264Encoder {
  static create () {
    const pipeline = new gstreamer.Pipeline('videotestsrc pattern=0 is-live=true do-timestamp=true ! ' +
      'clockoverlay !' +
      'videorate ! video/x-raw,framerate=30/1 !' +
      'videoconvert ! video/x-raw,format=I420,width=1280,height=720 !' +
      'x264enc byte-stream=true key-int-max=30 pass=pass1 tune=zerolatency threads=2 ip-factor=2 speed-preset=veryfast intra-refresh=0 qp-max=43 !' +
      // 'vaapih264enc keyframe-period=600 rate-control=vbr bitrate=10000 !' +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,framerate=30/1 !' +
      'appsink max-buffers=1 drop=true name=sink')
    const appsink = pipeline.findChild('sink')

    return new H264Encoder(pipeline, appsink)
  }

  constructor (pipeline, appsink) {
    this.pipeline = pipeline
    this.appsink = appsink
  }
}
