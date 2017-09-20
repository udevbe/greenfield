'use strict'

const wl_surface_requests = require('./protocol/wayland/wl_surface_requests')

module.exports = class ShimSurface extends wl_surface_requests {

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
    //this.grSurfaceProxy.attach()
  }

  damage (resource, x, y, width, height) {
    this.proxy.damage(x, y, width, height)
  }

  frame (resource, callback) {
    const callbackProxy = callback.implementation.proxy
    this.proxy.frame(callbackProxy)
  }

  set_opaque_region (resource, region) {
    const regionProxy = region.implementation.proxy
    this.proxy.setOpaqueRegion(regionProxy)
  }

  set_input_region (resource, region) {
    const regionProxy = region.implementation.proxy
    this.proxy.setInputRegion(regionProxy)
  }

  commit (resource) {
    this.proxy.commit()
  }

  set_buffer_transform (resource, transform) {
    this.proxy.setBufferTransform(transform)
  }

  set_buffer_scale (resource, scale) {
    this.proxy.setBufferScale(scale)
  }

  damage_buffer (resource, x, y, width, height) {
    this.proxy.damageBuffer(x, y, width, height)
  }
}
