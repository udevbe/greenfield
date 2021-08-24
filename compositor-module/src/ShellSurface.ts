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
  WlShellSurfaceRequests,
  WlShellSurfaceResize,
  WlShellSurfaceResource,
  WlShellSurfaceTransient,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import { CompositorSurface, CompositorSurfaceState } from './index'

import Point from './math/Point'
import Seat from './Seat'
import Session from './Session'
import Surface from './Surface'
import { UserShellSurfaceRole } from './UserShellSurfaceRole'
import View from './View'

const { bottom, bottomLeft, bottomRight, left, none, right, top, topLeft, topRight } = WlShellSurfaceResize
const { inactive } = WlShellSurfaceTransient

const SurfaceStates = {
  MAXIMIZED: 'maximized',
  FULLSCREEN: 'fullscreen',
  POPUP: 'popup',
  TRANSIENT: 'transient',
  TOP_LEVEL: 'top_level',
}

export default class ShellSurface implements WlShellSurfaceRequests, UserShellSurfaceRole {
  state?: string
  private _managed = false
  private _pingTimeoutActive = false
  private _timeoutTimer = 0
  private _pingTimer = 0
  private _mapped = false

  private constructor(
    public readonly resource: WlShellSurfaceResource,
    public readonly wlSurfaceResource: WlSurfaceResource,
    public readonly session: Session,
    public readonly userSurface: CompositorSurface,
    private userSurfaceState: CompositorSurfaceState,
    public readonly view: View,
  ) {}

  static create(
    wlShellSurfaceResource: WlShellSurfaceResource,
    wlSurfaceResource: WlSurfaceResource,
    session: Session,
  ): ShellSurface {
    const { client, id } = wlSurfaceResource
    const userSurface: CompositorSurface = { id: `${id}`, clientId: client.id }
    const userSurfaceState: CompositorSurfaceState = {
      appId: '',
      active: false,
      mapped: false,
      minimized: false,
      title: '',
      unresponsive: false,
    }

    const view = View.create(wlSurfaceResource.implementation as Surface)
    const shellSurface = new ShellSurface(
      wlShellSurfaceResource,
      wlSurfaceResource,
      session,
      userSurface,
      userSurfaceState,
      view,
    )
    wlShellSurfaceResource.implementation = shellSurface

    // destroy the shell-surface if the surface is destroyed.
    wlSurfaceResource.onDestroy().then(() => wlShellSurfaceResource.destroy())
    ;(wlSurfaceResource.implementation as Surface).role = shellSurface
    shellSurface.doPing(wlShellSurfaceResource)

    wlShellSurfaceResource.onDestroy().then(() => {
      clearTimeout(shellSurface._timeoutTimer)
      clearTimeout(shellSurface._pingTimer)
    })

    return shellSurface
  }

  onCommit(surface: Surface): void {
    surface.commitPending()
    if (surface.state.bufferContents) {
      if (!this._mapped) {
        this.map()
      }
    } else {
      if (this._mapped) {
        this.unmap()
      }
    }
    this.session.renderer.render()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pong(resource: WlShellSurfaceResource, serial: number): void {
    if (this._pingTimeoutActive) {
      this.userSurfaceState = { ...this.userSurfaceState, unresponsive: false }
      this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
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
        this.userSurfaceState = { ...this.userSurfaceState, unresponsive: true }
        this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
      }
    }, 5000)
    // FIXME use a proper serial
    resource.ping(0)
    this.session.flush()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  move(resource: WlShellSurfaceResource, wlSeatResource: WlSeatResource, serial: number): void {
    const seat = wlSeatResource.implementation as Seat

    // if (!seat.isValidInputSerial(serial)) {
    //   // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Move serial mismatch. Ignoring.')
    //   return
    // }

    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }
    const pointer = seat.pointer
    const surface = this.wlSurfaceResource.implementation as Surface

    const pointerX = pointer.x
    const pointerY = pointer.y

    const topLevelView = this.view
    if (topLevelView) {
      const origPosition = topLevelView.positionOffset

      const moveListener = () => {
        const deltaX = pointer.x - pointerX
        const deltaY = pointer.y - pointerY

        topLevelView.positionOffset = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)
        topLevelView.applyTransformations()
        this.session.renderer.render()
      }

