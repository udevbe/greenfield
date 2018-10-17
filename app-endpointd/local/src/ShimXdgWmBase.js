'use strict'

const XdgWmBaseRequests = require('./protocol/wayland/XdgWmBaseRequests')
const XdgPositioner = require('./protocol/wayland/XdgPositioner')
const XdgSurface = require('./protocol/wayland/XdgSurface')

const LocalXdgPositioner = require('./LocalXdgPositioner')
const ShimXdgPositioner = require('./ShimXdgPositioner')

const LocalXdgSurface = require('./LocalXdgSurface')
const ShimXdgSurface = require('./ShimXdgSurface')

// Wayland Global
class ShimXdgWmBase extends XdgWmBaseRequests {
  /**
   * @param {XdgWmBase}xdgWmBaseProxy
   * @return {module.ShimXdgWmBase}
   */
  static create (xdgWmBaseProxy) {
    return new ShimXdgWmBase(xdgWmBaseProxy)
  }

  /**
   * @param {XdgWmBase}xdgWmBaseProxy
   */
  constructor (xdgWmBaseProxy) {
    super()
    /**
     * @type {XdgWmBase}
     */
    this.proxy = xdgWmBaseProxy
  }

  /**
   *
   *  Destroy this xdg_wm_base object.
   *
   *  Destroying a bound xdg_wm_base object while there are surfaces
   *  still alive created by this xdg_wm_base object instance is illegal
   *  and will result in a protocol error.
   *
   *
   * @param {XdgWmBase} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    this.proxy.destroy()
    resource.destroy()
  }

  /**
   *
   *  Create a positioner object. A positioner object is used to position
   *  surfaces relative to some parent surface. See the interface description
   *  and xdg_surface.get_popup for details.
   *
   *
   * @param {XdgWmBase} resource
   * @param {*} id undefined
   *
   * @since 1
   *
   */
  createPositioner (resource, id) {
    const xdgPositionerProxy = this.proxy.createPositioner()
    const localXdgPositioner = LocalXdgPositioner.create()
    xdgPositionerProxy.listener = localXdgPositioner

    const shimXdgPositioner = ShimXdgPositioner.create(xdgPositionerProxy)
    localXdgPositioner.resource = XdgPositioner.create(resource.client, resource.version, id, shimXdgPositioner, null)

    xdgPositionerProxy.onError = (code, message) => {
      localXdgPositioner.resource.postError(code, message)
    }
  }

  /**
   *
   *  This creates an xdg_surface for the given surface. While xdg_surface
   *  itself is not a role, the corresponding surface may only be assigned
   *  a role extending xdg_surface, such as xdg_toplevel or xdg_popup.
   *
   *  This creates an xdg_surface for the given surface. An xdg_surface is
   *  used as basis to define a role to a given surface, such as xdg_toplevel
   *  or xdg_popup. It also manages functionality shared between xdg_surface
   *  based surface roles.
   *
   *  See the documentation of xdg_surface for more details about what an
   *  xdg_surface is and how it is used.
   *
   *
   * @param {XdgWmBase} resource
   * @param {number} id undefined
   * @param {GrSurface} surface undefined
   *
   * @since 1
   *
   */
  getXdgSurface (resource, id, surface) {
    const xdgSurfaceProxy = this.proxy.getXdgSurface(surface.implementation.proxy)
    const localXdgSurface = LocalXdgSurface.create()
    xdgSurfaceProxy.listener = localXdgSurface

    const shimXdgSurface = ShimXdgSurface.create(xdgSurfaceProxy)
    localXdgSurface.resource = XdgSurface.create(resource.client, resource.version, id, shimXdgSurface, null)

    xdgSurfaceProxy.onError = (code, message) => {
      localXdgSurface.resource.postError(code, message)
    }
  }

  /**
   *
   *  A client must respond to a ping event with a pong request or
   *  the client may be deemed unresponsive. See xdg_wm_base.ping.
   *
   *
   * @param {XdgWmBase} resource
   * @param {Number} serial serial of the ping event
   *
   * @since 1
   *
   */
  pong (resource, serial) {
    this.proxy.pong(serial)
  }
}

module.exports = ShimXdgWmBase
