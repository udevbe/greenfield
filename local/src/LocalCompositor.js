'use strict'

// Wayland Global
class LocalCompositor {
  static create () {
    return new LocalCompositor()
  }

  constructor () {
    // set when resource is created
    this.resource = null
  }

  // no events to relay
}

module.exports = LocalCompositor