      pointer.onButtonRelease().then(() => pointer.removeMouseMoveListener(moveListener))
      pointer.addMouseMoveListener(moveListener)
    }
  }

  resize(resource: WlShellSurfaceResource, wlSeatResource: WlSeatResource, serial: number, edges: number): void {
    const seat = wlSeatResource.implementation as Seat
    if (!seat.isValidInputSerial(serial)) {
      // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Resize serial mismatch. Ignoring.')
      return
    }

    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }

    const pointer = seat.pointer
    // assigned in switch statement
    let sizeAdjustment: (width: number, height: number, deltaX: number, deltaY: number) => { w: number; h: number }

    switch (edges) {
      case bottomRight: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({
          w: width + deltaX,
          h: height + deltaY,
        })
        break
      }
      case top: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({ w: width, h: height - deltaY })
        break
      }
      case bottom: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({ w: width, h: height + deltaY })
        break
      }
      case left: {
        sizeAdjustment = (width, height, deltaX) => ({ w: width - deltaX, h: height })
        break
      }
      case topLeft: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({
          w: width - deltaX,
          h: height - deltaY,
        })
        break
      }
      case bottomLeft: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({
          w: width - deltaX,
          h: height + deltaY,
        })
        break
      }
      case right: {
        sizeAdjustment = (width, height, deltaX) => ({ w: width + deltaX, h: height })
        break
      }
      case topRight: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({
          w: width + deltaX,
          h: height - deltaY,
        })
        break
      }
      case none:
      default: {
        sizeAdjustment = (width, height) => ({ w: width, h: height })
        break
      }
    }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const { w: surfaceWidth, h: surfaceHeight } = (this.wlSurfaceResource.implementation as Surface).size || {}

    if (surfaceWidth && surfaceHeight) {
      const resizeListener = () => {
        const deltaX = pointer.x - pointerX
        const deltaY = pointer.y - pointerY

        const size = sizeAdjustment(surfaceWidth, surfaceHeight, deltaX, deltaY)
        this.resource.configure(edges, size.w, size.h)
        this.session.flush()
      }
      pointer.onButtonRelease().then(() => pointer.removeMouseMoveListener(resizeListener))
      pointer.addMouseMoveListener(resizeListener)
    }
  }

  requestActive(): void {
    if (this.userSurfaceState.active) {
      return
    }
    this.userSurfaceState = { ...this.userSurfaceState, active: true }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  notifyInactive(): void {
    if (!this.userSurfaceState.active) {
      return
    }
    this.userSurfaceState = { ...this.userSurfaceState, active: false }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setToplevel(resource: WlShellSurfaceResource): void {
    if (this.state === SurfaceStates.POPUP || this.state === SurfaceStates.TRANSIENT) {
      return
    }

    this._ensureUserShellSurface()
    this.state = SurfaceStates.TOP_LEVEL
  }

  setTransient(resource: WlShellSurfaceResource, parent: WlSurfaceResource, x: number, y: number, flags: number): void {
    if (this.state === SurfaceStates.POPUP || this.state === SurfaceStates.TOP_LEVEL) {
      return
    }

    const parentPosition = (parent.implementation as Surface).surfaceChildSelf.position

    const surface = this.wlSurfaceResource.implementation as Surface
    const surfaceChild = surface.surfaceChildSelf
    // FIXME we probably want to provide a method to translate from (abstract) surface space to global space
    surfaceChild.position = Point.create(parentPosition.x + x, parentPosition.y + y)

    surface.hasKeyboardInput = (flags & inactive) === 0

    this._ensureUserShellSurface()
    this.state = SurfaceStates.TRANSIENT
  }

  // TODO take over the complete webgl canvas directly, perhaps even make the browser fullscreen
  setFullscreen(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resource: WlShellSurfaceResource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    method: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    framerate: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    output: WlOutputResource | undefined,
  ): void {
    this.state = SurfaceStates.FULLSCREEN
    const surface = this.wlSurfaceResource.implementation as Surface
    // TODO get proper size in surface coordinates instead of assume surface space === global space
    surface.surfaceChildSelf.position = Point.create(0, 0)
    this.resource.configure(none, window.innerWidth, window.innerHeight)
  }

  setPopup(
    resource: WlShellSurfaceResource,
    wlSeatResource: WlSeatResource,
    serial: number,
    parent: WlSurfaceResource,
    x: number,
    y: number,
    flags: number,
  ): void {
    const seat = wlSeatResource.implementation as Seat
    // if (!seat.isValidInputSerial(seat.buttonPressSerial)) {
    //   this._dismiss()
    //  // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Popup grab input serial mismatch. Ignoring.')
    //   return
    // }

    if (this.state) {
      return
    }

    const pointer = seat.pointer
    this.state = SurfaceStates.POPUP
    const surface = this.wlSurfaceResource.implementation as Surface
    const surfaceChild = surface.surfaceChildSelf
    surfaceChild.position = Point.create(x, y)
    // having added this shell-surface to a parent will have it create a view for each parent view
    ;(parent.implementation as Surface).addChild(surfaceChild)

    surface.hasKeyboardInput = (flags & inactive) === 0

    // handle popup window grab
    pointer.popupGrab(this.wlSurfaceResource).then(() => resource.popupDone())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMaximized(resource: WlShellSurfaceResource, output: WlOutputResource): void {
    this.state = SurfaceStates.MAXIMIZED

    // FIXME get proper size in surface coordinates instead of assume surface space === global space
    const scene = this.view.relevantScene

    if (scene) {
      const width = scene.canvas.width
      const height = scene.canvas.height

      this.view.positionOffset = Point.create(0, 0)
      this.resource.configure(none, width, height)
    }
  }

  setTitle(resource: WlShellSurfaceResource, title: string): void {
    this.userSurfaceState = { ...this.userSurfaceState, title }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  setClass(resource: WlShellSurfaceResource, clazz: string): void {
    this.userSurfaceState = { ...this.userSurfaceState, appId: clazz }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  private map() {
    this._mapped = true
    this.userSurfaceState = { ...this.userSurfaceState, mapped: this._mapped }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  private unmap() {
    this._mapped = false
    this.userSurfaceState = { ...this.userSurfaceState, mapped: this._mapped }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  private _ensureUserShellSurface() {
    if (!this._managed) {
      this._managed = true
      this.wlSurfaceResource
        .onDestroy()
        .then(() => this.session.userShell.events.destroyUserSurface?.(this.userSurface))
      this.session.userShell.events.createUserSurface?.(this.userSurface, this.userSurfaceState)
    }
  }
}
