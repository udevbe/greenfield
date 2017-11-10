'use strict'

module.exports = class LocalDataDeviceManager {
  static create () {
    return new LocalDataDeviceManager()
  }

  constructor () {
    this.resource = null
  }

  // no events to relay
}
