'use strict'

const WlShellRequests = require('./protocol/wayland/wlShellRequests')
const WlShellSurface = require('./protocol/wayland/WlShellSurface')

const ShimShellSurface = require('./ShimShellSurface')
const LocalShellSurface = require('./LocalShellSurface')

module.exports = class ShimShell extends WlShellRequests {
  constructor (grShellProxy) {
    super()
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
   * @param {*} id shell surface to create
   * @param {*} surface surface to be given the shell surface role
   *
   * @since 1
   *
   */
  getShellSurface (resource, id, surface) {
    const grSurfaceProxy = surface.implementation.proxy
    const localShellSurface = LocalShellSurface.create()
    const grShellSurfaceProxy = this.proxy.get_shell_surface(grSurfaceProxy)
    grShellSurfaceProxy.listener = localShellSurface

    const shimShellSurface = ShimShellSurface.create(grShellSurfaceProxy)
    localShellSurface.resource = WlShellSurface.create(resource.client, 1, id, shimShellSurface, null)
  }
}
