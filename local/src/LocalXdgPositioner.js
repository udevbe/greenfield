'use strict'

module.exports = class LocalXdgPositioner {
  /**
   * @return {LocalXdgPositioner}
   */
  static create () {
    return new LocalXdgPositioner()
  }

  /**
   * @private
   */
  constructor () {
    /**
     * @type {XdgPositioner}
     */
    this.resource = null
  }

  // no events to relay
}
