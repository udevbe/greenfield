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
  XdgWmBaseError,
} from 'westfield-runtime-server'
import { translation } from './math/Mat4'
import { createRect, intersect, RectRO, RectROWithInfo, withInfo } from './math/Rect'
import Seat from './Seat'
import Session from './Session'
import Surface from './Surface'
import XdgPopup from './XdgPopup'
import XdgPositioner from './XdgPositioner'

import XdgToplevel from './XdgToplevel'

export default class XdgSurface implements XdgSurfaceRequests {
  private pendingWindowGeometry: RectRO = {
    x0: Number.MIN_SAFE_INTEGER,
    y0: Number.MIN_SAFE_INTEGER,
    x1: Number.MAX_SAFE_INTEGER,
    y1: Number.MAX_SAFE_INTEGER,
  }
  configureSerial = 0
  windowGeometry: RectROWithInfo = createRect({ x: 0, y: 0 }, { width: 0, height: 0 })

  constructor(
    public readonly xdgSurfaceResource: XdgSurfaceResource,
    public readonly wlSurfaceResource: WlSurfaceResource,
    private readonly session: Session,
    private readonly seat: Seat,
  ) {}

  static create(
    xdgSurfaceResource: XdgSurfaceResource,
    wlSurfaceResource: WlSurfaceResource,
    session: Session,
    seat: Seat,
  ): XdgSurface {
    const xdgSurface = new XdgSurface(xdgSurfaceResource, wlSurfaceResource, session, seat)
    xdgSurfaceResource.implementation = xdgSurface
    const surface = wlSurfaceResource.implementation as Surface
    surface.hasKeyboardInput = true
    surface.hasPointerInput = true
    surface.hasTouchInput = true
    return xdgSurface
  }

  destroy(resource: XdgSurfaceResource): void {
    resource.destroy()
  }

  getToplevel(resource: XdgSurfaceResource, id: number): void {
    const surface = this.wlSurfaceResource.implementation as Surface
    if (surface.role) {
      resource.postError(XdgWmBaseError.role, 'Given surface has another role.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }
    const xdgToplevelResource = new XdgToplevelResource(resource.client, id, resource.version)
    const xdgToplevel = XdgToplevel.create(xdgToplevelResource, this, this.session)
    xdgToplevelResource.implementation = xdgToplevel
    this.ackConfigure = (resource, serial) => xdgToplevel.ackConfigure(serial)
  }

  getPopup(
    resource: XdgSurfaceResource,
    id: number,
    parent: XdgSurfaceResource,
    positioner: XdgPositionerResource,
  ): void {
    const surface = this.wlSurfaceResource.implementation as Surface
    if (surface.role) {
      resource.postError(XdgWmBaseError.role, 'Given surface has another role.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }

    const xdgPositioner = positioner.implementation as XdgPositioner
    if (xdgPositioner.size === undefined) {
      resource.postError(XdgWmBaseError.invalidPositioner, 'Client provided an invalid positioner. Size is NULL.')
      this.session.logger.warn('[client-protocol-error] - Client provided an invalid positioner. Size is NULL.')
      return
    }

    if (xdgPositioner.anchorRect === undefined) {
      resource.postError(XdgWmBaseError.invalidPositioner, 'Client provided an invalid positioner. AnchorRect is NULL.')
      this.session.logger.warn('[client-protocol-error] - Client provided an invalid positioner. AnchorRect is NULL.')
      return
    }

    const positionerState = xdgPositioner.createStateCopy()

    const xdgPopupResource = new XdgPopupResource(resource.client, id, resource.version)
    const xdgPopup = XdgPopup.create(this.session, xdgPopupResource, this, parent, positionerState, this.seat)
    this.ackConfigure = (resource, serial) => xdgPopup.ackConfigure(serial)

    if (parent) {
      const parentXdgSurface = parent.implementation as XdgSurface
      const parentSurface = parentXdgSurface.wlSurfaceResource.implementation as Surface
      parentSurface.addChild(surface.surfaceChildSelf)
    }
  }

  setWindowGeometry(resource: XdgSurfaceResource, x: number, y: number, width: number, height: number): void {
    if (width <= 0 || height <= 0) {
      resource.postError(XdgWmBaseError.invalidSurfaceState, 'Client provided negative window geometry.')
      this.session.logger.warn('[client-protocol-error] - Client provided negative window geometry.')
      return
    }
    this.pendingWindowGeometry = createRect({ x, y }, { width, height })
  }

  commitWindowGeometry(): void {
    if (this.pendingWindowGeometry !== this.windowGeometry) {
      this.windowGeometry = withInfo(intersect(this.createBoundingRectangle(), this.pendingWindowGeometry))
      this.pendingWindowGeometry = this.windowGeometry
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ackConfigure(resource: XdgSurfaceResource, serial: number): void {
    throw new Error('BUG. This call must be implemented by a subclass.')
  }

  emitConfigureDone(): void {
    this.xdgSurfaceResource.configure(++this.configureSerial)
  }

  private createBoundingRectangle(): RectRO {
    const xs = [0]
    const ys = [0]

    const surface = this.wlSurfaceResource.implementation as Surface
    const size = surface.size
    if (size) {
      xs.push(size.width)
      ys.push(size.height)

      surface.state.subsurfaceChildren.forEach((subsurfaceChild) => {
        const subsurfacePosition = subsurfaceChild.position
        const subsurfaceSize = subsurfaceChild.surface.size
        if (subsurfaceSize) {
          xs.push(subsurfacePosition.x)
          ys.push(subsurfacePosition.y)
          xs.push(subsurfacePosition.x + subsurfaceSize.width)
          ys.push(subsurfacePosition.y + subsurfaceSize.height)
        }
      })

      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys)
      const maxY = Math.max(...ys)

      return { x0: minX, y0: minY, x1: maxX, y1: maxY }
    } else {
      return { x0: 0, y0: 0, x1: 0, y1: 0 }
    }
  }
}
