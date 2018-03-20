'use strict'

const WlSubsurfaceRequests = require('./protocol/wayland/WlSubsurfaceRequests')

module.exports = class ShimSubsurface extends WlSubsurfaceRequests {

  static create (grSubsurfaceProxy) {
    return new ShimSubsurface(grSubsurfaceProxy)
  }

  constructor (grSubsurfaceProxy) {
    super()
    this.proxy = grSubsurfaceProxy
  }

  destroy (resource) {
    this.proxy.destroy()
    resource.destroy()
  }

  setPosition (resource, x, y) {
    this.proxy.setPosition(x, y)
  }

  placeAbove (resource, sibling) {
    this.proxy.placeAbove(sibling.implementation.proxy)
  }

  placeBelow (resource, sibling) {
    this.proxy.placeBelow(sibling.implementation.proxy)
  }

  setSync (resource) {
    this.proxy.setSync()
  }

  setDesync (resource) {
    this.proxy.setDesync()
  }
}
