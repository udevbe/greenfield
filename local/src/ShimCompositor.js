'use strict'

const WlSurface = require('./protocol/wayland/WlSurface')
const WlCompositorRequests = require('./protocol/wayland/WlCompositorRequests')
const WlRegion = require('./protocol/wayland/WlRegion')

const LocalSurface = require('./LocalSurface')
const ShimSurface = require('./ShimSurface')

const LocalRegion = require('./LocalRegion')
const ShimRegion = require('./ShimRegion')

module.exports = class ShimCompositor extends WlCompositorRequests {
  /**
   *
   * @param {GrCompositor} grCompositoryProxy
   * @returns {module.ShimCompositor}
   */
  static create (grCompositoryProxy) {
    return new ShimCompositor(grCompositoryProxy)
  }

  /**
   * @private
   * @param {GrCompositor} grCompositorProxy
   */
  constructor (grCompositorProxy) {
    super()
    this.proxy = grCompositorProxy
  }

  createSurface (resource, id) {
    // delegate request to browser
    const grSurfaceProxy = this.proxy.createSurface()
    const localSurface = LocalSurface.create()
    grSurfaceProxy.listener = localSurface

    // wire future surface requests to proxy
    const shimSurface = ShimSurface.create(grSurfaceProxy)
    localSurface.resource = WlSurface.create(resource.client, resource.version, id, shimSurface, null)
    localSurface.resource.onDestroy().then(() => {
      if (shimSurface.localRtcDcBuffer) {
        shimSurface.localRtcDcBuffer.destroy()
        shimSurface.localRtcDcBuffer = null
      }
    })
  }

  createRegion (resource, id) {
    const grRegionProxy = this.proxy.createRegion()
    const localRegion = LocalRegion.create()
    grRegionProxy.listener = localRegion

    const shimRegion = ShimRegion.create(grRegionProxy)
    localRegion.resource = WlRegion.create(resource.client, resource.version, id, shimRegion, null)
  }
}
