'use strict'

const WlSurfaceRequests = require('./protocol/wayland/WlSurfaceRequests')

module.exports = class ShimSurface extends WlSurfaceRequests {
  static create (grSurfaceProxy) {
    return new ShimSurface(grSurfaceProxy)
  }

  constructor (grSurfaceProxy) {
    super()
    this.proxy = grSurfaceProxy
  }

  destroy (resource) {
    this.proxy.destroy()
  }

  attach (resource, buffer, x, y) {
    // TODO buffer conversion
    // this.grSurfaceProxy.attach()
  }

  damage (resource, x, y, width, height) {
    this.proxy.damage(x, y, width, height)
  }

  frame (resource, callback) {
    const callbackProxy = callback.implementation.proxy
    this.proxy.frame(callbackProxy)
  }

  setOpaqueRegion (resource, region) {
    const regionProxy = region.implementation.proxy
    this.proxy.setOpaqueRegion(regionProxy)
  }

  setInputRegion (resource, region) {
    const regionProxy = region.implementation.proxy
    this.proxy.setInputRegion(regionProxy)
  }

  commit (resource) {
    this.proxy.commit()
  }

  setBufferTransform (resource, transform) {
    this.proxy.setBufferTransform(transform)
  }

  setBufferScale (resource, scale) {
    this.proxy.setBufferScale(scale)
  }

  damageBuffer (resource, x, y, width, height) {
    this.proxy.damageBuffer(x, y, width, height)
  }
}
