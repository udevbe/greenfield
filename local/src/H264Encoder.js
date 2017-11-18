'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class H264Encoder {
  static create (width, height) {
    const scaledWidth = width - (width % 2)
    const scaledHeight = height - (height % 2)
    const pipeline = new gstreamer.Pipeline('appsrc name=source ! ' +
      'glupload ! ' +
      'glcolorconvert ! video/x-raw(memory:GLMemory),format=RGBA !' +
      'glcolorscale ! video/x-raw(memory:GLMemory),width=' + scaledWidth + ',height=' + scaledHeight + ' ! ' +
      'glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 !' +
      'gldownload ! ' +
      'x264enc byte-stream=true key-int-max=20 pass=pass1 tune=zerolatency threads=2 ip-factor=2 speed-preset=veryfast intra-refresh=0 qp-max=38 !' +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,framerate=30/1 ! ' +
      'appsink name=sink')

    // TODO use gst tee plugin and split alpha channel into split greyscale h264 frame
    // pipe to extract alpha channel and convert it to grayscale
    // const pipeline = new gstreamer.Pipeline('appsrc name=source ! ' +
    //   'glupload ! ' +
    //   'glcolorconvert ! video/x-raw(memory:GLMemory),format=RGBA !' +
    //   'glcolorscale ! video/x-raw(memory:GLMemory),width=' + scaledWidth + ',height=' + scaledHeight + ' ! ' +
    //   `glshader fragment="
    //     #version 100
    //     #ifdef GL_ES
    //     precision mediump float;
    //     #endif
    //     varying vec2 v_texcoord;
    //     uniform sampler2D tex;
    //     uniform float time;
    //     uniform float width;
    //     uniform float height;
    //
    //     void main () {
    //       vec4 pix = texture2D(tex, v_texcoord);
    //       gl_FragColor = vec4(pix.a,pix.a,pix.a,0);
    //     }
    //   " !` +
    //   'glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 !' +
    //   'gldownload ! ' +
    //   'x264enc byte-stream=true key-int-max=20 pass=pass1 tune=zerolatency threads=2 ip-factor=2 speed-preset=veryfast intra-refresh=0 qp-max=38 !' +
    //   'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,framerate=30/1 ! ' +
    //   'appsink name=sink')

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
