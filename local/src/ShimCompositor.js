'use strict'

const wl_surfaceV4 = require('./protocol/wayland/wl_surfaceV4')
const wl_compositor_requests = require('./protocol/wayland/wl_compositor_requests')

const LocalSurface = require('./LocalSurface')
const ShimSurface = require('./ShimSurface')

module.exports = class LocalCompositor extends wl_compositor_requests {

  /**
   *
   * @param {wfc.GrCompositor} grCompositoryProxy
   * @returns {module.LocalCompositor}
   */
  static create (grCompositoryProxy) {
    return new LocalCompositor(grCompositoryProxy)
  }

  /**
   *
   * @param {wfc.GrCompositor} grCompositorProxy
   */
  constructor (grCompositorProxy) {
    super()
    this.grCompositorProxy = grCompositorProxy
  }

  /**
   *
   *  Ask the compositor to create a new surface.
   *
   *
   * @param {wl_compositor} resource
   * @param {*} id the new surface
   *
   * @since 1
   *
   */
  create_surface (resource, id) {
    // delegate request to browser
    const grSurfaceProxy = this.grCompositorProxy.createSurface()
    const localSurface = LocalSurface.create()
    grSurfaceProxy.listener = localSurface

    // wire future surface requests to proxy
    const shimSurface = ShimSurface.create(grSurfaceProxy)
    localSurface.resource = wl_surfaceV4.create(resource.client, 4, id, shimSurface, null)
  }

  /**
   *
   *  Ask the compositor to create a new region.
   *
   *
   * @param {wl_compositor} resource
   * @param {*} id the new region
   *
   * @since 1
   *
   */
  create_region (resource, id) {
    const grRegionProxy = this.grCompositorProxy.createRegion()
    // TODO create new region resource & link it to the proxy
  }
}
