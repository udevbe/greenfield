// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import {
  XdgPositionerResource,
  XdgSurfaceResource,
  XdgWmBaseRequests,
  XdgWmBaseResource
} from 'westfield-runtime-server'

import XdgSurface from './XdgSurface'
import XdgPositioner from './XdgPositioner'
import XdgToplevel from './XdgToplevel'

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
   * @param {Seat}seat
   * @return {XdgWmBase}
   */
  static create (session, seat) {
    return new XdgWmBase(session, seat)
  }

  /**
   * @param {Session} session
   * @param {Seat}seat
   * @private
   */
  constructor (session, seat) {
    super()
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {Seat}
     * @private
     */
    this._seat = seat
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

    /**
     * @type {Map<Client, {timeoutTimer:number, pingTimer:number, pingTimeoutActive:boolean}>}
     * @private
     */
    this._clientPingStates = new Map()
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, XdgWmBaseResource.protocolName, 1, (client, id, version) => {
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

    if (!this._clientPingStates.has(client)) {
      client.onClose().then(() => {
        const pingState = this._clientPingStates.get(client)
        window.clearTimeout(pingState.timeoutTimer)
        window.clearTimeout(pingState.pingTimer)
        this._clientPingStates.delete(client)
      })
      const pingState = { timeoutTimer: 0, pingTimer: 0, pingTimeoutActive: false }
      this._clientPingStates.set(client, pingState)
      this._doPing(xdgWmBaseResource, pingState)
    }
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
      window.GREENFIELD_DEBUG && console.log('[client-protocol-error] - xdg_wm_base was destroyed before children.')
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
      window.GREENFIELD_DEBUG && console.log('[client-protocol-error] - Surface had a buffer attached before xdg surface was created.')
      return
    }

    const xdgSurfaceResource = new XdgSurfaceResource(resource.client, id, resource.version)
    XdgSurface.create(xdgSurfaceResource, wlSurfaceResource, this._session, this._seat)
    this._wlSurfaceResources.push(wlSurfaceResource)
    wlSurfaceResource.onDestroy().then(() => {
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
    const pingState = this._clientPingStates.get(resource.client)
    if (pingState.pingTimeoutActive) {
      this._setUnresponsive(resource.client, false)
      pingState.pingTimeoutActive = false
    }
    window.clearTimeout(pingState.timeoutTimer)
    pingState.pingTimer = window.setTimeout(() => {
      this._doPing(resource, pingState)
    }, 5000)
  }

  /**
   * @param {XdgWmBaseResource} resource
   * @param {{timeoutTimer:number, pingTimer:number, pingTimeoutActive:boolean}}pingState
   * @private
   */
  _doPing (resource, pingState) {
    pingState.timeoutTimer = window.setTimeout(() => {
      if (!pingState.pingTimeoutActive) {
        // ping timed out, make view gray
        pingState.pingTimeoutActive = true
        this._setUnresponsive(resource.client, true)
      }
    }, 5000)
    // FIXME use a proper serial
    resource.ping(0)
    this._session.flush()
  }

  /**
   * @param {Client}client
   * @param {boolean}value
   * @private
   */
  _setUnresponsive (client, value) {
    this._wlSurfaceResources.filter(wlSurfaceResource => wlSurfaceResource.client === client)
      .forEach((wlSurfaceResource) => {
        const xdgSurfaceRole = (/** @type {Surface} */wlSurfaceResource.implementation).role
        if (xdgSurfaceRole instanceof XdgToplevel) {
          const xdgToplevel = /** @type {XdgToplevel} */ xdgSurfaceRole
          xdgToplevel._userSurfaceState = { ...xdgToplevel._userSurfaceState, unresponsive: value }
          const { client, id } = wlSurfaceResource
          const userSurface = { id, clientId: client.id }
          this._session.userShell.events.updateUserSurface(userSurface, xdgToplevel._userSurfaceState)
        }
      })
  }
}
