'use strict'

const WlOutputRequests = require('./protocol/wayland/WlOutputRequests')

module.exports = class ShimOutput extends WlOutputRequests {
  /**
   * @param {GrOutput}grOutputProxy
   * @return {module.ShimOutput}
   */
  static create (grOutputProxy) {
    return new ShimOutput(grOutputProxy)
  }

  /**
   * @param {GrOutput}grOutputProxy
   */
  constructor (grOutputProxy) {
    super()
    this.proxy = grOutputProxy
  }

  /**
   *
   *  Using this request a client can tell the server that it is not going to
   *  use the output object anymore.
   *
   *
   * @param {WlOutput} resource
   *
   * @since 3
   *
   */
  release (resource) {
    this.proxy.release()
  }
}
