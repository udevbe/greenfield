'use strict'

const WlShellRequests = require('./protocol/wayland/WlShellRequests')
const WlShellSurface = require('./protocol/wayland/WlShellSurface')

const ShimShellSurface = require('./ShimShellSurface')
const LocalShellSurface = require('./LocalShellSurface')

class ShimShell extends WlShellRequests {
  /**
   * @param {GrShell}grShellProxy
   * @return {ShimShell}
   */
  static create (grShellProxy) {
    return new ShimShell(grShellProxy)
  }

  /**
   * @param {GrShell}grShellProxy
   */
  constructor (grShellProxy) {
    super()
    /**
     * @type {GrShell}
     */
    this.proxy = grShellProxy
  }

  /**
   *
   *  Create a shell surface for an existing surface. This gives
   *  the wl_surface the role of a shell surface. If the wl_surface
   *  already has another role, it raises a protocol error.
   *
   *  Only one shell surface can be associated with a given surface.
   *
   *
   * @param {WlShell} resource
   * @param {number} id shell surface to create
   * @param {WlSurface} surface surface to be given the shell surface role
   *
   * @since 1
   *
   */
  getShellSurface (resource, id, surface) {
    const grSurfaceProxy = surface.implementation.proxy
    const localShellSurface = LocalShellSurface.create()
    const grShellSurfaceProxy = this.proxy.getShellSurface(grSurfaceProxy)
    grShellSurfaceProxy.listener = localShellSurface

    const shimShellSurface = ShimShellSurface.create(grShellSurfaceProxy)
    localShellSurface.resource = WlShellSurface.create(resource.client, resource.version, id, shimShellSurface, null)

    grShellSurfaceProxy.onError = (code, message) => {
      localShellSurface.resource.postError(code, message)
    }
  }
}

module.exports = ShimShell
