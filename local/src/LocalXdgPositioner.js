'use strict'

class LocalXdgPositioner {
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
     * @type {XdgPositioner|null}
     */
    this.resource = null
  }

  // no events to relay
}

module.exports = LocalXdgPositioner
