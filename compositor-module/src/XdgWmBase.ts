// Copyright 2020 Erik De Rijcke
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
  Client,
  Global,
  Registry,
  WlSurfaceResource,
  XdgPositionerResource,
  XdgSurfaceResource,
  XdgWmBaseRequests,
  XdgWmBaseResource,
  XdgWmBaseError,
} from 'westfield-runtime-server'
import Seat from './Seat'
import Session from './Session'
import Surface from './Surface'
import XdgPositioner from './XdgPositioner'

import XdgSurface from './XdgSurface'
import XdgToplevel from './XdgToplevel'

/**
 *
 *      The xdg_wm_base interface is exposed as a global object enabling clients
 *      to turn their wl_surfaces into windows in a desktop environment. It
 *      defines the basic functionality needed for clients and the compositor to
 *      create windows that can be dragged, resized, maximized, etc, as well as
 *      creating transient windows such as popup menus.
 *
 */
export default class XdgWmBase implements XdgWmBaseRequests {
  private readonly _session: Session
  private readonly _seat: Seat
  private _wlSurfaceResources: WlSurfaceResource[] = []
  private _global?: Global
  private _clientPingStates: Map<
    Client,
    { timeoutTimer: number; pingTimer: number; pingTimeoutActive: boolean }
  > = new Map()

  static create(session: Session, seat: Seat): XdgWmBase {
    return new XdgWmBase(session, seat)
  }

  private constructor(session: Session, seat: Seat) {
    this._session = session
    this._seat = seat
  }

  registerGlobal(registry: Registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, XdgWmBaseResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal() {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = undefined
  }

  bindClient(client: Client, id: number, version: number) {
    const xdgWmBaseResource = new XdgWmBaseResource(client, id, version)
    xdgWmBaseResource.implementation = this

    if (!this._clientPingStates.has(client)) {
      client.onClose().then(() => {
        const pingState = this._clientPingStates.get(client)
        if (pingState) {
          clearTimeout(pingState.timeoutTimer)
          clearTimeout(pingState.pingTimer)
          this._clientPingStates.delete(client)
        }
      })
      const pingState = { timeoutTimer: 0, pingTimer: 0, pingTimeoutActive: false }
      this._clientPingStates.set(client, pingState)
      this._doPing(xdgWmBaseResource, pingState)
    }
  }

  destroy(resource: XdgWmBaseResource) {
    if (this._wlSurfaceResources.length > 0) {
      resource.postError(XdgWmBaseError.defunctSurfaces, 'xdg_wm_base was destroyed before children.')
      console.log('[client-protocol-error] - xdg_wm_base was destroyed before children.')
      return
    }
    resource.destroy()
  }

  createPositioner(resource: XdgWmBaseResource, id: number) {
    const xdgPositionerResource = new XdgPositionerResource(resource.client, id, resource.version)
    XdgPositioner.create(xdgPositionerResource)
  }

  getXdgSurface(resource: XdgWmBaseResource, id: number, wlSurfaceResource: WlSurfaceResource) {
    const surface = /** @type {Surface} */ wlSurfaceResource.implementation as Surface
    if (surface.pendingState.buffer || surface.state.bufferContents) {
      resource.postError(
        XdgWmBaseError.invalidSurfaceState,
        'Surface had a buffer attached before xdg surface was created.',
      )
      console.log('[client-protocol-error] - Surface had a buffer attached before xdg surface was created.')
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

  pong(resource: XdgWmBaseResource, serial: number) {
    const pingState = this._clientPingStates.get(resource.client)
    if (pingState) {
      if (pingState.pingTimeoutActive) {
        this._setUnresponsive(resource.client, false)
        pingState.pingTimeoutActive = false
      }
      self.clearTimeout(pingState.timeoutTimer)
      pingState.pingTimer = self.setTimeout(() => {
        this._doPing(resource, pingState)
      }, 5000)
    }
  }

  private _doPing(
    resource: XdgWmBaseResource,
    pingState: { timeoutTimer: number; pingTimer: number; pingTimeoutActive: boolean },
  ) {
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
  _setUnresponsive(client: Client, value: boolean) {
    this._wlSurfaceResources
      .filter((wlSurfaceResource) => wlSurfaceResource.client === client)
      .forEach((wlSurfaceResource) => {
        const xdgSurfaceRole = (wlSurfaceResource.implementation as Surface).role
        if (xdgSurfaceRole instanceof XdgToplevel) {
          const xdgToplevel = xdgSurfaceRole
          xdgToplevel._userSurfaceState = { ...xdgToplevel._userSurfaceState, unresponsive: value }
          const { client, id } = wlSurfaceResource
          const userSurface = { id: `${id}`, clientId: client.id }
          this._session.userShell.events.updateUserSurface?.(userSurface, xdgToplevel._userSurfaceState)
        }
      })
  }
}
