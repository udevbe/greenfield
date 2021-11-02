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
  WlOutputResource,
  WlSeatResource,
  XdgSurfaceError,
  XdgToplevelRequests,
  XdgToplevelResource,
  XdgToplevelState,
  XdgWmBaseError,
} from 'westfield-runtime-server'
import { DesktopSurface } from './Desktop'
import { minusPoint, ORIGIN } from './math/Point'
import { RectWithInfo } from './math/Rect'
import { Size, ZERO_SIZE } from './math/Size'
import Session from './Session'
import Surface from './Surface'
import { DesktopSurfaceRole } from './SurfaceRole'
import View from './View'
import XdgSurface, { XdgConfigure } from './XdgSurface'

type ToplevelState = {
  maximized?: XdgToplevelState.maximized
  fullscreen?: XdgToplevelState.fullscreen
  resizing?: XdgToplevelState.resizing
  activated?: XdgToplevelState.activated
}

export type ToplevelXdgConfigure = {
  state: ToplevelState
  size: Size
} & XdgConfigure

export default class XdgToplevel implements XdgToplevelRequests, DesktopSurfaceRole {
  readonly desktopSurface: DesktopSurface
  pending: {
    state: ToplevelState
    size: Size
  } = {
    state: {},
    size: ZERO_SIZE,
  }
  next: {
    state: ToplevelState
    size: Size
    minSize: Size
    maxSize: Size
  } = {
    state: {},
    size: ZERO_SIZE,
    minSize: ZERO_SIZE,
    maxSize: {
      width: Number.MAX_SAFE_INTEGER,
      height: Number.MAX_SAFE_INTEGER,
    },
  }
  current: {
    state: ToplevelState
    minSize: Size
    maxSize: Size
  } = {
    state: {},
    minSize: ZERO_SIZE,
    maxSize: {
      width: Number.MAX_SAFE_INTEGER,
      height: Number.MAX_SAFE_INTEGER,
    },
  }
  private added = false

  private constructor(
    public readonly resource: XdgToplevelResource,
    public readonly xdgSurface: XdgSurface,
    private readonly session: Session,
    public readonly view: View,
  ) {
    this.desktopSurface = DesktopSurface.create(view.surface, this)
  }

  static create(xdgToplevelResource: XdgToplevelResource, xdgSurface: XdgSurface, session: Session): XdgToplevel {
    const surface = xdgSurface.surface
    const view = View.create(surface)
    const xdgToplevel = new XdgToplevel(xdgToplevelResource, xdgSurface, session, view)
    xdgToplevelResource.implementation = xdgToplevel
    surface.role = xdgToplevel
    return xdgToplevel
  }

  queryMaximized(): boolean {
    return this.current.state.maximized !== undefined
  }

  queryFullscreen(): boolean {
    return this.current.state.fullscreen !== undefined
  }

  configureMaximized(maximized: boolean): void {
    this.pending.state.maximized = maximized ? XdgToplevelState.maximized : undefined
    this.xdgSurface.scheduleConfigure(this.stateCompareEquals(), () => this.sendConfigure())
  }

  configureFullscreen(fullscreen: boolean): void {
    this.pending.state.fullscreen = fullscreen ? XdgToplevelState.fullscreen : undefined
    this.xdgSurface.scheduleConfigure(this.stateCompareEquals(), () => this.sendConfigure())
  }

  onCommit(surface: Surface): void {
    surface.commitPending()
    if (this.xdgSurface.commit()) {
      // surface in error
      return
    }

    if (this.xdgSurface.surface.state.buffer === undefined && !this.added) {
      this.ensureAdded()
      return
    }

    const geometry = this.xdgSurface.surface.geometry

    if (this.next.state.maximized) {
      if (this.next.size.width !== geometry.size.width || this.next.size.width !== geometry.size.width) {
        const errorMessage = `Client protocol error. xdg_surface buffer (${geometry.size.width}x${geometry.size.height}) does not match the configured maximum state (${this.next.size.width}x${this.next.size.height})`
        this.session.logger.warn(errorMessage)
        this.resource.postError(XdgWmBaseError.invalidSurfaceState, errorMessage)
        return
      }
    }

    if (
      this.next.state.fullscreen &&
      (this.next.size.width !== geometry.size.width || this.next.size.width !== geometry.size.width)
    ) {
      const errorMessage = `Client protocol error. xdg_surface buffer (${geometry.size.width}x${geometry.size.height})  is larger than the configured fullscreen state  (${this.next.size.width}x${this.next.size.height})`
      this.session.logger.warn(errorMessage)
      this.resource.postError(XdgWmBaseError.invalidSurfaceState, errorMessage)
      return
    }

    this.current.state = { ...this.next.state }
    this.current.minSize = this.next.minSize
    this.current.maxSize = this.next.maxSize

    this.desktopSurface.commit()
    surface.session.renderer.render()
  }

  ackConfigure(serial: number, configure: ToplevelXdgConfigure): void {
    this.next.state = { ...configure.state }
    this.next.size = configure.size
  }

  destroy(resource: XdgToplevelResource): void {
    this.xdgSurface.surface.unmap()
    this.xdgSurface.configureIdle?.()
    this.xdgSurface.configureList = []
    if (this.added) {
      this.desktopSurface.removed()
    }
    resource.destroy()
  }

  setParent(resource: XdgToplevelResource, parent: XdgToplevelResource | undefined): void {
    const parentXdgToplevel = parent?.implementation as XdgToplevel | undefined

    this.ensureAdded()
    this.desktopSurface.setParent(parentXdgToplevel?.desktopSurface)
  }

