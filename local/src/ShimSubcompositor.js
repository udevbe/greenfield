'use strict'

const WlSubcompositorRequests = require('./protocol/wayland/WlSubcompositorRequests')
const WlSubsurface = require('./protocol/wayland/WlSubsurface')

const LocalSubsurface = require('./LocalSubsurface')
const ShimSubsurface = require('./ShimSubsurface')

// Wayland Global
class ShimSubcompositor extends WlSubcompositorRequests {
  /**
   * @param {GrSubcompositor}grSubcompositorProxy
   * @return {ShimSubcompositor}
   */
  static create (grSubcompositorProxy) {
    return new ShimSubcompositor(grSubcompositorProxy)
  }

  /**
   * @param {GrSubcompositor}grSubcompositorProxy
   */
  constructor (grSubcompositorProxy) {
    super()
    /**
     * @type {GrSubcompositor}
     */
    this.proxy = grSubcompositorProxy
  }

  /**
   *
   *  Informs the server that the client will not be using this
   *  protocol object anymore. This does not affect any other
   *  objects, wl_subsurface objects included.
   *
   *
   * @param {WlSubcompositor} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    // TODO?
  }

  /**
   *
   *  Create a sub-surface interface for the given surface, and
   *  associate it with the given parent surface. This turns a
   *  plain wl_surface into a sub-surface.
   *
   *  The to-be sub-surface must not already have another role, and it
   *  must not have an existing wl_subsurface object. Otherwise a protocol
   *  error is raised.
   *
   *
   * @param {WlSubcompositor} resource
   * @param {number} id the new sub-surface object ID
   * @param {WlSurface} surface the surface to be turned into a sub-surface
   * @param {WlSurface} parent the parent surface
   *
   * @since 1
   *
   */
  getSubsurface (resource, id, surface, parent) {
    const grSubsurfaceProxy = this.proxy.getSubsurface(surface.implementation.proxy, parent.implementation.proxy)
    const localSubsurface = LocalSubsurface.create()
    grSubsurfaceProxy.listener = localSubsurface

    const shimSubsurface = ShimSubsurface.create(grSubsurfaceProxy)
    localSubsurface.resource = WlSubsurface.create(resource.client, resource.version, id, shimSubsurface, null)

    grSubsurfaceProxy.onError = (code, message) => {
      localSubsurface.resource.postError(code, message)
    }
  }
}

module.exports = ShimSubcompositor
