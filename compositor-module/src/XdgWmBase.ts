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
  XdgWmBaseError,
  XdgWmBaseRequests,
  XdgWmBaseResource,
} from 'westfield-runtime-server'

import { Seat } from './Seat'
import Session from './Session'
import Surface from './Surface'
import XdgPositioner from './XdgPositioner'

import XdgSurface from './XdgSurface'
import XdgToplevel from './XdgToplevel'

export default class XdgWmBase implements XdgWmBaseRequests {
  private wlSurfaceResources: WlSurfaceResource[] = []
  private global?: Global
  private clientPingStates: Map<Client, { timeoutTimer: number; pingTimer: number; pingTimeoutActive: boolean }> =
    new Map()

  private constructor(private readonly session: Session, private readonly seat: Seat) {}

  static create(session: Session, seat: Seat): XdgWmBase {
    return new XdgWmBase(session, seat)
  }

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, XdgWmBaseResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal(): void {
    if (!this.global) {
      return
    }
    this.global.destroy()
    this.global = undefined
  }

  bindClient(client: Client, id: number, version: number): void {
    const xdgWmBaseResource = new XdgWmBaseResource(client, id, version)
    xdgWmBaseResource.implementation = this

    if (!this.clientPingStates.has(client)) {
      client.onClose().then(() => {
        const pingState = this.clientPingStates.get(client)
        if (pingState) {
          clearTimeout(pingState.timeoutTimer)
          clearTimeout(pingState.pingTimer)
          this.clientPingStates.delete(client)
        }
      })
      const pingState = { timeoutTimer: 0, pingTimer: 0, pingTimeoutActive: false }
      this.clientPingStates.set(client, pingState)
      this.doPing(xdgWmBaseResource, pingState)
    }
  }

  destroy(resource: XdgWmBaseResource): void {
    if (this.wlSurfaceResources.length > 0) {
      resource.postError(XdgWmBaseError.defunctSurfaces, 'xdg_wm_base was destroyed before children.')
      this.session.logger.warn('[client-protocol-error] - xdg_wm_base was destroyed before children.')
      return
    }
    const pingState = this.clientPingStates.get(resource.client)
    if (pingState) {
      clearTimeout(pingState.timeoutTimer)
      clearTimeout(pingState.pingTimer)
      this.clientPingStates.delete(resource.client)
    }
    resource.destroy()
  }

  createPositioner(resource: XdgWmBaseResource, id: number): void {
    const xdgPositionerResource = new XdgPositionerResource(resource.client, id, resource.version)
    XdgPositioner.create(this.session, xdgPositionerResource)
  }

  getXdgSurface(resource: XdgWmBaseResource, id: number, wlSurfaceResource: WlSurfaceResource): void {
    const surface = /** @type {Surface} */ wlSurfaceResource.implementation as Surface
    if (surface.pendingState.buffer || surface.state.bufferContents) {
      resource.postError(
        XdgWmBaseError.invalidSurfaceState,
        'Surface had a buffer attached before xdg surface was created.',
      )
      this.session.logger.warn(
        '[client-protocol-error] - Surface had a buffer attached before xdg surface was created.',
      )
      return
    }

    const xdgSurfaceResource = new XdgSurfaceResource(resource.client, id, resource.version)
    XdgSurface.create(xdgSurfaceResource, surface, this.session, this.seat)
    this.wlSurfaceResources.push(wlSurfaceResource)
    wlSurfaceResource.onDestroy().then(() => {
      const index = this.wlSurfaceResources.indexOf(wlSurfaceResource)
      if (index > -1) {
        this.wlSurfaceResources.splice(index, 1)
      }
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pong(resource: XdgWmBaseResource, serial: number): void {
    const pingState = this.clientPingStates.get(resource.client)
    if (pingState) {
      if (pingState.pingTimeoutActive) {
        this.setUnresponsive(resource.client, false)
        pingState.pingTimeoutActive = false
      }
      self.clearTimeout(pingState.timeoutTimer)
      pingState.pingTimer = self.setTimeout(() => this.doPing(resource, pingState), 5000)
    }
  }

  private doPing(
    resource: XdgWmBaseResource,
    pingState: { timeoutTimer: number; pingTimer: number; pingTimeoutActive: boolean },
  ) {
    pingState.timeoutTimer = window.setTimeout(() => {
      if (!pingState.pingTimeoutActive) {
        // ping timed out, make view gray
        pingState.pingTimeoutActive = true
        this.setUnresponsive(resource.client, true)
      }
    }, 2000)
    // FIXME use a proper serial
    resource.ping(0)
    this.session.flush()
  }

  private setUnresponsive(client: Client, value: boolean) {
    this.session.userShell.events.unresponsive?.({ id: client.id }, value)
  }
}
