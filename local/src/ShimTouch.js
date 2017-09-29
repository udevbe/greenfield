'use strict'

const WlTouchRequests = require('./protocol/wayland/WlTouchRequests')

module.exports = class ShimTouch extends WlTouchRequests {
  static create (grTouchProxy) {
    return new ShimTouch(grTouchProxy)
  }

  constructor (grTouchProxy) {
    super()
    this.proxy = grTouchProxy
  }

  /**
   *
   * @param {WlTouch} resource
   *
   * @since 3
   *
   */
  release (resource) {
    this.proxy.release()
  }
}
