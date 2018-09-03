'use strict'

const WlSurface = require('./protocol/wayland/WlSurface')
const WlCompositorRequests = require('./protocol/wayland/WlCompositorRequests')
const WlRegion = require('./protocol/wayland/WlRegion')

const LocalSurface = require('./LocalSurface')
const ShimSurface = require('./ShimSurface')

const LocalRegion = require('./LocalRegion')
const ShimRegion = require('./ShimRegion')

// Wayland Global
class ShimCompositor extends WlCompositorRequests {
  /**
   *
   * @param {GrCompositor} grCompositoryProxy
   * @param {LocalCompositorSession}localCompositorSession
   * @returns {ShimCompositor}
   */
  static create (grCompositoryProxy, localCompositorSession) {
    return new ShimCompositor(grCompositoryProxy, localCompositorSession)
  }

  /**
   * @private
   * @param {GrCompositor} grCompositorProxy
   * @param {LocalCompositorSession}localCompositorSession
   */
  constructor (grCompositorProxy, localCompositorSession) {
    super()
    /**
     * @type {GrCompositor}
     */
    this.proxy = grCompositorProxy
    /**
     * @type {LocalCompositorSession}
     * @private
     */
    this._localCompositorSession = localCompositorSession
  }

  /**
   *
   *  Ask the compositor to create a new surface.
   *
   *
   * @param {WlCompositor} resource
   * @param {number} id the new surface
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
    const shimSurface = ShimSurface.create(grSurfaceProxy, this._localCompositorSession)
    localSurface.resource = WlSurface.create(resource.client, resource.version, id, shimSurface, null)
    localSurface.resource.onDestroy().then(() => {
      if (shimSurface.localRtcDcBuffer) {
        shimSurface.localRtcDcBuffer.destroy()
        shimSurface.localRtcDcBuffer = null
      }
    })

    grSurfaceProxy.onError = (code, message) => {
      localSurface.resource.postError(code, message)
    }
  }

  /**
   *
   *  Ask the compositor to create a new region.
   *
   *
   * @param {WlCompositor} resource
   * @param {number} id the new region
   *
   * @since 1
   *
   */
  createRegion (resource, id) {
    const grRegionProxy = this.proxy.createRegion()
    const localRegion = LocalRegion.create()
    grRegionProxy.listener = localRegion

    const shimRegion = ShimRegion.create(grRegionProxy)
    localRegion.resource = WlRegion.create(resource.client, resource.version, id, shimRegion, null)

    grRegionProxy.onError = (code, message) => {
      localRegion.resource.postError(code, message)
    }
  }
}

module.exports = ShimCompositor
