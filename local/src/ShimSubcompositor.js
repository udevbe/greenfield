'use strict'

const WlSubcompositorRequests = require('./protocol/wayland/WlSubcompositorRequests')
const WlSubsurface = require('./protocol/wayland/WlSubsurface')

const LocalSubsurface = require('./LocalSubsurface')
const ShimSubsurface = require('./ShimSubsurface')

module.exports = class ShimSubcompositor extends WlSubcompositorRequests {
  static create (grSubcompositorProxy) {
    return new ShimSubcompositor(grSubcompositorProxy)
  }

  constructor (grSubcompositorProxy) {
    super()
    this.proxy = grSubcompositorProxy
  }

  destroy (resource) {
    // TODO
  }

  getSubsurface (resource, id, surface, parent) {
    const grSubsurfaceProxy = this.proxy.getSubsurface(surface.implementation.proxy, parent.implementation.proxy)
    const localSubsurface = LocalSubsurface.create()
    grSubsurfaceProxy.listener = localSubsurface

    const shimSubsurface = ShimSubsurface.create(grSubsurfaceProxy)
    localSubsurface.resource = WlSubsurface.create(resource.client, resource.version, id, shimSubsurface, null)
  }
}
