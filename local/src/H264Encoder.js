'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class H264Encoder {
  static create (width, height) {
    const scaledWidth = width + (width % 2)
    const scaledHeight = height + (height % 2)

    const pipeline = new gstreamer.Pipeline(
      // scale & convert to RGBA
      'appsrc name=source ! ' +
      'glupload ! ' +
      'glcolorconvert ! video/x-raw(memory:GLMemory),format=RGBA ! ' +
      'glcolorscale ! video/x-raw(memory:GLMemory),width=' + scaledWidth + ',height=' + scaledHeight + ' ! ' +

      // branch[0] convert alpha to grayscale h264
      'tee name=t ! queue ! ' +
      `glshader fragment="
        #version 100
        #ifdef GL_ES
        precision mediump float;
        #endif
        varying vec2 v_texcoord;
        uniform sampler2D tex;
        uniform float time;
        uniform float width;
        uniform float height;

        void main () {
          vec4 pix = texture2D(tex, v_texcoord);
          gl_FragColor = vec4(pix.a,pix.a,pix.a,0);
        }
      " ! ` +
      'glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! ' +
      'gldownload ! ' +
      'x264enc key-int-max=1 byte-stream=true vbv-buf-capacity=300 bitrate=3000 tune=zerolatency ip-factor=2 speed-preset=veryfast intra-refresh=0 ! ' +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,framerate=30/1 ! ' +
      'appsink name=alphasink ' +

      // branch[1] convert rgb to h264
      't. ! queue ! ' +
      'glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! ' +
      'gldownload ! ' +
      'x264enc key-int-max=1 byte-stream=true vbv-buf-capacity=300 bitrate=6000 tune=zerolatency ip-factor=2 speed-preset=veryfast intra-refresh=0 ! ' +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,framerate=30/1 ! ' +
      'appsink name=sink'
    )

    const appsink = pipeline.findChild('sink')
    const alphasink = pipeline.findChild('alphasink')
    const appsrc = pipeline.findChild('source')
    return new H264Encoder(pipeline, appsink, alphasink, appsrc, width, height)
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
