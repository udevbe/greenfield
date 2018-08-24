'use strict'

class LocalSubsurface {
  /**
   * @return {LocalSubsurface}
   */
  static create () {
    return new LocalSubsurface()
  }

  constructor () {
    /**
     * @type {WlSubsurface|null}
     */
    this.resource = null
  }

  // no events to relay
}

module.exports = LocalSubsurface
