'use strict'

module.exports = class LocalCallback {
  static create () {
    return new LocalCallback()
  }

  constructor () {
    this.resource = null
  }

  /**
   *
   *                Notify the client when the related request is done.
   *
   *
   * @param {Number} callbackData request-specific data for the callback
   *
   * @since 1
   *
   */
  done (callbackData) {
    if (this.resource) {
      this.resource.done(callbackData)
      this.resource.destroy()
      this.resource.implementation = null
      this.resource = null
    }
  }
}
