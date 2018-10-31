'use strict'

const WireMessageUtil = require('../WireMessageUtil')
const SurfaceInterceptor = require('./SurfaceInterceptor')
const WireMessageInterceptor = require('./WireMessageInterceptor')

class CompositorInterceptor extends WireMessageInterceptor {
  /**
   * @param {Object.<number,WireMessageInterceptor>}interceptors
   * @returns {CompositorInterceptor}
   */
  static create (interceptors) {
    return new CompositorInterceptor(interceptors)
  }

  /**
   * @param {Object.<number,WireMessageInterceptor>}interceptors
   */
  constructor (interceptors) {
    super()
    /**
     * @type {Object<number, WireMessageInterceptor>}
     * @private
     */
    this._interceptors = interceptors
  }

  /**
   * get_surface request
   *
   * @param {ArrayBuffer}message
   */
  [0] (message) {
    const [surfaceId] = WireMessageUtil.unmarshallArgs({
      buffer: message,
      bufferOffset: 0,
      consumed: 8,
      fds: [],
      size: new Uint32Array(message)[1] >>> 16
    }, 'n')
    const surfaceInterceptor = SurfaceInterceptor.create()
    this._interceptors[surfaceId] = surfaceInterceptor
    surfaceInterceptor.onDestroy().then(() => delete this._interceptors[surfaceId])
  }
}

module.exports = CompositorInterceptor
