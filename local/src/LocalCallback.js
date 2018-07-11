'use strict'

const Measurement = require('./Measurement')

module.exports = class LocalCallback {
  static create (proxy) {
    return new LocalCallback(proxy)
  }

  constructor (proxy) {
    this.resource = null
    this.proxy = proxy

    this._frameMeasurement = Measurement.create({content: 'frame'})
    this._frameMeasurement.begin()
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
      this._frameMeasurement.end()
      this._frameMeasurement.register()
    }
  }
}
