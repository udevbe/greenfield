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
  XdgToplevelRequests,
  XdgToplevelResizeEdge,
  XdgToplevelResource,
  XdgToplevelState,
  XdgWmBaseError,
} from 'westfield-runtime-server'
import { setCursor } from './browser/cursor'
import { CompositorSurface, CompositorSurfaceState } from './index'
import { minusPoint, plusPoint, PointRO } from './math/Point'
import { RectRO } from './math/Rect'
import { SizeRO } from './math/Size'
import Seat from './Seat'
import Session from './Session'
import Surface from './Surface'
import { makeSurfaceActive } from './UserShellApi'
import { UserShellSurfaceRole } from './UserShellSurfaceRole'
import View from './View'
import XdgSurface from './XdgSurface'

const { none, bottom, bottomLeft, bottomRight, left, right, top, topLeft, topRight } = XdgToplevelResizeEdge
const { fullscreen, activated, maximized, resizing } = XdgToplevelState

interface ConfigureState {
  readonly serial: number
  readonly state: XdgToplevelState[]
  readonly width: number
  readonly height: number
  readonly resizeEdge: number
}

export default class XdgToplevel implements XdgToplevelRequests, UserShellSurfaceRole {
  static create(xdgToplevelResource: XdgToplevelResource, xdgSurface: XdgSurface, session: Session): XdgToplevel {
    const surface = xdgSurface.wlSurfaceResource.implementation as Surface
    const { client, id } = surface.resource
    const userSurface: CompositorSurface = { id: `${id}`, clientId: client.id }
    const view = View.create(surface)
    surface.session.renderer.addTopLevelView(view)
    const xdgToplevel = new XdgToplevel(xdgToplevelResource, xdgSurface, session, userSurface, view)
    xdgToplevelResource.implementation = xdgToplevel
    surface.role = xdgToplevel

    xdgSurface.wlSurfaceResource.onDestroy().then(() => session.userShell.events.destroyUserSurface?.(userSurface))

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    makeSurfaceActive(surface)
    session.userShell.events.createUserSurface?.(userSurface, xdgToplevel.userSurfaceState)

    return xdgToplevel
  }

