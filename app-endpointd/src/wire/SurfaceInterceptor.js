'use strict'

const WireMessageInterceptor = require('./WireMessageInterceptor')

class SurfaceInterceptor extends WireMessageInterceptor {
  /**
   * @returns {SurfaceInterceptor}
   */
  static create () {
    return new SurfaceInterceptor()
  }

  constructor () {
    super()
    this._destroyResolve = null
    this._destroyPromise = new Promise(resolve => { this._destroyResolve = resolve })
  }

  /**
   * @returns {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  /**
   * destroy request
   *
   * @param {ArrayBuffer}message
   */
  [0] (message) {
    this._destroyResolve()
  }

  /**
   * attach request
   *
   * @param {ArrayBuffer}message
   */
  [1] (message) {
    // attach: ?oii
    // TODO store buffer object id
    // TODO properly handle destruction of buffer
    // TODO properly handle add/removal of buffer destruction listeners
  }

  // damage: iiii
  // [2] () {
  //  // NOOP
  // }

  // frame: n
  // [3] () {
  //  // NOOP
  // }

  // set_opaque_region: ?o
  // [4] () {
  //  // NOOP
  // }

  // set_input_region: ?o
  // [5] () {
  //  // NOOP
  // }

  // commit:
  [6] () {
    // TODO reconstruct local buffer resource from stored buffer id
    // TODO begin encoding buffer contents
    // TODO use side channel stream encoded contents to browser
  }

  // set_buffer_transform: 2i
  // [7] () {
  //  // NOOP
  // }

  // set_buffer_scale: 3i
  // [8] () {
  //  // NOOP
  // }

  // damage_buffer: 4iiii
  // [9] () {
  //  // NOOP
  // }
}

module.exports = SurfaceInterceptor
