'use strict'

// Wayland Global
class LocalXdgWmBase {
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
     * @type {XdgWmBase|null}
     */
    this.resource = null
  }

  ping (serial) {
    this.resource.ping(serial)
  }
}

module.exports = LocalXdgWmBase