  mapped = false
  userSurfaceState: CompositorSurfaceState = {
    appId: '',
    active: false,
    mapped: false,
    minimized: false,
    title: '',
    unresponsive: false,
  }
  private parent?: XdgToplevelResource
  private pendingMaxSize: PointRO = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER }
  private maxSize: PointRO = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER }
  private pendingMinSize: PointRO = { x: 0, y: 0 }
  private minSize: PointRO = { x: 0, y: 0 }
  private pendingConfigureStates: ConfigureState[] = []
  private ackedConfigureState: ConfigureState = {
    serial: 0,
    state: [],
    width: 0,
    height: 0,
    resizeEdge: 0,
  }
  private configureState: ConfigureState = {
    serial: 0,
    state: [],
    width: 0,
    height: 0,
    resizeEdge: 0,
  }
  private previousWindowGeometry: RectRO = { x0: 0, y0: 0, x1: 0, y1: 0 }

  private savedConfigureState?: ConfigureState
  private savedViewPositionOffset?: PointRO

  private constructor(
    public readonly resource: XdgToplevelResource,
    public readonly xdgSurface: XdgSurface,
    private readonly session: Session,
    public readonly userSurface: CompositorSurface,
    public readonly view: View,
  ) {}

  requestActive(): boolean {
    if (this.userSurfaceState.active) {
      return true
    }
    if (this.configureState.state.includes(activated)) {
      this.userSurfaceState = { ...this.userSurfaceState, active: true }
      this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
    } else {
      const newState = this.configureState.state.slice()
      newState.push(activated)
      this.emitConfigure(this.resource, this.configureState.width, this.configureState.height, newState, none)
      this.session.flush()
    }
    return true
  }

  notifyInactive(): void {
    if (!this.userSurfaceState.active) {
      return
    }
    if (this.configureState.state.includes(activated)) {
      const newState = this.configureState.state.slice()
      const idx = newState.indexOf(activated)
      newState.splice(idx, 1)
      this.emitConfigure(this.resource, this.configureState.width, this.configureState.height, newState, none)
      this.userSurfaceState = { ...this.userSurfaceState, active: false }
      this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
      this.session.flush()
    }
  }

  private commitRoleState(): void {
    this.minSize = this.pendingMinSize
    this.maxSize = this.pendingMaxSize

    const { x: minWidth, y: minHeight } = this.pendingMinSize
    let { x: maxWidth, y: maxHeight } = this.pendingMaxSize
    maxWidth = maxWidth === 0 ? Number.MAX_SAFE_INTEGER : maxWidth
    maxHeight = maxHeight === 0 ? Number.MAX_SAFE_INTEGER : maxHeight

    if (minWidth < 0 || minHeight < 0 || minWidth > maxWidth || minHeight > maxHeight) {
      this.resource.postError(XdgWmBaseError.invalidSurfaceState, 'Min size can not be greater than max size.')
      this.session.logger.warn('[client-protocol-error] Min size can not be greater than max size.')
      return
    }
    if (maxWidth < 0 || maxHeight < 0 || maxWidth < minWidth || maxHeight < minHeight) {
      this.resource.postError(XdgWmBaseError.invalidSurfaceState, 'Max size can not be me smaller than min size.')
      this.session.logger.warn('[client-protocol-error] Max size can not be less than min size.')
      return
    }

    this.minSize = { x: minWidth, y: minHeight }
    this.maxSize = { x: maxWidth, y: maxHeight }

    if (this.ackedConfigureState.state.includes(activated) && !this.configureState.state.includes(activated)) {
      this.userSurfaceState = { ...this.userSurfaceState, active: true }
      this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
    }

    this.configureState = this.ackedConfigureState
  }

  /**
   * Called during commit
   */
  onCommit(surface: Surface): void {
    this.previousWindowGeometry = this.xdgSurface.windowGeometry
    surface.commitPending()
    this.xdgSurface.commitWindowGeometry()
    this.commitRoleState()

    if (surface.state.bufferContents) {
      if (!this.mapped) {
        this.map()
      }
      if (this.configureState.state.includes(resizing)) {
        this.resizingCommit()
      } else if (this.configureState.state.includes(maximized)) {
        this.maximizedCommit()
      } else if (this.configureState.state.includes(fullscreen)) {
        this.fullscreenCommit(surface, surface.state.bufferContents.size)
      } else {
        this.normalCommit()
      }
    } else if (this.mapped) {
      this.unmap()
    }

    surface.session.renderer.render()
  }

  /**
   * Called during commit
   */
  private map(): void {
    this.mapped = true
    this.userSurfaceState = { ...this.userSurfaceState, mapped: true }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  /**
   * Called during commit
   */
  private unmap() {
    this.mapped = false
    this.configureState = { serial: 0, state: [], width: 0, height: 0, resizeEdge: 0 }
    this.userSurfaceState = { ...this.userSurfaceState, mapped: false }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  /**
   * Called during commit
   */
  private resizingCommit() {
    const { x1: newX1, y1: newY1 } = this.xdgSurface.windowGeometry
    const { x1: oldX1, y1: oldY1 } = this.previousWindowGeometry

    let dx = 0
    let dy = 0
    const edges = this.configureState.resizeEdge
    switch (edges) {
      case topRight:
      case top: {
        dy = oldY1 - newY1
        break
      }
      case bottomLeft:
      case left: {
        dx = oldX1 - newX1
        break
      }
      case topLeft: {
        dx = oldX1 - newX1
        dy = oldY1 - newY1
        break
      }
      default: {
        break
      }
    }

    this.view.positionOffset = plusPoint(this.view.positionOffset, { x: dx, y: dy })
  }

  private maximizedCommit() {
    const { width: newSurfaceWidth, height: newSurfaceHeight } = this.xdgSurface.windowGeometry.size

    if (newSurfaceWidth !== this.ackedConfigureState.width || newSurfaceHeight !== this.ackedConfigureState.height) {
      this.resource.postError(XdgWmBaseError.invalidSurfaceState, 'Surface size does not match configure event.')
      this.session.logger.warn('[client-protocol-error] Surface size does not match configure event.')
      return
    }

    // FIXME take view to scene space conversion into account
    const clientTopLeftOnScreen = this.view.surfaceToViewSpace(this.xdgSurface.windowGeometry.position)
    if (this.view.parent) {
      // FIXME listen to parent position and update our own position
      this.view.positionOffset = minusPoint(
        { x: -clientTopLeftOnScreen.x, y: -clientTopLeftOnScreen.y },
        this.view.parent.positionOffset,
      )
    } else {
      this.view.positionOffset = { x: -clientTopLeftOnScreen.x, y: -clientTopLeftOnScreen.y }
    }
  }

  /**
   * Called during commit
   */
  private fullscreenCommit(surface: Surface, bufferSize: SizeRO) {
    const { x: newSurfaceWidth, y: newSurfaceHeight } = surface.toSurfaceSpace({
      x: bufferSize.width,
      y: bufferSize.height,
    })
    if (newSurfaceWidth > this.configureState.width || newSurfaceHeight > this.configureState.height) {
      this.resource.postError(XdgWmBaseError.invalidSurfaceState, 'Surface size does not match configure event.')
      this.session.logger.warn('[client protocol error] Surface size does not match configure event.')
      return
    }

    const x = (window.innerWidth - newSurfaceWidth) / 2
    const y = (window.innerHeight - newSurfaceHeight) / 2

    this.view.positionOffset = { x, y }
    // TODO use api to nofity user shell browser should be made fullscreen
  }

  ackConfigure(serial: number): void {
    this.pendingConfigureStates = this.pendingConfigureStates.filter((pendingConfigureState) => {
      if (pendingConfigureState.serial < serial) {
        return false
      } else if (pendingConfigureState.serial === serial) {
        this.ackedConfigureState = pendingConfigureState
        return false
      }
      return true
    })
  }

  destroy(resource: XdgToplevelResource): void {
    this.unmap()
    resource.destroy()
  }

  setParent(resource: XdgToplevelResource, parent: XdgToplevelResource | undefined): void {
    if (this.parent) {
      const oldParentXdgToplevel = this.parent.implementation as XdgToplevel
      const oldParentSurface = oldParentXdgToplevel.xdgSurface.wlSurfaceResource.implementation as Surface
      const surface = this.xdgSurface.wlSurfaceResource.implementation as Surface
      oldParentSurface.removeChild(surface.surfaceChildSelf)
    }

    if (parent) {
      const parentXdgToplevel = parent.implementation as XdgToplevel
      const parentSurface = parentXdgToplevel.xdgSurface.wlSurfaceResource.implementation as Surface
      const surface = this.xdgSurface.wlSurfaceResource.implementation as Surface
      parentSurface.addChild(surface.surfaceChildSelf)
    }

    this.parent = parent
  }

  setTitle(resource: XdgToplevelResource, title: string): void {
    this.userSurfaceState = { ...this.userSurfaceState, title }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  setAppId(resource: XdgToplevelResource, appId: string): void {
    this.userSurfaceState = { ...this.userSurfaceState, appId }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  showWindowMenu(
    resource: XdgToplevelResource,
    wlSeatResource: WlSeatResource,
    serial: number,
    x: number,
    y: number,
  ): void {
    // const seat = wlSeatResource.implementation as Seat
    // this.showWindowMenuAt(Point.create(x, y))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // private showWindowMenuAt(point: Point) {
  //   // TODO
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  move(resource: XdgToplevelResource, wlSeatResource: WlSeatResource, serial: number): void {
    if (this.configureState.state.includes(fullscreen) || this.configureState.state.includes(maximized)) {
      return
    }

    const seat = wlSeatResource.implementation as Seat
    const pointer = seat.pointer

    const pointerX = pointer.x
    const pointerY = pointer.y

    const origPosition = this.view.positionOffset

    const moveListener = () => {
      if (!this.mapped) {
        pointer.removeMouseMoveListener(moveListener)
        return
      }

      const deltaX = pointer.x - pointerX
      const deltaY = pointer.y - pointerY

      this.view.positionOffset = { x: origPosition.x + deltaX, y: origPosition.y + deltaY }
      this.session.renderer.render()
    }

    pointer.onButtonRelease().then(() => {
      pointer.enableFocus()
      pointer.removeMouseMoveListener(moveListener)
      pointer.setDefaultCursor()
    })

    pointer.disableFocus()
    pointer.addMouseMoveListener(moveListener)
    window.document.body.style.cursor = 'move'
  }

  resize(resource: XdgToplevelResource, wlSeatResource: WlSeatResource, serial: number, edges: number): void {
    if (this.configureState.state.includes(fullscreen) || this.configureState.state.includes(maximized)) {
      return
    }

    const seat = wlSeatResource.implementation as Seat
    const pointer = seat.pointer

    // assigned in switch statement
    let sizeAdjustment: (deltaX: number, deltaY: number) => { w: number; h: number }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const {
      size: { width: windowGeometryWidth, height: windowGeometryHeight },
    } = this.xdgSurface.windowGeometry

    switch (edges) {
      case bottomRight: {
        setCursor('nwse-resize')
        sizeAdjustment = (deltaX, deltaY) => ({
          w: windowGeometryWidth + deltaX,
          h: windowGeometryHeight + deltaY,
        })
        break
      }
      case top: {
        setCursor('ns-resize')
        sizeAdjustment = (deltaX, deltaY) => ({
          w: windowGeometryWidth,
          h: windowGeometryHeight - deltaY,
        })
        break
      }
      case bottom: {
        setCursor('ns-resize')
        sizeAdjustment = (deltaX, deltaY) => {
          return { w: windowGeometryWidth, h: windowGeometryHeight + deltaY }
        }
        break
      }
      case left: {
        setCursor('ew-resize')
        sizeAdjustment = (deltaX) => {
          return { w: windowGeometryWidth - deltaX, h: windowGeometryHeight }
        }
        break
      }
      case topLeft: {
        setCursor('nwse-resize')
        sizeAdjustment = (deltaX, deltaY) => {
          return { w: windowGeometryWidth - deltaX, h: windowGeometryHeight - deltaY }
        }
        break
      }
      case bottomLeft: {
        setCursor('nesw-resize')
        sizeAdjustment = (deltaX, deltaY) => {
          return { w: windowGeometryWidth - deltaX, h: windowGeometryHeight + deltaY }
        }
        break
      }
      case right: {
        setCursor('ew-resize')
        sizeAdjustment = (deltaX) => {
          return { w: windowGeometryWidth + deltaX, h: windowGeometryHeight }
        }
        break
      }
      case topRight: {
        setCursor('nesw-resize')
        sizeAdjustment = (deltaX, deltaY) => {
          return { w: windowGeometryWidth + deltaX, h: windowGeometryHeight - deltaY }
        }
        break
      }
      case none:
      default: {
        pointer.setDefaultCursor()
        sizeAdjustment = () => {
          return { w: windowGeometryWidth, h: windowGeometryHeight }
        }
        break
      }
    }

    const sizeCalculation = () => {
      const pointerDeltaX = pointer.x - pointerX
      const pointerDeltaY = pointer.y - pointerY

      const size = sizeAdjustment(pointerDeltaX, pointerDeltaY)
      const width = Math.max(this.minSize.x, Math.min(size.w, this.maxSize.x))
      const height = Math.max(this.minSize.y, Math.min(size.h, this.maxSize.y))

      return { width, height }
    }

    const resizeListener = () => {
      if (!this.mapped) {
        pointer.removeMouseMoveListener(resizeListener)
        return
      }

      const { width: width, height: height } = sizeCalculation()
      this.emitConfigure(resource, width, height, [activated, resizing], edges)
      this.session.flush()
    }

    pointer.onButtonRelease().then(() => {
      pointer.removeMouseMoveListener(resizeListener)
      pointer.setDefaultCursor()
      pointer.enableFocus()

      const { width: width, height: height } = sizeCalculation()
      this.emitConfigure(resource, width, height, [activated], none)
      this.session.flush()
    })

    pointer.disableFocus()
    pointer.addMouseMoveListener(resizeListener)
  }

  private emitConfigure(
    resource: XdgToplevelResource,
    width: number,
    height: number,
    states: number[],
    resizeEdge: number,
  ) {
    resource.configure(width, height, Uint32Array.from(states))
    this.xdgSurface.emitConfigureDone()
    this.pendingConfigureStates.push({
      serial: this.xdgSurface.configureSerial,
      state: states,
      width: width,
      height: height,
      resizeEdge: resizeEdge,
    })
  }

  setMaxSize(resource: XdgToplevelResource, width: number, height: number): void {
    this.pendingMaxSize = { x: width, y: height }
  }

  setMinSize(resource: XdgToplevelResource, width: number, height: number): void {
    this.pendingMinSize = { x: width, y: height }
  }

  setMaximized(resource: XdgToplevelResource): void {
    if (this.configureState.state.includes(resizing) || this.configureState.state.includes(fullscreen)) {
      return
    }
    const scene = this.view.relevantScene
    if (scene) {
      this.saveStateAndPosition()
      // FIXME get proper size in surface coordinates instead of assume surface space === global space
      const maxWidth = scene.canvas.width
      const maxHeight = scene.canvas.height
      const states = this.userSurfaceState.active ? [maximized, activated] : [maximized]
      this.emitConfigure(resource, maxWidth, maxHeight, states, none)
    }
  }

  unsetMaximized(resource: XdgToplevelResource): void {
    if (this.configureState.state.includes(maximized)) {
      if (this.savedConfigureState) {
        const newState = this.savedConfigureState.state.filter((state) => state !== XdgToplevelState.maximized)
        this.emitConfigure(resource, this.savedConfigureState.width, this.savedConfigureState.height, newState, none)
      } else {
        this.emitConfigure(resource, this.configureState.width, this.configureState.height, [], none)
      }
    }
  }

  private saveStateAndPosition() {
    if (this.savedConfigureState === undefined) {
      this.savedConfigureState = this.configureState
    }
    if (this.savedViewPositionOffset === undefined) {
      this.savedViewPositionOffset = this.view.positionOffset
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFullscreen(resource: XdgToplevelResource, output: WlOutputResource | undefined): void {
    this.saveStateAndPosition()
    const states = this.userSurfaceState.active ? [fullscreen, activated] : [fullscreen]
    this.emitConfigure(resource, window.innerWidth, window.innerHeight, states, none)
  }

  unsetFullscreen(resource: XdgToplevelResource): void {
    if (this.configureState.state.includes(fullscreen)) {
      if (this.savedConfigureState) {
        const newState = this.savedConfigureState.state.filter((state) => state !== XdgToplevelState.fullscreen)
        this.emitConfigure(resource, this.savedConfigureState.width, this.savedConfigureState.height, newState, none)
      } else {
        this.emitConfigure(resource, this.configureState.width, this.configureState.height, [], none)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMinimized(resource: XdgToplevelResource): void {
    this.userSurfaceState = { ...this.userSurfaceState, minimized: true }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  private normalCommit() {
    if (this.savedConfigureState) {
      this.savedConfigureState = undefined
    }
    if (this.savedViewPositionOffset) {
      this.view.positionOffset = this.savedViewPositionOffset
      this.savedViewPositionOffset = undefined
    }
  }
}
