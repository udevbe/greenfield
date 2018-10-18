'use strict'

// Wayland Global
class LocalSubcompositor {
  /**
   * @return {LocalSubcompositor}
   */
  static create () {
    return new LocalSubcompositor()
  }

  constructor () {
    // set when resource is created
    /**
     * @type {WlSubcompositor|null}
     */
    this.resource = null
  }

  // no events to relay
}

module.exports = LocalSubcompositor
