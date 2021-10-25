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
  WlSeatResource,
  XdgPopupError,
  XdgPopupRequests,
  XdgPopupResource,
  XdgWmBaseError,
} from 'westfield-runtime-server'
import { DesktopSurface } from './Desktop'

import { RectWithInfo } from './math/Rect'
import { Size, ZERO_SIZE } from './math/Size'
import { Seat } from './Seat'
import Session from './Session'
import Surface from './Surface'
import SurfaceRole, { DesktopSurfaceRole } from './SurfaceRole'
import View from './View'
import { XdgPositionerState } from './XdgPositioner'
import XdgSurface from './XdgSurface'
import XdgToplevel from './XdgToplevel'

export default class XdgPopup implements XdgPopupRequests, SurfaceRole, DesktopSurfaceRole {
  committed = false
  readonly desktopSurface: DesktopSurface

  private constructor(
    private readonly session: Session,
    public readonly resource: XdgPopupResource,
    public readonly xdgSurface: XdgSurface,
    public readonly parent: XdgSurface,
    public readonly positionerState: XdgPositionerState,
    public readonly view: View,
    public readonly geometry: RectWithInfo,
  ) {
    this.desktopSurface = DesktopSurface.create(view.surface, this)
  }

  static create(
    session: Session,
    xdgPopupResource: XdgPopupResource,
    xdgSurface: XdgSurface,
    parent: XdgSurface,
    positionerState: XdgPositionerState,
    seat: Seat,
    geometry: RectWithInfo,
  ): XdgPopup {
    const surface = xdgSurface.surface
    const view = View.create(surface)
    const xdgPopup = new XdgPopup(session, xdgPopupResource, xdgSurface, parent, positionerState, view, geometry)
    xdgPopupResource.implementation = xdgPopup
    surface.role = xdgPopup
    return xdgPopup
  }

  onCommit(surface: Surface): void {
    surface.commitPending()
    if (this.xdgSurface.commit()) {
      //client error
      return
    }

    if (!this.committed) {
      this.xdgSurface.scheduleConfigure(false, () => this.sendConfigure())
    }
    this.committed = true
    surface.session.renderer.render()
  }

  destroy(resource: XdgPopupResource): void {
    const seat = this.session.globals.seat
    if (seat.popupGrab !== undefined) {
      const topmost = seat.popupGrab.getTopmostDesktopSurface()
      if (topmost !== this.desktopSurface) {
        resource.postError(
          XdgWmBaseError.notTheTopmostPopup,
          'Client protocol error. XdgPopup was destroyed while it was not the topmost popup.',
        )
      }

      seat.popupGrab.removeSurface(this.desktopSurface)
    }
    this.xdgSurface.configureIdle?.()
    this.xdgSurface.configureList = []
    resource.destroy()
  }

  grab(resource: XdgPopupResource, wlSeatResource: WlSeatResource, serial: number): void {
    if (this.xdgSurface.surface.mapped) {
      this.session.logger.warn('Client protocol error. Popup is already mapped.')
      resource.postError(XdgPopupError.invalidGrab, 'Client protocol error. XdgPopup is already mapped.')
      return
    }

    const parentIsToplevel = this.xdgSurface.surface.parent?.role instanceof XdgToplevel

    const topmost = this.session.globals.seat.popupGrab?.getTopmostDesktopSurface()
    if (
      (topmost === undefined && !parentIsToplevel) ||
      (topmost !== undefined && topmost !== this.xdgSurface.surface.parent?.role?.desktopSurface)
    ) {
      this.session.logger.warn('Client protocol error. XdgPopup was not created on the topmost popup.')
      resource.postError(
        XdgWmBaseError.notTheTopmostPopup,
        'Client protocol error. XdgPopup was not created on the topmost popup.',
      )
      return
    }

    this.desktopSurface.popupGrab(serial)
  }

  requestClose(): void {
    this.resource.popupDone()
  }

  queryGeometry(): RectWithInfo {
    return this.xdgSurface.surface.geometry
  }

  configureSize(size: Size): void {
    // no op
  }

  configureActivated(activated: boolean): void {
    // no op
  }

  configureFullscreen(fullscreen: boolean): void {
    // no op
  }

  configureMaximized(maximized: boolean): void {
    // no op
  }

  configureResizing(resizing: boolean): void {
    // no op
  }

  queryFullscreen(): boolean {
    return false
  }

  queryMaxSize(): Size {
    return { width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER }
  }

  queryMaximized(): boolean {
    return false
  }

  queryMinSize(): Size {
    return ZERO_SIZE
  }

  private sendConfigure() {
    this.resource.configure(
      this.geometry.position.x,
      this.geometry.position.y,
      this.geometry.size.width,
      this.geometry.size.height,
    )
    return {
      serial: this.xdgSurface.configureSerial++,
    }
  }
}
