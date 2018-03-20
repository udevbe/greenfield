'use strict'

module.exports = class LocalSubcompositor {
  static create () {
    return new LocalSubcompositor()
  }

  constructor () {
    // set when resource is created
    this.resource = null
  }

  // no events to relay
}
