'use strict'

import { Global } from 'westfield-runtime-server'
import { XdgWmBase, XdgPositioner, XdgSurface } from './protocol/xdg-shell-browser-protocol'
import BrowserXdgSurface from './BrowserXdgSurface'
import BrowserXdgPositioner from './BrowserXdgPositioner'

/**
 *
 *      The xdg_wm_base interface is exposed as a global object enabling clients
 *      to turn their wl_surfaces into windows in a desktop environment. It
 *      defines the basic functionality needed for clients and the compositor to
 *      create windows that can be dragged, resized, maximized, etc, as well as
 *      creating transient windows such as popup menus.
 *
 */
export default class BrowserXdgWmBase extends Global {
  /**
   * @param {BrowserSession} browserSession
   * @param {UserShell}userShell
   * @param {BrowserSeat}browserSeat
   * @return {BrowserXdgWmBase}
   */
  static create (browserSession, userShell, browserSeat) {
    return new BrowserXdgWmBase(browserSession, userShell, browserSeat)
  }

  /**
   * @param {BrowserSession} browserSession
   * @param {UserShell}userShell
   * @param {BrowserSeat}browserSeat
   * @private
   */
  constructor (browserSession, userShell, browserSeat) {
    super(XdgWmBase.name, 1)
    /**
     * @type {BrowserSession}
     * @private
     */
    this._browserSession = browserSession
    /**
     * @type {UserShell}
     * @private
     */
    this._userShell = userShell
    /**
     * @type {BrowserSeat}
     * @private
     */
    this._browserSeat = browserSeat
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
     * @type {GrSurface[]}
     * @private
     */
    this._grSurfaceResources = []
  }

  bindClient (client, id, version) {
    const xdgWmBaseResource = new XdgWmBase(client, id, version)
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
   * @param {XdgWmBase} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    if (this._grSurfaceResources.length > 0) {
      resource.postError(XdgWmBase.Error.defunctSurfaces, 'xdg_wm_base was destroyed before children.')
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
   * @param {XdgWmBase} resource
   * @param {number} id
   *
   * @since 1
   *
   */
  createPositioner (resource, id) {
    const xdgPositionerResource = new XdgPositioner(resource.client, id, resource.version)
    BrowserXdgPositioner.create(xdgPositionerResource)
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
   * @param {number} id
   * @param {GrSurface} surface
   *
   * @since 1
   *
   */
  getXdgSurface (resource, id, surface) {
    const browserSurface = /** @type {BrowserSurface} */surface.implementation
    if (browserSurface.pendingGrBuffer || browserSurface.state.bufferContents) {
      resource.postError(XdgWmBase.Error.invalidSurfaceState, 'Surface had a buffer attached before xdg surface was created.')
      DEBUG && console.log('Protocol error. Surface had a buffer attached before xdg surface was created.')
      return
    }

    const xdgSurfaceResource = new XdgSurface(resource.client, id, resource.version)
    BrowserXdgSurface.create(xdgSurfaceResource, surface, this._browserSession, this._userShell, this._browserSeat)
    this._grSurfaceResources.push(surface)
    surface.onDestroy().then(() => {
      const index = this._grSurfaceResources.indexOf(surface)
      if (index > -1) {
        this._grSurfaceResources.splice(index, 1)
      }
    })
  }

  /**
   *
   *  A client must respond to a ping event with a pong request or
   *  the client may be deemed unresponsive. See xdg_wm_base.ping.
   *
   *
   * @param {XdgWmBase} resource
   * @param {number} serial serial of the ping event
   *
   * @since 1
   *
   */
  pong (resource, serial) {
    // TODO compare serial with send out pingSerial
    if (this._pingTimeoutActive) {
      this._grSurfaceResources.forEach((grSurfaceResource) => {
        this._removeClassRecursively(grSurfaceResource.implementation, 'fadeToUnresponsive')
      })
      this._pingTimeoutActive = false
    }
    window.clearTimeout(this._timeoutTimer)
    this._doPingTimer = window.setTimeout(() => {
      this._doPing(resource)
    }, 1000)
  }

  _doPing (resource) {
    this._timeoutTimer = window.setTimeout(() => {
      if (!this._pingTimeoutActive) {
        // ping timed out, make view gray
        this._pingTimeoutActive = true
        this._grSurfaceResources.forEach((grSurfaceResource) => {
          this._addClassRecursively(grSurfaceResource.implementation, 'fadeToUnresponsive')
        })
      }
    }, 3000)
    this._pingSerial++
    resource.ping(this._pingSerial)
    this.browserSession.flush()
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {string}cssClass
   * @private
   */
  _removeClassRecursively (browserSurface, cssClass) {
    browserSurface.browserSurfaceViews.forEach((view) => {
      view.bufferedCanvas.removeCssClass(cssClass)
    })
    browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      if (browserSurfaceChild.browserSurface !== browserSurface) {
        this._removeClassRecursively(browserSurfaceChild.browserSurface, cssClass)
      }
    })
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {string}cssClass
   * @private
   */
  _addClassRecursively (browserSurface, cssClass) {
    browserSurface.browserSurfaceViews.forEach((view) => {
      view.bufferedCanvas.addCssClass(cssClass)
    })
    browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      if (browserSurfaceChild.browserSurface !== browserSurface) {
        this._addClassRecursively(browserSurfaceChild.browserSurface, cssClass)
      }
    })
  }
}
