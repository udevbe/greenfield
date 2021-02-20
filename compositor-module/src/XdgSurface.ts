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
  WlSurfaceResource,
  XdgPopupResource,
  XdgPositionerResource,
  XdgSurfaceRequests,
  XdgSurfaceResource,
  XdgToplevelResource,
  XdgWmBaseError
} from 'westfield-runtime-server'
import Rect from './math/Rect'
import Seat from './Seat'
import Session from './Session'
import Surface from './Surface'
import XdgPopup from './XdgPopup'
import XdgPositioner from './XdgPositioner'

import XdgToplevel from './XdgToplevel'

/**
 *
 *      An interface that may be implemented by a wl_surface, for
 *      implementations that provide a desktop-style user interface.
 *
 *      It provides a base set of functionality required to construct user
 *      interface elements requiring management by the compositor, such as
 *      toplevel windows, menus, etc. The types of functionality are split into
 *      xdg_surface roles.
 *
 *      Creating an xdg_surface does not set the role for a wl_surface. In order
 *      to map an xdg_surface, the client must create a role-specific object
 *      using, e.g., get_toplevel, get_popup. The wl_surface for any given
 *      xdg_surface can have at most one role, and may not be assigned any role
 *      not based on xdg_surface.
 *
 *      A role must be assigned before any other requests are made to the
 *      xdg_surface object.
 *
 *      The client must call wl_surface.commit on the corresponding wl_surface
 *      for the xdg_surface state to take effect.
 *
 *      Creating an xdg_surface from a wl_surface which has a buffer attached or
 *      committed is a client error, and any attempts by a client to attach or
 *      manipulate a buffer prior to the first xdg_surface.configure call must
 *      also be treated as errors.
 *
 *      Mapping an xdg_surface-based role surface is defined as making it
 *      possible for the surface to be shown by the compositor. Note that
 *      a mapped surface is not guaranteed to be visible once it is mapped.
 *
 *      For an xdg_surface to be mapped by the compositor, the following
 *      conditions must be met:
 *      (1) the client has assigned an xdg_surface-based role to the surface
 *      (2) the client has set and committed the xdg_surface state and the
 *    role-dependent state to the surface
 *      (3) the client has committed a buffer to the surface
 *
 *      A newly-unmapped surface is considered to have met condition (1) out
 *      of the 3 required conditions for mapping a surface if its role surface
 *      has not been destroyed.
 */
export default class XdgSurface implements XdgSurfaceRequests {
  readonly xdgSurfaceResource: XdgSurfaceResource
  readonly wlSurfaceResource: WlSurfaceResource
  pendingWindowGeometry: Rect = Rect.create(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
  configureSerial: number = 0
  windowGeometry: Rect = Rect.create(0, 0, 0, 0)
  private readonly _session: Session
  private readonly _seat: Seat

  static create(xdgSurfaceResource: XdgSurfaceResource, wlSurfaceResource: WlSurfaceResource, session: Session, seat: Seat): XdgSurface {
    const xdgSurface = new XdgSurface(xdgSurfaceResource, wlSurfaceResource, session, seat)
    xdgSurfaceResource.implementation = xdgSurface
    const surface = wlSurfaceResource.implementation as Surface
    surface.hasKeyboardInput = true
    surface.hasPointerInput = true
    surface.hasTouchInput = true
    return xdgSurface
  }

  constructor(xdgSurfaceResource: XdgSurfaceResource, wlSurfaceResource: WlSurfaceResource, session: Session, seat: Seat) {
    this.xdgSurfaceResource = xdgSurfaceResource
    this.wlSurfaceResource = wlSurfaceResource
    this._session = session
    this._seat = seat
  }

  destroy(resource: XdgSurfaceResource) {
    resource.destroy()
  }

  getToplevel(resource: XdgSurfaceResource, id: number) {
    const surface = this.wlSurfaceResource.implementation as Surface
    if (surface.role) {
      resource.postError(XdgWmBaseError.role, 'Given surface has another role.')
      console.log('[client-protocol-error] - Given surface has another role.')
      return
    }
    const xdgToplevelResource = new XdgToplevelResource(resource.client, id, resource.version)
    const xdgToplevel = XdgToplevel.create(xdgToplevelResource, this, this._session)
    xdgToplevelResource.implementation = xdgToplevel
    this.ackConfigure = (resource, serial) => xdgToplevel.ackConfigure(serial)
  }

  getPopup(resource: XdgSurfaceResource, id: number, parent: XdgSurfaceResource, positioner: XdgPositionerResource) {
    const surface = this.wlSurfaceResource.implementation as Surface
    if (surface.role) {
      resource.postError(XdgWmBaseError.role, 'Given surface has another role.')
      console.log('[client-protocol-error] - Given surface has another role.')
      return
    }

    const xdgPositioner = positioner.implementation as XdgPositioner
    if (xdgPositioner.size === undefined) {
      resource.postError(XdgWmBaseError.invalidPositioner, 'Client provided an invalid positioner. Size is NULL.')
      return
    }

    if (xdgPositioner.anchorRect === undefined) {
      resource.postError(XdgWmBaseError.invalidPositioner, 'Client provided an invalid positioner. AnchorRect is NULL.')
      return
    }

    const positionerState = xdgPositioner.createStateCopy()

    const xdgPopupResource = new XdgPopupResource(resource.client, id, resource.version)
    const xdgPopup = XdgPopup.create(xdgPopupResource, this, parent, positionerState, this._seat)
    this.ackConfigure = (resource, serial) => xdgPopup.ackConfigure(serial)

    if (parent) {
      const parentXdgSurface = parent.implementation as XdgSurface
      const parentSurface = parentXdgSurface.wlSurfaceResource.implementation as Surface
      parentSurface.addChild(surface.surfaceChildSelf)
    }
  }

  setWindowGeometry(resource: XdgSurfaceResource, x: number, y: number, width: number, height: number) {
    if (width <= 0 || height <= 0) {
      resource.postError(XdgWmBaseError.invalidSurfaceState, 'Client provided negative window geometry.')
      console.log('[client-protocol-error] - Client provided negative window geometry.')
      return
    }
    this.pendingWindowGeometry = Rect.create(x, y, x + width, y + height)
  }

  commitWindowGeometry() {
    this.windowGeometry = this._createBoundingRectangle().intersect(this.pendingWindowGeometry)
  }

  private _createBoundingRectangle(): Rect {
    const xs = [0]
    const ys = [0]

    const surface = this.wlSurfaceResource.implementation as Surface
    const size = surface.size
    if (size) {
      xs.push(size.w)
      ys.push(size.h)

      surface.state.subsurfaceChildren.forEach((subsurfaceChild) => {
        const subsurfacePosition = subsurfaceChild.position
        const subsurfaceSize = subsurfaceChild.surface.size
        if (subsurfaceSize) {
          xs.push(subsurfacePosition.x)
          ys.push(subsurfacePosition.y)
          xs.push(subsurfacePosition.x + subsurfaceSize.w)
          ys.push(subsurfacePosition.y + subsurfaceSize.h)
        }
      })

      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)

      return Rect.create(minX, minY, maxX, maxY)
    } else {
      return Rect.create(0, 0, 0, 0)
    }
  }

  ackConfigure(resource: XdgSurfaceResource, serial: number) {
    throw new Error('BUG. This call must be implemented by a subclass.')
  }

  emitConfigureDone() {
    this.xdgSurfaceResource.configure(++this.configureSerial)
  }
}
