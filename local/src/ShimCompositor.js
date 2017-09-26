'use strict'

const WlSurface = require('./protocol/wayland/WlSurface')
const WlCompositorRequests = require('./protocol/wayland/WlCompositorRequests')

const LocalSurface = require('./LocalSurface')
const ShimSurface = require('./ShimSurface')

module.exports = class ShimCompositor extends WlCompositorRequests {
  /**
   *
   * @param {wfc.GrCompositor} grCompositoryProxy
   * @returns {module.ShimCompositor}
   */
  static create (grCompositoryProxy) {
    return new ShimCompositor(grCompositoryProxy)
  }

  /**
   *
   * @param {wfc.GrCompositor} grCompositorProxy
   */
  constructor (grCompositorProxy) {
    super()
    this.proxy = grCompositorProxy
  }

  /**
   *
   *  Ask the compositor to create a new surface.
   *
   *
   * @param {WlCompositor} resource
   * @param {*} id the new surface
   *
   * @since 1
   *
   */
  createSurface (resource, id) {
    // delegate request to browser
    const grSurfaceProxy = this.proxy.createSurface()
    const localSurface = LocalSurface.create()
    grSurfaceProxy.listener = localSurface

    // wire future surface requests to proxy
    const shimSurface = ShimSurface.create(grSurfaceProxy)
    localSurface.resource = WlSurface.create(resource.client, 4, id, shimSurface, null)
  }

  /**
   *
   *  Ask the compositor to create a new region.
   *
   *
   * @param {WlCompositor} resource
   * @param {*} id the new region
   *
   * @since 1
   *
   */
  createRegion (resource, id) {
    const grRegionProxy = this.proxy.createRegion()
    // TODO create new region resource & link it to the proxy
  }
}
