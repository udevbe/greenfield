'use strict'

const WlPointerRequests = require('./protocol/wayland/WlPointerRequests')

module.exports = class ShimPointer extends WlPointerRequests {
  static create (grPointerProxy) {
    return new WlPointerRequests(grPointerProxy)
  }

  constructor (grPointerProxy) {
    super()
    this.proxy = grPointerProxy
  }

  setCursor (resource, serial, surface, hotspotX, hotspotY) {
    const grSurfaceProxy = surface.implementation.proxy
    this.proxy.setCursor(serial, grSurfaceProxy, hotspotX, hotspotY)
  }

  release (resource) {
    this.proxy.release()
    resource.destroy()
  }
}
