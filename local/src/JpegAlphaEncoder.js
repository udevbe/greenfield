const gstreamer = require('gstreamer-superficial')
const WlShmFormat = require('./protocol/wayland/WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedBuffer = require('./EncodedBuffer')

const {jpeg} = require('./EncodingTypes')

const gstFormats = {
  [WlShmFormat.argb8888]: 'BGRA',
  [WlShmFormat.xrgb8888]: 'BGRx'
}

// TODO replace gstreamer pipeline with a custom opengl accelrated jpeg encoder implementation
/**
 * @implements FrameEncoder
 */
class JpegAlphaEncoder {
  /**
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @return {JpegAlphaEncoder}
   */
  static create (width, height, wlShmFormat) {
    const gstBufferFormat = gstFormats[wlShmFormat]
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

    return new JpegAlphaEncoder(pipeline, sink, alphasink, src, width, height, wlShmFormat)
  }

  /**
   * @param {Object}pipeline
   * @param {Object}sink
   * @param {Object}alphaSink
   * @param {Object}src
   * @param {number}width
   * @param {number}height
   * @param {number}wlShmFormat
   * @private
   */
  constructor (pipeline, sink, alphaSink, src, width, height, wlShmFormat) {
    /**
     * @type {Object}
     * @private
     */
    this._pipeline = pipeline
    /**
     * @type {Object}
     * @private
     */
    this._sink = sink
    /**
     * @type {Object}
     * @private
     */
    this._alphaSink = alphaSink
    /**
     * @type {Object}
     * @private
     */
    this._src = src
    /**
     * @type {number}
     * @private
     */
    this._width = width
    /**
     * @type {number}
     * @private
     */
    this._height = height
    /**
     * @type {number}
     * @private
     */
    this._wlShmFormat = wlShmFormat
  }

  /**
   * @param {number}width
   * @param {number}height
   * @param {string}gstBufferFormat
   * @private
   */
  _configure (width, height, gstBufferFormat) {
    this._src.caps = `video/x-raw,format=${gstBufferFormat},width=${width},height=${height},framerate=60/1`
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}wlShmFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @param {Array<Rect>}damageRects
   * @return {Promise<EncodedFrame>}
   * @override
   */
  encodeBuffer (pixelBuffer, wlShmFormat, bufferWidth, bufferHeight, serial, damageRects) {
    // TODO use damage rects & pixman to only encode those parts of the pixelBuffer that have changed

    return new Promise((resolve, reject) => {
      if (this._width !== bufferWidth || this._height !== bufferHeight || this._wlShmFormat !== wlShmFormat) {
        this._width = bufferWidth
        this._height = bufferHeight
        this._wlShmFormat = wlShmFormat

        const gstBufferFormat = gstFormats[wlShmFormat]
        this._configure(bufferWidth, bufferHeight, gstBufferFormat)
      }

      const opaqueEncodedBuffers = []
      const alphaEncodedBuffers = []
      const encodedFrame = EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, opaqueEncodedBuffers, alphaEncodedBuffers)

      this._sink.pull((opaqueJpeg) => {
        if (opaqueJpeg) {
          opaqueEncodedBuffers.push(EncodedBuffer.create(0, 0, bufferWidth, bufferHeight, opaqueJpeg))
          if (opaqueEncodedBuffers.length && alphaEncodedBuffers.length) {
            resolve(encodedFrame)
          }
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer opaque jpeg encoder pipeline is probably in error.'))
        }
      })

      this._alphaSink.pull((alphaJpeg) => {
        if (alphaJpeg) {
          alphaEncodedBuffers.push(EncodedBuffer.create(0, 0, bufferWidth, bufferHeight, alphaJpeg))
          if (opaqueEncodedBuffers.length && alphaEncodedBuffers.length) {
            resolve(encodedFrame)
          }
        } else {
          reject(new Error('Pulled empty alpha buffer. Gstreamer alpha jpeg encoder pipeline is probably in error.'))
        }
      })

      this._src.push(pixelBuffer)
    })
  }
}

module.exports = JpegAlphaEncoder
