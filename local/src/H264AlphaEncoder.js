'use strict'

const gstreamer = require('gstreamer-superficial')

module.exports = class H264AlphaEncoder {
  static create () {
    const multipassCacheFileName0 = `x264_${Math.random() * 1024}.log`
    const multipassCacheFileName1 = `x264_${Math.random() * 1024}.log`
    const pipeline = new gstreamer.Pipeline(
      // scale & convert to RGBA
      'appsrc name=source ! ' + // source caps are set in configure method
      'videoconvert ! videoscale ! ' +
      'capsfilter name=scale ! ' + // target caps are set in configure method

      // branch[0] convert alpha to grayscale h264
      'tee name=t ! queue ! ' +
      'glupload ! ' +
      'glcolorconvert ! ' +
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
      `x264enc multipass-cache-file=${multipassCacheFileName0} key-int-max=900 byte-stream=true pass=pass1 qp-max=32 tune=zerolatency speed-preset=veryfast intra-refresh=0 ! ` +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=20/1 ! ' +
      'appsink name=alphasink ' +

      // branch[1] convert rgb to h264
      't. ! queue ! ' +
      'videoconvert ! videoscale ! video/x-raw,format=I420 ! ' +
      `x264enc multipass-cache-file=${multipassCacheFileName1} key-int-max=900 byte-stream=true pass=pass1 qp-max=32 tune=zerolatency speed-preset=veryfast intra-refresh=0 ! ` +
      'video/x-h264,profile=constrained-baseline,stream-format=byte-stream,alignment=au,framerate=20/1 ! ' +
      'appsink name=sink'
    )

    const appsink = pipeline.findChild('sink')
    const alphasink = pipeline.findChild('alphasink')
    const appsrc = pipeline.findChild('source')
    const scale = pipeline.findChild('scale')
    return new H264AlphaEncoder(pipeline, appsink, alphasink, appsrc, scale)
  }

  constructor (pipeline, appsink, alphasink, appsrc, scale) {
    this.pipeline = pipeline
    this.sink = appsink
    this.alpha = alphasink
    this.src = appsrc
    this.scale = scale
    this.width = null
    this.height = null
    this.format = null
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
   * @param {number}gstBufferFormat
   * @param {number}bufferWidth
   * @param {height}bufferHeight
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
        opaque: null,
        alpha: null
      }

      this.sink.pull((opaqueH264Nal) => {
        if (opaqueH264Nal) {
          frame.opaque = opaqueH264Nal
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer h264+alpha encoder pipeline is probably in error.'))
        }
      })

      this.alpha.pull((alphaH264Nal) => {
        if (alphaH264Nal) {
          frame.alpha = alphaH264Nal
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          reject(new Error('Pulled empty alpha buffer. Gstreamer h264+alpha encoder pipeline is probably in error.'))
        }
      })
    })
  }
}
