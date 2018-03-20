'use strict'

module.exports = class LocalSubsurface {
  static create () {
    return new LocalSubsurface()
  }

  constructor () {
    this.resource = null
  }

  // no events to relay
}
