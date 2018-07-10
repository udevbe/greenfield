const gstreamer = require('gstreamer-superficial')

// TODO replace gstreamer pipeline with a custom opengl accelrated jpeg encoder implementation
module.exports = class JpegAlphaEncoder {
  static create (width, height, gstBufferFormat) {
    const pipeline = new gstreamer.Pipeline(
      `appsrc name=source caps=video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1 ! 

      tee name=t ! queue ! 
      glupload ! 
      glcolorconvert ! 
      glshader fragment="
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
          gl_FragColor = vec4(pix.a,pix.a,pix.a,1);
        }
      " ! 
      glcolorconvert ! video/x-raw(memory:GLMemory),format=GRAY8 ! 
      gldownload ! 
      jpegenc ! 
      appsink name=alphasink 

      t. ! queue ! 
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

    return new JpegAlphaEncoder(pipeline, sink, alphasink, src)
  }

  constructor (pipeline, appsink, alphasink, appsrc) {
    this.pipeline = pipeline
    this.sink = appsink
    this.alpha = alphasink
    this.src = appsrc
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
    this.src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1`
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

      const frame = {
        type: 2, // 2=jpeg
        width: bufferWidth,
        height: bufferHeight,
        synSerial: synSerial,
        opaque: null,
        alpha: null
      }

      // FIXME add a timer to detect stalled encoding pipeline?
      this.sink.pull((opaqueJpeg) => {
        if (opaqueJpeg) {
          frame.opaque = opaqueJpeg
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer opaque jpeg encoder pipeline is probably in error.'))
        }
      })

      this.alpha.pull((alphaJpeg) => {
        if (alphaJpeg) {
          frame.alpha = alphaJpeg
          if (frame.opaque && frame.alpha) {
            resolve(frame)
          }
        } else {
          reject(new Error('Pulled empty alpha buffer. Gstreamer alpha jpeg encoder pipeline is probably in error.'))
        }
      })

      this.src.push(pixelBuffer)
    })
  }
}
