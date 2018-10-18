'use strict'

// Wayland Global
class LocalDataDeviceManager {
  static create () {
    return new LocalDataDeviceManager()
  }

  constructor () {
    this.resource = null
  }

  // no events to relay
}

module.exports = LocalDataDeviceManager
