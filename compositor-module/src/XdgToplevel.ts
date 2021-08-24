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
import Mat4 from './math/Mat4'
import Point from './math/Point'
import Rect from './math/Rect'
import Seat from './Seat'
import Session from './Session'
import Size from './Size'
import Surface from './Surface'
import { makeSurfaceActive } from './UserShellApi'
import { UserShellSurfaceRole } from './UserShellSurfaceRole'
import View from './View'
import XdgSurface from './XdgSurface'

const { none, bottom, bottomLeft, bottomRight, left, right, top, topLeft, topRight } = XdgToplevelResizeEdge
const { fullscreen, activated, maximized, resizing } = XdgToplevelState

interface ConfigureState {
  serial: number
  state: number[]
  width: number
  height: number
  resizeEdge: number
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
  private pendingMaxSize: Point = Point.create(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
  private maxSize: Point = Point.create(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
  private pendingMinSize: Point = Point.create(0, 0)
  private minSize: Point = Point.create(0, 0)
  private pendingConfigureStates: ConfigureState[] = []
  private unfullscreenConfigureState?: ConfigureState
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
  private previousWindowGeometry: Rect = Rect.create(0, 0, 0, 0)
  private previousGeometry?: Rect

  private constructor(
    public readonly resource: XdgToplevelResource,
    public readonly xdgSurface: XdgSurface,
    private readonly session: Session,
    public readonly userSurface: CompositorSurface,
    public readonly view: View,
  ) {}

  requestActive(): void {
    if (this.userSurfaceState.active) {
      return
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
      console.log('[client-protocol-error] Min size can not be greater than max size.')
      return
    }
    if (maxWidth < 0 || maxHeight < 0 || maxWidth < minWidth || maxHeight < minHeight) {
      this.resource.postError(XdgWmBaseError.invalidSurfaceState, 'Max size can not be me smaller than min size.')
      console.log('[client-protocol-error] Max size can not be less than min size.')
      return
    }

    this.minSize = Point.create(minWidth, minHeight)
    this.maxSize = Point.create(maxWidth, maxHeight)

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
        this.resizingCommit(surface)
      } else if (this.configureState.state.includes(maximized)) {
        this.maximizedCommit(surface)
      } else if (this.configureState.state.includes(fullscreen)) {
        this.fullscreenCommit(surface)
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
  private resizingCommit(surface: Surface) {
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

    this.view.positionOffset = this.view.positionOffset.plus(Point.create(dx, dy))
  }

  private maximizedCommit(surface: Surface) {
    const { w: newSurfaceWidth, h: newSurfaceHeight } = this.xdgSurface.windowGeometry.size

    if (newSurfaceWidth !== this.ackedConfigureState.width || newSurfaceHeight !== this.ackedConfigureState.height) {
      this.resource.postError(XdgWmBaseError.invalidSurfaceState, 'Surface size does not match configure event.')
      console.log('[client-protocol-error] Surface size does not match configure event.')
      return
    }

    if (!this.previousGeometry) {
      this.storePreviousGeometry()
    }
    if (this.unfullscreenConfigureState) {
      this.unfullscreenConfigureState = undefined
    }
    const windowGeoPositionOffset = this.xdgSurface.windowGeometry.position

    const viewPositionOffset = this.view.toViewSpaceFromSurface(windowGeoPositionOffset)
    this.view.customTransformation = Mat4.translation(0 - viewPositionOffset.x, 0 - viewPositionOffset.y)
  }

  /**
   * Called during commit
   */
  private fullscreenCommit(surface: Surface) {
    if (surface.state.bufferContents) {
      const bufferSize = surface.state.bufferContents.size
      const { x: newSurfaceWidth, y: newSurfaceHeight } = surface.toSurfaceSpace(
        Point.create(bufferSize.w, bufferSize.h),
      )
      if (newSurfaceWidth > this.configureState.width || newSurfaceHeight > this.configureState.height) {
        this.resource.postError(XdgWmBaseError.invalidSurfaceState, 'Surface size does not match configure event.')
        console.log('[client protocol error] Surface size does not match configure event.')
        return
      }

      if (!this.unfullscreenConfigureState) {
        this.unfullscreenConfigureState = this.configureState
      }
      if (!this.previousGeometry) {
        this.storePreviousGeometry()
      }

      const x = (window.innerWidth - newSurfaceWidth) / 2
      const y = (window.innerHeight - newSurfaceHeight) / 2

      surface.surfaceChildSelf.position = Point.create(x, y)
    }
    // TODO use api to nofity user shell scene canvas should be made fullscreen
  }

  /**
   * Called during commit
   */
  private normalCommit() {
    if (this.previousGeometry) {
      // restore position (we came from a fullscreen or maximize and must restore the position)
      this.view.customTransformation = undefined
      this.previousGeometry = undefined
    }
    if (this.unfullscreenConfigureState) {
      this.unfullscreenConfigureState = undefined
    }
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

  private storePreviousGeometry() {
    this.previousGeometry = this.xdgSurface.windowGeometry
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
    // Most clients don't do this correctly. So ignore this.
    // if (!seat.isValidInputSerial(serial)) {
    //   console.log('[client-protocol-warning] - showWindowMenu serial mismatch. Ignoring.')
    //   return
    // }
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
    // Most clients don't do this correctly. So ignore this.
    // if (!seat.isValidInputSerial(serial)) {
    //   // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Move serial mismatch. Ignoring.')
    //   return
    // }

    const pointer = seat.pointer

    const pointerX = pointer.x
    const pointerY = pointer.y

    // FIXME Only move that view that was last interacted with instead of finding the first one that matches.
    const topLevelView = this.view
    if (topLevelView) {
      const origPosition = topLevelView.positionOffset

      const moveListener = () => {
        if (!this.mapped) {
          pointer.removeMouseMoveListener(moveListener)
          return
        }

        const deltaX = pointer.x - pointerX
        const deltaY = pointer.y - pointerY

        topLevelView.positionOffset = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)
        topLevelView.applyTransformations()
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
  }

  resize(resource: XdgToplevelResource, wlSeatResource: WlSeatResource, serial: number, edges: number): void {
    if (this.configureState.state.includes(fullscreen) || this.configureState.state.includes(maximized)) {
      return
    }

    const seat = wlSeatResource.implementation as Seat
    const pointer = seat.pointer

    // Most clients don't do this correctly. So ignore this.
    // if (!seat.isValidInputSerial(serial)) {
    // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Resize serial mismatch. Ignoring.')
    // return
    // }

    // assigned in switch statement
    let sizeAdjustment: (deltaX: number, deltaY: number) => { w: number; h: number }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const { width: windowGeometryWidth, height: windowGeometryHeight } = this.xdgSurface.windowGeometry

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

      return Size.create(width, height)
    }

    const resizeListener = () => {
      if (!this.mapped) {
        pointer.removeMouseMoveListener(resizeListener)
        return
      }

      const { w: width, h: height } = sizeCalculation()
      this.emitConfigure(resource, width, height, [activated, resizing], edges)
      this.session.flush()
    }

    pointer.onButtonRelease().then(() => {
      pointer.removeMouseMoveListener(resizeListener)
      pointer.setDefaultCursor()
      pointer.enableFocus()

      const { w: width, h: height } = sizeCalculation()
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
    this.pendingMaxSize = Point.create(width, height)
  }

  setMinSize(resource: XdgToplevelResource, width: number, height: number): void {
    this.pendingMinSize = Point.create(width, height)
  }

  setMaximized(resource: XdgToplevelResource): void {
    if (this.configureState.state.includes(resizing)) {
      return
    }
    const scene = this.view.relevantScene

    if (scene) {
      // FIXME get proper size in surface coordinates instead of assume surface space === global space
      const maxWidth = scene.canvas.width
      const maxHeight = scene.canvas.height

      if (this.configureState.state.includes(fullscreen)) {
        this.unfullscreenConfigureState = {
          state: [maximized, activated],
          width: maxWidth,
          height: maxHeight,
          serial: 0,
          resizeEdge: 0,
        }
      } else {
        this.emitConfigure(resource, maxWidth, maxHeight, [maximized, activated], none)
      }
    }
  }

  unsetMaximized(resource: XdgToplevelResource): void {
    if (this.configureState.state.includes(resizing)) {
      return
    }

    if (this.configureState.state.includes(fullscreen) && this.previousGeometry) {
      this.unfullscreenConfigureState = {
        state: [activated],
        width: this.previousGeometry.width,
        height: this.previousGeometry.height,
        serial: 0,
        resizeEdge: 0,
      }
    } else if (this.configureState.state.includes(maximized) && this.previousGeometry) {
      this.emitConfigure(resource, this.previousGeometry.width, this.previousGeometry.height, [activated], none)
    } else {
      this.emitConfigure(resource, 0, 0, [activated], none)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFullscreen(resource: XdgToplevelResource, output: WlOutputResource | undefined): void {
    this.emitConfigure(resource, window.innerWidth, window.innerHeight, [fullscreen, activated], none)
  }

  unsetFullscreen(resource: XdgToplevelResource): void {
    if (this.configureState.state.includes(fullscreen)) {
      if (this.unfullscreenConfigureState) {
        this.emitConfigure(
          resource,
          this.unfullscreenConfigureState.width,
          this.unfullscreenConfigureState.height,
          this.unfullscreenConfigureState.state,
          none,
        )
      } else if (this.previousGeometry) {
        this.emitConfigure(resource, this.previousGeometry.width, this.previousGeometry.height, [activated], none)
      } else {
        this.emitConfigure(resource, 0, 0, [activated], none)
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMinimized(resource: XdgToplevelResource): void {
    this.userSurfaceState = { ...this.userSurfaceState, minimized: true }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }
}
