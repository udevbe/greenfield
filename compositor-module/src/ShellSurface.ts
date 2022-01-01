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
  WlShellSurfaceRequests,
  WlShellSurfaceResize,
  WlShellSurfaceResource,
  WlShellSurfaceTransient,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import { DesktopSurface } from './Desktop'
import { ORIGIN, Point } from './math/Point'
import { RectWithInfo } from './math/Rect'
import { Size, ZERO_SIZE } from './math/Size'

import Session from './Session'
import Surface from './Surface'
import { DesktopSurfaceRole } from './SurfaceRole'
import View from './View'

const { none } = WlShellSurfaceResize

enum SurfaceStates {
  MAXIMIZED,
  FULLSCREEN,
  POPUP,
  TRANSIENT,
  TOP_LEVEL,
}

export default class ShellSurface implements WlShellSurfaceRequests, DesktopSurfaceRole {
  state?: SurfaceStates
  readonly desktopSurface: DesktopSurface
  private _pingTimeoutActive = false
  private _timeoutTimer = 0
  private _pingTimer = 0
  private added = false

  private constructor(
    public readonly resource: WlShellSurfaceResource,
    public readonly surface: Surface,
    public readonly session: Session,
    public readonly view: View,
  ) {
    this.desktopSurface = DesktopSurface.create(this.surface, this)
  }

  static create(
    wlShellSurfaceResource: WlShellSurfaceResource,
    wlSurfaceResource: WlSurfaceResource,
    session: Session,
  ): ShellSurface {
    wlSurfaceResource.onDestroy().then(() => wlShellSurfaceResource.destroy())
    const surface = wlSurfaceResource.implementation as Surface
    const view = View.create(surface)
    const shellSurface = new ShellSurface(wlShellSurfaceResource, surface, session, view)
    wlShellSurfaceResource.implementation = shellSurface

    surface.role = shellSurface
    shellSurface.doPing(wlShellSurfaceResource)

    wlShellSurfaceResource.onDestroy().then(() => {
      clearTimeout(shellSurface._timeoutTimer)
      clearTimeout(shellSurface._pingTimer)
      shellSurface.handleDestroy()
    })

    return shellSurface
  }

  requestClose(): void {
    if (this.state === SurfaceStates.POPUP) {
      this.resource.popupDone()
    }
  }

  queryMaximized(): boolean {
    return this.state === SurfaceStates.MAXIMIZED
  }

  queryFullscreen(): boolean {
    return this.state === SurfaceStates.FULLSCREEN
  }

  queryGeometry(): RectWithInfo {
    return this.surface.geometry
  }

  queryMinSize(): Size {
    return ZERO_SIZE
  }

  queryMaxSize(): Size {
    return { width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER }
  }

  configureMaximized(): void {
    // no op
  }

  configureFullscreen(): void {
    // no op
  }

  configureSize({ width, height }: Size): void {
    if ((this.surface.size?.width === width && this.surface.size.height === height) || (width === 0 && height === 0)) {
      return
    }

    this.resource.configure(none, width, height)
  }

  configureActivated(): void {
    throw new Error('Method not implemented.')
  }

  configureResizing(): void {
    throw new Error('Method not implemented.')
  }

  onCommit(surface: Surface): void {
    surface.commitPending()
    if (this.surface.state.buffer === undefined) {
      this.maybeUngrab()
    }
    this.desktopSurface.commit()
    this.session.renderer.render()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pong(resource: WlShellSurfaceResource): void {
    if (this._pingTimeoutActive) {
      this.session.userShell.events.unresponsive?.({ id: resource.client.id }, false)
      this._pingTimeoutActive = false
    }
    clearTimeout(this._timeoutTimer)
    this._pingTimer = self.setTimeout(() => this.doPing(resource), 5000)
  }

  doPing(resource: WlShellSurfaceResource): void {
    this._timeoutTimer = self.setTimeout(() => {
      if (!this._pingTimeoutActive) {
        // ping timed out, make view gray
        this._pingTimeoutActive = true
        this.session.userShell.events.unresponsive?.({ id: resource.client.id }, true)
      }
    }, 2000)
    // FIXME use a proper serial
    resource.ping(0)
    this.session.flush()
  }

  move(resource: WlShellSurfaceResource, wlSeatResource: WlSeatResource, serial: number): void {
    this.desktopSurface.move(serial)
  }

  resize(resource: WlShellSurfaceResource, wlSeatResource: WlSeatResource, serial: number, edges: number): void {
    this.desktopSurface.resize(serial, edges)
  }

  setToplevel(): void {
    this.changeState(SurfaceStates.TOP_LEVEL, undefined, ORIGIN)
    if (this.surface.parent === undefined) {
      return
    }
    this.desktopSurface.setParent(undefined)
  }

  setTransient(resource: WlShellSurfaceResource, parent: WlSurfaceResource, x: number, y: number, flags: number): void {
    const parentSurface = parent.implementation as Surface
    if (parentSurface.role?.desktopSurface === undefined) {
      return
    }

    if (flags & WlShellSurfaceTransient.inactive) {
      this.changeState(SurfaceStates.TRANSIENT, parentSurface.role.desktopSurface, { x, y })
    } else {
      this.changeState(SurfaceStates.TOP_LEVEL, undefined, ORIGIN)
      this.desktopSurface.setParent(parentSurface.role.desktopSurface)
    }
  }

  // TODO take over the complete webgl canvas directly, perhaps even make the browser fullscreen
  setFullscreen(): void {
    this.changeState(SurfaceStates.FULLSCREEN, undefined, ORIGIN)
    this.desktopSurface.setFullscreen(true)
  }

  setPopup(
    resource: WlShellSurfaceResource,
    wlSeatResource: WlSeatResource,
    serial: number,
    parent: WlSurfaceResource,
    x: number,
    y: number,
  ): void {
    const parentSurface = parent.implementation as Surface
    if (parentSurface.role?.desktopSurface === undefined) {
      return
    }

    this.changeState(SurfaceStates.POPUP, parentSurface.role.desktopSurface, { x, y })
    this.desktopSurface.popupGrab(serial)
  }

  setMaximized(): void {
    this.changeState(SurfaceStates.MAXIMIZED, undefined, ORIGIN)
    this.desktopSurface.setMaximized(true)
  }

  setTitle(resource: WlShellSurfaceResource, title: string): void {
    this.desktopSurface.setTitle(title)
  }

  setClass(resource: WlShellSurfaceResource, clazz: string): void {
    this.desktopSurface.setAppId(clazz)
  }

  private changeState(state: SurfaceStates, parent: DesktopSurface | undefined, position: Point) {
    const toAdd = parent === undefined
    if (toAdd && this.added) {
      this.state = state
      return
    }

    if (this.state !== state) {
      if (this.state === SurfaceStates.POPUP) {
        this.maybeUngrab()
      }

      if (toAdd) {
        this.desktopSurface.setParent(undefined)
        this.desktopSurface.add()
      } else if (this.added) {
        this.desktopSurface.removed()
      }

      this.state = state
      this.added = toAdd
    }

    if (parent !== undefined) {
      this.desktopSurface.surface.surfaceChildSelf.position = position
      this.desktopSurface.setParent(parent)
    }
  }

  private handleDestroy() {
    this.maybeUngrab()
    if (this.added) {
      this.desktopSurface.removed()
    }
  }

  private maybeUngrab() {
    const seat = this.session.globals.seat
    if (this.state !== SurfaceStates.POPUP || !seat.popupGrab?.surfaces?.includes(this.desktopSurface)) {
      return
    }

    seat.popupGrab?.removeSurface(this.desktopSurface)
  }
}