  setTitle(resource: XdgToplevelResource, title: string): void {
    this.desktopSurface.setTitle(title)
  }

  setAppId(resource: XdgToplevelResource, appId: string): void {
    this.desktopSurface.setAppId(appId)
  }

  showWindowMenu(
    resource: XdgToplevelResource,
    wlSeatResource: WlSeatResource,
    serial: number,
    x: number,
    y: number,
  ): void {
    if (!this.xdgSurface.configured) {
      this.session.logger.warn('Client protocol error. Surface has not been configured yet.')
      resource.postError(XdgSurfaceError.notConstructed, 'Client protocol error. Surface has not been configured yet.')
      return
    }

    // TODO user shell show window menu at position
  }

  move(resource: XdgToplevelResource, wlSeatResource: WlSeatResource, serial: number): void {
    if (!this.xdgSurface.configured) {
      this.session.logger.warn('Client protocol error. Surface has not been configured yet.')
      resource.postError(XdgSurfaceError.notConstructed, 'Client protocol error. Surface has not been configured yet.')
      return
    }
    this.desktopSurface.move(serial)
  }

  resize(resource: XdgToplevelResource, wlSeatResource: WlSeatResource, serial: number, edges: number): void {
    if (!this.xdgSurface.configured) {
      this.session.logger.warn('Client protocol error. Surface has not been configured yet.')
      resource.postError(XdgSurfaceError.notConstructed, 'Client protocol error. Surface has not been configured yet.')
      return
    }

    this.desktopSurface.resize(serial, edges)
  }

  setMaxSize(resource: XdgToplevelResource, width: number, height: number): void {
    this.next.maxSize = { width, height }
  }

  setMinSize(resource: XdgToplevelResource, width: number, height: number): void {
    this.next.minSize = { width, height }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMaximized(resource: XdgToplevelResource): void {
    this.ensureAdded()
    this.desktopSurface.setMaximized(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unsetMaximized(resource: XdgToplevelResource): void {
    this.ensureAdded()
    this.desktopSurface.setMaximized(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFullscreen(resource: XdgToplevelResource, output: WlOutputResource | undefined): void {
    this.ensureAdded()
    this.desktopSurface.setFullscreen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unsetFullscreen(resource: XdgToplevelResource): void {
    this.ensureAdded()
    this.desktopSurface.setFullscreen(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMinimized(resource: XdgToplevelResource): void {
    this.ensureAdded()
    this.desktopSurface.minimize()
  }

  requestClose(): void {
    this.resource.close()
  }

  queryGeometry(): RectWithInfo {
    return this.xdgSurface.surface.geometry
  }

  configureSize(size: Size): void {
    this.pending.size = size
    this.xdgSurface.scheduleConfigure(this.stateCompareEquals(), () => this.sendConfigure())
  }

  configureActivated(activated: boolean): void {
    this.pending.state.activated = activated ? XdgToplevelState.activated : undefined
    this.xdgSurface.scheduleConfigure(this.stateCompareEquals(), () => this.sendConfigure())
  }

  configureResizing(resizing: boolean): void {
    this.pending.state.resizing = resizing ? XdgToplevelState.resizing : undefined
    this.xdgSurface.scheduleConfigure(this.stateCompareEquals(), () => this.sendConfigure())
  }

  queryMaxSize(): Size {
    return this.current.maxSize
  }

  queryMinSize(): Size {
    return this.current.minSize
  }

  private ensureAdded() {
    if (this.added) {
      return
    }
    this.desktopSurface.add()
    this.xdgSurface.scheduleConfigure(this.stateCompareEquals(), () => this.sendConfigure())
    this.added = true
  }

  private stateCompareEquals() {
    if (!this.xdgSurface.configured) {
      return false
    }

    const configured: {
      state: ToplevelState
      size: Size
    } = {
      state: {},
      size: ZERO_SIZE,
    }

    if (this.xdgSurface.configureList.length === 0) {
      configured.state = this.current.state
      configured.size = this.xdgSurface.surface.geometry.size
    } else {
      const xdgConfigure = this.xdgSurface.configureList[
        this.xdgSurface.configureList.length - 1
      ] as ToplevelXdgConfigure
      configured.state = xdgConfigure.state
      configured.size = xdgConfigure.size
    }

    if (this.pending.state.activated !== configured.state.activated) {
      return false
    }
    if (this.pending.state.fullscreen !== configured.state.fullscreen) {
      return false
    }
    if (this.pending.state.maximized !== configured.state.maximized) {
      return false
    }
    if (this.pending.state.resizing !== configured.state.resizing) {
      return false
    }

    if (this.pending.size.width == configured.size.width && this.pending.size.height == configured.size.height) {
      return true
    }

    return this.pending.size.width === 0 && this.pending.size.height === 0
  }

  private sendConfigure(): ToplevelXdgConfigure {
    const configure: ToplevelXdgConfigure = {
      state: this.pending.state,
      size: this.pending.size,
      serial: this.xdgSurface.configureSerial++,
    }

    const states: XdgToplevelState[] = []
    if (this.pending.state.maximized) {
      states.push(this.pending.state.maximized)
    }
    if (this.pending.state.fullscreen) {
      states.push(this.pending.state.fullscreen)
    }
    if (this.pending.state.resizing) {
      states.push(this.pending.state.resizing)
    }
    if (this.pending.state.activated) {
      states.push(this.pending.state.activated)
    }
    this.resource.configure(this.pending.size.width, this.pending.size.height, new Uint32Array(states))

    return configure
  }
}
