'use strict'

module.exports = class LocalXdgWmBase {
  /**
   * @return {LocalXdgWmBase}
   */
  static create () {
    return new LocalXdgWmBase()
  }

  /**
   * @private
   */
  constructor () {
    /**
     * @type {XdgWmBase}
     */
    this.resource = null
  }

  ping (serial) {
    this.resource.ping(serial)
  }
}
