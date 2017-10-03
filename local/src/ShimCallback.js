'use strict'

module.exports = class ShimCallback {
  static create (grCallbackProxy) {
    return new ShimCallback(grCallbackProxy)
  }

  constructor (grCallbackProxy) {
    this.proxy = grCallbackProxy
  }
}
