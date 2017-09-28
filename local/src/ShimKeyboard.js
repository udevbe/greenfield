'use strict'

const WlKeyboardRequests = require('./protocol/wayland/WlKeyboardRequests')

module.exports = class ShimKeyboard extends WlKeyboardRequests {
  static create (grKeyboardProxy) {
    return new ShimKeyboard(grKeyboardProxy)
  }

  constructor (grKeyboardProxy) {
    super()
    this.proxy = grKeyboardProxy
  }

  /**
   *
   * @param {WlKeyboard} resource
   *
   * @since 3
   *
   */
  release (resource) {
    this.proxy.release()
  }
}
