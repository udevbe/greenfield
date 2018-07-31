const gstreamer = require('gstreamer-superficial')
const greenfieldNative = require('greenfield-native')

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
      glcolorconvert ! video/x-raw(memory:GLMemory),format=I420 ! 
      gldownload ! 
      vaapijpegenc ! 
      appsink name=alphasink 

      t. ! queue ! 
      vaapipostproc ! video/x-raw(memory:VASurface),format=I420 ! 
      vaapijpegenc ! 
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
    const encodingPromise = new Promise((resolve, reject) => {
      let opaque = null
      let alpha = null
      this._sink.pull((opaqueJpeg) => {
        opaque = opaqueJpeg
        if (opaque && alpha) {
          resolve({opaque: opaque, alpha: alpha})
        }
      })

      this._alphaSink.pull((alphaJpeg) => {
        alpha = alphaJpeg
        if (opaque && alpha) {
          resolve({opaque: opaque, alpha: alpha})
        }
      })
    })

    this._src.push(pixelBuffer)
    const {opaque, alpha} = await encodingPromise

    return EncodedFrameFragment.create(x, y, width, height, opaque, alpha)
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
      const encodedFrameFragments = []
      for (let i = 0; i < damage.length; i++) {
        const damageRect = damage[i]
        // ensure at least 16 width & 16 height, else jpeg encoding fails
        damageRect.width = damageRect.width < 16 ? 16 : damageRect.width
        damageRect.height = damageRect.height < 16 ? 16 : damageRect.height
        // compensate x & y clipping offset in case we go out of bounds
        damageRect.x = damageRect.x + damageRect.width > bufferWidth ? damageRect.x - (damageRect.x + damageRect.width - bufferWidth) : damageRect.x
        damageRect.y = damageRect.y + damageRect.height > bufferHeight ? damageRect.y - (damageRect.y + damageRect.height - bufferHeight) : damageRect.y

        const clippedBuffer = greenfieldNative.clip(pixelBuffer, bufferWidth, bufferHeight, damageRect.x, damageRect.y, damageRect.width, damageRect.height)
        encodedFrameFragments.push(await this._encodeFragment(clippedBuffer, wlShmFormat, damageRect.x, damageRect.y, damageRect.width, damageRect.height))
      }
      return EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, encodedFrameFragments)
    } else {
      const encodedFrameFragment = await this._encodeFragment(pixelBuffer, wlShmFormat, 0, 0, bufferWidth, bufferHeight)
      return EncodedFrame.create(serial, jpeg, bufferWidth, bufferHeight, [encodedFrameFragment])
    }
  }
}

module.exports = JpegAlphaEncoder
