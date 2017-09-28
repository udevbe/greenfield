'use strict'

module.exports = class LocalCompositor {
  static create () {
    return new LocalCompositor()
  }

  constructor () {
    // set when resource is created
    this.resource = null
  }

  // no compositor events to relay
}
