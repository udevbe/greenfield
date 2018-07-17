const gstreamer = require('gstreamer-superficial')
const WlShmFormat = require('./protocol/wayland/WlShmFormat')

const EncodedFrame = require('./EncodedFrame')
const EncodedFrameFragment = require('./EncodedFrameFragment')

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
   * @param {number}x
   * @param {number}y
   * @param {number}width
   * @param {number}height
   * @return {Promise<EncodedFrameFragment>}
   * @private
   */
  async _encodeFragment (pixelBuffer, wlShmFormat, x, y, width, height) {
    if (this._width !== width || this._height !== height || this._wlShmFormat !== wlShmFormat) {
      this._width = width
      this._height = height
      this._wlShmFormat = wlShmFormat

      const gstBufferFormat = gstFormats[wlShmFormat]
      this._configure(width, height, gstBufferFormat)
    }

    // TODO we probably want to put this in it's own process so we can easily run this long running task in parallel
    const opaquePromise = new Promise((resolve, reject) => {
      this._sink.pull((opaqueJpeg) => {
        if (opaqueJpeg) {
          resolve(opaqueJpeg)
        } else {
          reject(new Error('Pulled empty opaque buffer. Gstreamer opaque jpeg encoder pipeline is probably in error.'))
        }
      })
    })

    const alphaPromise = new Promise((resolve, reject) => {
      this._alphaSink.pull((alphaJpeg) => {
        if (alphaJpeg) {
          resolve(alphaJpeg)
        } else {
          reject(new Error('Pulled empty alpha buffer. Gstreamer alpha jpeg encoder pipeline is probably in error.'))
        }
      })
    })

    this._src.push(pixelBuffer)

    return EncodedFrameFragment.create(x, y, width, height, await opaquePromise, await alphaPromise)
  }

  /**
   * @param {Buffer}pixelBuffer
   * @param {number}wlShmFormat
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {number}serial
   * @param {Array<{x:number, y:number, width:number, height:number}>}damage
   * @return {Promise<EncodedFrame>}
   * @override
   */
  async encodeBuffer (pixelBuffer, wlShmFormat, bufferWidth, bufferHeight, serial, damage) {
    if (damage.length) {
      const encodedFrameFragments = await Promise.all(damage.map(damageRect => {
        return this._encodeFragment(pixelBuffer, wlShmFormat, damageRect.x, damageRect.y, damageRect.width, damageRect.height)
      }))
      return EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, encodedFrameFragments)
    } else {
      const encodedFrameFragment = await this._encodeFragment(pixelBuffer, wlShmFormat, 0, 0, bufferWidth, bufferHeight)
      return EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, [encodedFrameFragment])
    }
  }
}

module.exports = JpegAlphaEncoder
