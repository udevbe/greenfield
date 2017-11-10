'use strict'

const WlDataDeviceRequests = require('./protocol/wayland/WlDataDeviceRequests')

module.exports = class ShimDataDevice extends WlDataDeviceRequests {
  /**
   * @param {GrDataDevice}grDataDeviceProxy
   * @return {module.ShimDataDevice}
   */
  static create (grDataDeviceProxy) {
    return new ShimDataDevice(grDataDeviceProxy)
  }

  constructor (grDataDeviceProxy) {
    super()
    this.proxy = grDataDeviceProxy
  }

  startDrag (resource, source, origin, icon, serial) {
    this.proxy.startDrag(source.proxy, origin.proxy, icon.proxy, serial)
  }

  setSelection (resource, source, serial) {
    this.proxy.setSelection(source.proxy, serial)
  }

  release (resource) {
    this.proxy.release()
    resource.destroy()
  }
}
