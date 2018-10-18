'use strict'

import XdgWmBaseRequests from './protocol/XdgWmBaseRequests'
import XdgWmBaseResource from './protocol/XdgWmBaseResource'
import XdgPositionerResource from './protocol/XdgPositionerResource'
import XdgSurfaceResource from './protocol/XdgSurfaceResource'

import XdgSurface from './XdgSurface'
import XdgPositioner from './XdgPositioner'

/**
 *
 *      The xdg_wm_base interface is exposed as a global object enabling clients
 *      to turn their wl_surfaces into windows in a desktop environment. It
 *      defines the basic functionality needed for clients and the compositor to
 *      create windows that can be dragged, resized, maximized, etc, as well as
 *      creating transient windows such as popup menus.
 *
 * @implements {XdgWmBaseRequests}
 */
export default class XdgWmBase extends XdgWmBaseRequests {
  /**
   * @param {Session} session
   * @param {UserShell}userShell
   * @param {Seat}seat
   * @return {XdgWmBase}
   */
  static create (session, userShell, seat) {
    return new XdgWmBase(session, userShell, seat)
  }

  /**
   * @param {Session} session
   * @param {UserShell}userShell
   * @param {Seat}seat
   * @private
   */
  constructor (session, userShell, seat) {
    super()
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {UserShell}
     * @private
     */
    this._userShell = userShell
    /**
     * @type {Seat}
     * @private
     */
    this._seat = seat
    /**
     * @type {number}
     * @private
     */
    this._timeoutTimer = 0
    /**
     * @type {boolean}
     * @private
     */
    this._pingTimeoutActive = false
    /**
     * @type {number}
     * @private
     */
    this._doPingTimer = 0
    /**
     * @type {number}
     * @private
     */
    this._pingSerial = 0
    /**
     * @type {Array<WlSurfaceResource>}
     * @private
     */
    this._wlSurfaceResources = []
    /**
     * @type {Global}
     * @private
     */
    this._global = null
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, XdgWmBaseResource.name, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal () {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = null
  }

  /**
   *
   * Invoked when a client binds to this global.
   *
   * @param {!Client} client
   * @param {!number} id
   * @param {!number} version
   */
  bindClient (client, id, version) {
    const xdgWmBaseResource = new XdgWmBaseResource(client, id, version)
    xdgWmBaseResource.implementation = this
    xdgWmBaseResource.onDestroy().then(() => {
      window.clearTimeout(this._timeoutTimer)
    })
    xdgWmBaseResource.onDestroy().then(() => {
      window.clearTimeout(this._doPingTimer)
    })
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
   * @param {XdgWmBaseResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    if (this._wlSurfaceResources.length > 0) {
      resource.postError(XdgWmBaseResource.Error.defunctSurfaces, 'xdg_wm_base was destroyed before children.')
      DEBUG && console.log('Protocol error. xdg_wm_base was destroyed before children.')
      return
    }
    resource.destroy()
  }

  /**
   *
   *  Create a positioner object. A positioner object is used to position
   *  surfaces relative to some parent surface. See the interface description
   *  and xdg_surface.get_popup for details.
   *
   *
   * @param {XdgWmBaseResource} resource
   * @param {number} id
   *
   * @since 1
   * @override
   */
  createPositioner (resource, id) {
    const xdgPositionerResource = new XdgPositionerResource(resource.client, id, resource.version)
    XdgPositioner.create(xdgPositionerResource)
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
   * @param {XdgWmBaseResource} resource
   * @param {number} id
   * @param {WlSurfaceResource} wlSurfaceResource
   *
   * @since 1
   * @override
   */
  getXdgSurface (resource, id, wlSurfaceResource) {
    const surface = /** @type {Surface} */wlSurfaceResource.implementation
    if (surface.pendingWlBuffer || surface.state.bufferContents) {
      resource.postError(XdgWmBase.Error.invalidSurfaceState, 'Surface had a buffer attached before xdg surface was created.')
      DEBUG && console.log('Protocol error. Surface had a buffer attached before xdg surface was created.')
      return
    }

    const xdgSurfaceResource = new XdgSurfaceResource(resource.client, id, resource.version)
    XdgSurface.create(xdgSurfaceResource, wlSurfaceResource, this._session, this._userShell, this._seat)
    this._wlSurfaceResources.push(wlSurfaceResource)
    surface.onDestroy().then(() => {
      const index = this._wlSurfaceResources.indexOf(wlSurfaceResource)
      if (index > -1) {
        this._wlSurfaceResources.splice(index, 1)
      }
    })
  }

  /**
   *
   *  A client must respond to a ping event with a pong request or
   *  the client may be deemed unresponsive. See xdg_wm_base.ping.
   *
   *
   * @param {XdgWmBaseResource} resource
   * @param {number} serial serial of the ping event
   *
   * @since 1
   * @override
   */
  pong (resource, serial) {
    // TODO compare serial with send out pingSerial
    if (this._pingTimeoutActive) {
      this._wlSurfaceResources.forEach((wlSurfaceResource) => {
        this._removeClassRecursively(/** @type {Surface} */wlSurfaceResource.implementation, 'fadeToUnresponsive')
      })
      this._pingTimeoutActive = false
    }
    window.clearTimeout(this._timeoutTimer)
    this._doPingTimer = window.setTimeout(() => {
      this._doPing(resource)
    }, 1000)
  }

  /**
   * @param {XdgWmBaseResource} resource
   * @private
   */
  _doPing (resource) {
    this._timeoutTimer = window.setTimeout(() => {
      if (!this._pingTimeoutActive) {
        // ping timed out, make view gray
        this._pingTimeoutActive = true
        this._wlSurfaceResources.forEach((wlSurfaceResource) => {
          this._addClassRecursively(/** @type {Surface} */wlSurfaceResource.implementation, 'fadeToUnresponsive')
        })
      }
    }, 3000)
    this._pingSerial++
    resource.ping(this._pingSerial)
    this.session.flush()
  }

  /**
   * @param {Surface}surface
   * @param {string}cssClass
   * @private
   */
  _removeClassRecursively (surface, cssClass) {
    surface.views.forEach((view) => {
      view.bufferedCanvas.removeCssClass(cssClass)
    })
    surface.children.forEach((surfaceChild) => {
      if (surfaceChild.surface !== surface) {
        this._removeClassRecursively(surfaceChild.surface, cssClass)
      }
    })
  }

  /**
   * @param {Surface}surface
   * @param {string}cssClass
   * @private
   */
  _addClassRecursively (surface, cssClass) {
    surface.views.forEach((view) => {
      view.bufferedCanvas.addCssClass(cssClass)
    })
    surface.children.forEach((surfaceChild) => {
      if (surfaceChild.surface !== surface) {
        this._addClassRecursively(surfaceChild.surface, cssClass)
      }
    })
  }
}
