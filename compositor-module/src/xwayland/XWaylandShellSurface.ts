import { WlShellSurfaceResize } from 'westfield-runtime-server'
import { CompositorSurface, CompositorSurfaceState } from '../index'
import { PointRO } from '../math/Point'
import Output from '../Output'
import Pointer from '../Pointer'
import Session from '../Session'
import Surface from '../Surface'
import { makeSurfaceActive } from '../UserShellApi'
import { UserShellSurfaceRole } from '../UserShellSurfaceRole'
import View from '../View'
import { XWindow } from './XWindow'

const { bottom, bottomLeft, bottomRight, left, none, right, top, topLeft, topRight } = WlShellSurfaceResize

const SurfaceStates = {
  MAXIMIZED: 'maximized',
  FULLSCREEN: 'fullscreen',
  TRANSIENT: 'transient',
  TOP_LEVEL: 'top_level',
} as const

export default class XWaylandShellSurface implements UserShellSurfaceRole {
  static create(session: Session, window: XWindow, surface: Surface): XWaylandShellSurface {
    const { client, id } = surface.resource
    const userSurface: CompositorSurface = { id: `${id}`, clientId: client.id }
    const userSurfaceState: CompositorSurfaceState = {
      appId: '',
      active: false,
      mapped: false,
      minimized: false,
      title: '',
      unresponsive: false,
    }

    const view = View.create(surface)
    const xWaylandShellSurface = new XWaylandShellSurface(session, window, surface, userSurface, userSurfaceState, view)
    surface.role = xWaylandShellSurface
    view.transformationUpdatedListeners = [
      ...view.transformationUpdatedListeners,
      () => {
        const { x, y } = view.positionOffset
        xWaylandShellSurface.sendPosition?.(x, y)
      },
    ]
    view.prepareRender = (renderState) => {
      if (xWaylandShellSurface.frameDecoration) {
        const { top, left, right, bottom, interiorWidth, interiorY, interiorX, interiorHeight } =
          xWaylandShellSurface.frameDecoration
        const { gl, texture, format } = renderState.texture
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texSubImage2D(gl.TEXTURE_2D, 0, interiorX, 0, format, gl.UNSIGNED_BYTE, top)
        gl.texSubImage2D(gl.TEXTURE_2D, 0, interiorX, interiorY + interiorHeight, format, gl.UNSIGNED_BYTE, bottom)
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, format, gl.UNSIGNED_BYTE, left)
        gl.texSubImage2D(gl.TEXTURE_2D, 0, interiorX + interiorWidth, 0, format, gl.UNSIGNED_BYTE, right)
        gl.bindTexture(gl.TEXTURE_2D, null)
      }
    }
    return xWaylandShellSurface
  }

  state?: typeof SurfaceStates[keyof typeof SurfaceStates]
  sendConfigure?: (width: number, height: number) => void
  sendPosition?: (x: number, y: number) => void
  frameDecoration?: {
    top: ImageData
    bottom: ImageData
    left: ImageData
    right: ImageData
    interiorWidth: number
    interiorHeight: number
    interiorX: number
    interiorY: number
  }
  private mapped = false
  private managed = false
  private pendingPositionOffset?: PointRO
  private xwayland = {
    x: 0,
    y: 0,
    isSet: false,
  }
  private windowGeometry = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  constructor(
    readonly session: Session,
    readonly window: XWindow,
    readonly surface: Surface,
    readonly userSurface: CompositorSurface,
    private userSurfaceState: CompositorSurfaceState,
    public readonly view: View,
  ) {}

  onCommit(surface: Surface): void {
    surface.commitPending()

    const oldPosition = surface.surfaceChildSelf.position
    surface.surfaceChildSelf.position = {
      x: oldPosition.x + surface.pendingState.dx,
      y: oldPosition.y + surface.pendingState.dy,
    }

    if (surface.pendingState.bufferContents) {
      if (!this.mapped) {
        this.map()
      }
    } else {
      if (this.mapped) {
        this.unmap()
      }
    }
    if (this.pendingPositionOffset) {
      this.view.positionOffset = this.pendingPositionOffset
      this.pendingPositionOffset = undefined
    }

    if (this.mapped) {
      this.session.renderer.render(() => this.prepareFrameDecoration())
    } else {
      this.session.renderer.render()
    }
  }

  setToplevel(): void {
    if (this.state === SurfaceStates.TRANSIENT) {
      return
    }
    this.ensureToplevelView()
    this.ensureUserShellSurface()
    this.state = SurfaceStates.TOP_LEVEL
    // @ts-ignore
    makeSurfaceActive(this.surface)
    this.window.setToplevel()
  }

  setToplevelWithPosition(x: number, y: number): void {
    if (this.state === SurfaceStates.TRANSIENT) {
      return
    }
    this.ensureToplevelView()
    this.ensureUserShellSurface()
    this.state = SurfaceStates.TOP_LEVEL
    this.view.positionOffset = { x, y }
    // @ts-ignore
    makeSurfaceActive(this.surface)
  }

  setParent(parent: Surface): void {
    this.session.renderer.removeTopLevelView(this.view)
    this.view.parent?.surface.removeChild(this.surface.surfaceChildSelf)
    parent.addChild(this.surface.surfaceChildSelf)
  }

  setTransient(parent: Surface, x: number, y: number): void {
    if (this.state === SurfaceStates.TOP_LEVEL) {
      return
    }

    const parentPosition = parent.surfaceChildSelf.position

    const surfaceChild = this.surface.surfaceChildSelf
    // FIXME we probably want to provide a method to translate from (abstract) surface space to global space
    surfaceChild.position = { x: parentPosition.x + x, y: parentPosition.y + y }

    this.setParent(parent)
    this.state = SurfaceStates.TRANSIENT
  }

  setFullscreen(output?: Output): void {
    this.state = SurfaceStates.FULLSCREEN
    // TODO get proper size in surface coordinates instead of assume surface space === global space
    this.surface.surfaceChildSelf.position = { x: 0, y: 0 }
    this.sendConfigure?.(window.innerWidth, window.innerHeight)
  }

  private ensureToplevelView() {
    if (!this.session.renderer.hasTopLevelView(this.view)) {
      this.session.renderer.addTopLevelView(this.view)
    }
  }

  setXwayland(x: number, y: number): void {
    this.xwayland.x = x
    this.xwayland.y = y
    if (!this.xwayland.isSet) {
      this.ensureToplevelView()
    }
    this.xwayland.isSet = true
    this.view.positionOffset = { x, y }
  }

  move(pointer: Pointer): void {
    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }

    const pointerX = pointer.x
    const pointerY = pointer.y

    const origPosition = this.view.positionOffset

    const moveListener = () => {
      const deltaX = pointer.x - pointerX
      const deltaY = pointer.y - pointerY

      this.view.positionOffset = { x: origPosition.x + deltaX, y: origPosition.y + deltaY }
      this.surface.session.renderer.render()
    }

    pointer.onButtonRelease().then(() => {
      pointer.removeMouseMoveListener(moveListener)
      pointer.enableFocus()
    })
    pointer.disableFocus()
    pointer.addMouseMoveListener(moveListener)
  }

  resize(pointer: Pointer, edges: number): void {
    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }
    // assigned in switch statement
    let sizeAdjustment: (
      width: number,
      height: number,
      deltaX: number,
      deltaY: number,
    ) => { dx: number; dy: number; w: number; h: number }

    switch (edges) {
      case bottomRight: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({
          dx: 0,
          dy: 0,
          w: width + deltaX,
          h: height + deltaY,
        })
        break
      }
      case top: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({ dx: 0, dy: deltaY, w: width, h: height - deltaY })
        break
      }
      case bottom: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({ dx: 0, dy: 0, w: width, h: height + deltaY })
        break
      }
      case left: {
        sizeAdjustment = (width, height, deltaX) => ({ dx: deltaX, dy: 0, w: width - deltaX, h: height })
        break
      }
      case topLeft: {
        sizeAdjustment = (width, height, deltaX, deltaY) => {
          return {
            dx: deltaX,
            dy: deltaY,
            w: width - deltaX,
            h: height - deltaY,
          }
        }
        break
      }
      case bottomLeft: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({
          dx: deltaX,
          dy: 0,
          w: width - deltaX,
          h: height + deltaY,
        })
        break
      }
      case right: {
        sizeAdjustment = (width, height, deltaX) => ({ dx: 0, dy: 0, w: width + deltaX, h: height })
        break
      }
      case topRight: {
        sizeAdjustment = (width, height, deltaX, deltaY) => ({
          dx: 0,
          dy: deltaY,
          w: width + deltaX,
          h: height - deltaY,
        })
        break
      }
      case none:
      default: {
        sizeAdjustment = (width, height) => ({ dx: 0, dy: 0, w: width, h: height })
        break
      }
    }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const { width: surfaceWidth, height: surfaceHeight } = this.windowGeometry || {}
    const origPosition = this.view.positionOffset

    if (surfaceWidth && surfaceHeight) {
      const resizeListener = () => {
        const deltaX = pointer.x - pointerX
        const deltaY = pointer.y - pointerY

        const { dx, dy, w, h } = sizeAdjustment(surfaceWidth, surfaceHeight, deltaX, deltaY)
        this.sendConfigure?.(w, h)

        this.pendingPositionOffset = { x: origPosition.x + dx, y: origPosition.y + dy }
      }
      pointer.onButtonRelease().then(() => {
        pointer.removeMouseMoveListener(resizeListener)
        pointer.enableFocus()
      })
      pointer.disableFocus()
      pointer.addMouseMoveListener(resizeListener)
    }
  }

  setTitle(title: string): void {
    this.userSurfaceState = { ...this.userSurfaceState, title }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  setWindowGeometry(x: number, y: number, width: number, height: number): void {
    this.windowGeometry = { x, y, width, height }
  }

  setMaximized(): void {
    this.state = SurfaceStates.MAXIMIZED

    // FIXME get proper size in surface coordinates instead of assume surface space === global space
    const scene = this.view.relevantScene

    if (scene) {
      const width = scene.canvas.width
      const height = scene.canvas.height

      this.view.positionOffset = { x: -this.windowGeometry.x, y: -this.windowGeometry.y }
      this.sendConfigure?.(width, height)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPid(pid: number): void {}

  requestActive(): boolean {
    if (
      this.userSurfaceState.active ||
      this.xwayland.isSet ||
      this.state === 'fullscreen' ||
      this.state === 'transient'
    ) {
      return false
    }
    this.userSurfaceState = { ...this.userSurfaceState, active: true }
    this.window.updateActivateStatus(true)
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
    return true
  }

  notifyInactive(): void {
    if (!this.userSurfaceState.active || this.xwayland.isSet) {
      return
    }
    this.userSurfaceState = { ...this.userSurfaceState, active: false }
    this.window.updateActivateStatus(false)
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  private ensureUserShellSurface() {
    if (!this.managed) {
      this.managed = true
      this.surface.resource.onDestroy().then(() => this.session.userShell.events.destroyUserSurface?.(this.userSurface))
      this.session.userShell.events.createUserSurface?.(this.userSurface, this.userSurfaceState)
    }
  }

  private prepareFrameDecoration() {
    // render frame decoration
    const { width: frameWidth, height: frameHeight } = this.view.regionRect.size
    if (frameWidth === 0 || frameHeight === 0) {
      return
    }
    if (this.window.decorate && this.window.frame) {
      const {
        width: interiorWidth,
        height: interiorHeight,
        x: interiorX,
        y: interiorY,
      } = this.window.frame.repaint(frameWidth, frameHeight)
      const renderContext = this.window.frame.renderContext

      const top = renderContext.getImageData(interiorX, 0, interiorWidth, interiorY)
      const bottom = renderContext.getImageData(
        interiorX,
        interiorY + interiorHeight,
        interiorWidth,
        frameHeight - (interiorY + interiorHeight),
      )
      const left = renderContext.getImageData(0, 0, interiorX, frameHeight)
      const right = renderContext.getImageData(
        interiorX + interiorWidth,
        0,
        frameWidth - (interiorX + interiorWidth),
        frameHeight,
      )
      this.frameDecoration = {
        top,
        interiorX,
        interiorY,
        interiorWidth,
        interiorHeight,
        bottom,
        right,
        left,
      }
    } else {
      this.frameDecoration = undefined
    }
  }

  private map() {
    this.mapped = true
    this.userSurfaceState = { ...this.userSurfaceState, mapped: this.mapped }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  private unmap() {
    this.mapped = false
    this.userSurfaceState = { ...this.userSurfaceState, mapped: this.mapped }
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }
}
