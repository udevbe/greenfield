'use strict'

class LocalRegion {
  /**
   * @return {LocalRegion}
   */
  static create () {
    return new LocalRegion()
  }

  constructor () {
    /**
     * @type {WlRegion|null}
     */
    this.resource = null
  }

  // no events to relay
}

module.exports = LocalRegion
