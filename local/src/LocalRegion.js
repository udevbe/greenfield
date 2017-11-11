'use strict'

module.exports = class LocalRegion {
  static create () {
    return new LocalRegion()
  }

  constructor () {
    this.resource = null
  }

  // no events to relay
}
