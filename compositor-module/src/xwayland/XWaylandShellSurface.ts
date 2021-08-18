import { WlShellSurfaceResize } from 'westfield-runtime-server'
import { CompositorSurface, CompositorSurfaceState } from '../index'
import Point from '../math/Point'
import Output from '../Output'
import Pointer from '../Pointer'
import Scene from '../render/Scene'
import Session from '../Session'
import Surface from '../Surface'
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
  static create(session: Session, window: XWindow, surface: Surface) {
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

    const xWaylandShellSurface = new XWaylandShellSurface(session, window, surface, userSurface, userSurfaceState)
    surface.role = xWaylandShellSurface
    return xWaylandShellSurface
  }

  private mapped = false
  private managed = false
  private pendingPositionOffset: Point | undefined = undefined

  state?: typeof SurfaceStates[keyof typeof SurfaceStates]
  sendConfigure?: (width: number, height: number) => void
  sendPosition?: (x: number, y: number) => void

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
    private readonly session: Session,
    private readonly window: XWindow,
    private readonly surface: Surface,
    readonly userSurface: CompositorSurface,
    private userSurfaceState: CompositorSurfaceState,
  ) {}

  private ensureUserShellSurface() {
    if (!this.managed) {
      this.managed = true
      this.surface.resource.onDestroy().then(() => this.session.userShell.events.destroyUserSurface?.(this.userSurface))
      this.session.userShell.events.createUserSurface?.(this.userSurface, this.userSurfaceState)
    }
  }

  onCommit(surface: Surface): void {
    surface.commitPending()

    const oldPosition = surface.surfaceChildSelf.position
    surface.surfaceChildSelf.position = Point.create(
      oldPosition.x + surface.pendingState.dx,
      oldPosition.y + surface.pendingState.dy,
    )

    if (surface.pendingState.bufferContents) {
      if (!this.mapped) {
        this.map()
      }
    } else {
      if (this.mapped) {
        this.unmap()
      }
    }

    surface.renderViews((view) => {
      if (this.pendingPositionOffset) {
        view.positionOffset = this.pendingPositionOffset
        this.pendingPositionOffset = undefined
      }
      if (view.mapped && view.surface.state.buffer) {
        this.prepareFrameDecoration(view)
      }
    })
  }

  private prepareFrameDecoration(view: View) {
    // render frame decoration
    if (this.window.decorate && this.window.frame) {
      const { w: frameWidth, h: frameHeight } = view.renderState.size
      const {
        width: interiorWidth,
        height: interorHeight,
        x: interiorX,
        y: interiorY,
      } = this.window.frame.repaint(frameWidth, frameHeight)
      const renderContext = this.window.frame.renderContext

      const top = renderContext.getImageData(interiorX, 0, interiorWidth, interiorY)
      const bottom = renderContext.getImageData(
        interiorX,
        interiorY + interorHeight,
        interiorWidth,
        frameHeight - (interiorY + interorHeight),
      )
      const left = renderContext.getImageData(0, 0, interiorX, frameHeight)
      const right = renderContext.getImageData(
        interiorX + interiorWidth,
        0,
        frameWidth - (interiorX + interiorWidth),
        frameHeight,
      )

      const { gl, texture, format } = view.renderState.texture
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, interiorX, 0, format, gl.UNSIGNED_BYTE, top)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, interiorX, interiorY + interorHeight, format, gl.UNSIGNED_BYTE, bottom)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, format, gl.UNSIGNED_BYTE, left)
      gl.texSubImage2D(gl.TEXTURE_2D, 0, interiorX + interiorWidth, 0, format, gl.UNSIGNED_BYTE, right)
      gl.bindTexture(gl.TEXTURE_2D, null)
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

  setToplevel(): void {
    if (this.state === SurfaceStates.TRANSIENT) {
      return
    }

    this.ensureUserShellSurface()
    this.state = SurfaceStates.TOP_LEVEL
  }

  setToplevelWithPosition(x: number, y: number): void {
    if (this.state === SurfaceStates.TRANSIENT) {
      return
    }

    this.ensureUserShellSurface()
    this.state = SurfaceStates.TOP_LEVEL

    // TODO store position?
  }

  setParent(parent: Surface): void {
    // TODO set parent?
  }

  setTransient(parent: Surface, x: number, y: number): void {
    if (this.state === SurfaceStates.TOP_LEVEL) {
      return
    }

    const parentPosition = parent.surfaceChildSelf.position

    const surfaceChild = this.surface.surfaceChildSelf
    // FIXME we probably want to provide a method to translate from (abstract) surface space to global space
    surfaceChild.position = Point.create(parentPosition.x + x, parentPosition.y + y)
    parent.addChild(surfaceChild)

    // this.ensureUserShellSurface()
    this.state = SurfaceStates.TRANSIENT
  }

  setFullscreen(output?: Output): void {
    this.state = SurfaceStates.FULLSCREEN
    // TODO get proper size in surface coordinates instead of assume surface space === global space
    this.surface.surfaceChildSelf.position = Point.create(0, 0)
    this.sendConfigure?.(window.innerWidth, window.innerHeight)
  }

  setXwayland(x: number, y: number): void {
    this.xwayland.x = x
    this.xwayland.y = y
    const view = this.xwayland.isSet
      ? this.surface.view
      : // FIXME this is obviously going to break once we have deal with multiple scenes. We need to refactor to a common compositor space accross all scenes.
        this.surface.createTopLevelView(Object.values(this.session.renderer.scenes)[0])
    if (view) {
      this.xwayland.isSet = true
      view.positionOffset = Point.create(x, y)
    }
  }

  private findTopLevelView(scene: Scene): View | undefined {
    return scene.topLevelViews.find((topLevelView) => topLevelView.surface === this.surface)
  }

  move(pointer: Pointer): void {
    // if (!seat.isValidInputSerial(serial)) {
    //   // window.GREENFIELD_DEBUG && console.log('[client-protocol-warning] - Move serial mismatch. Ignoring.')
    //   return
    // }

    if (this.state === SurfaceStates.FULLSCREEN || this.state === SurfaceStates.MAXIMIZED) {
      return
    }

    const pointerX = pointer.x
    const pointerY = pointer.y
    const scene = pointer.scene
    if (scene) {
      // FIXME Only move that view that was last interacted with instead of finding the first one that matches.
      const topLevelView = this.findTopLevelView(scene)
      if (topLevelView) {
        const origPosition = topLevelView.positionOffset

        const moveListener = () => {
          const deltaX = pointer.x - pointerX
          const deltaY = pointer.y - pointerY

          topLevelView.positionOffset = Point.create(origPosition.x + deltaX, origPosition.y + deltaY)
          topLevelView.applyTransformations()
          topLevelView.renderState.scene.render()
        }

        pointer.onButtonRelease().then(() => {
          pointer.removeMouseMoveListener(moveListener)
          pointer.enableFocus()
        })
        pointer.disableFocus()
        pointer.addMouseMoveListener(moveListener)
      }
    }
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
    const scene = pointer.scene
    const topLevelView = scene ? this.findTopLevelView(scene) : undefined
    const origPosition = topLevelView ? topLevelView.positionOffset : undefined

    if (surfaceWidth && surfaceHeight) {
      const resizeListener = () => {
        const deltaX = pointer.x - pointerX
        const deltaY = pointer.y - pointerY

        const { dx, dy, w, h } = sizeAdjustment(surfaceWidth, surfaceHeight, deltaX, deltaY)
        this.sendConfigure?.(w, h)

        if (topLevelView && origPosition) {
          this.pendingPositionOffset = Point.create(origPosition.x + dx, origPosition.y + dy)
        }
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
    const scene = this.session.globals.seat.pointer.scene

    if (scene) {
      const width = scene.canvas.width
      const height = scene.canvas.height

      if (this.surface.view) {
        this.surface.view.positionOffset = Point.create(0, 0)
      }
      this.sendConfigure?.(width, height)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPid(pid: number): void {}

  requestActive(): void {
    if (this.userSurfaceState.active) {
      return
    }
    this.userSurfaceState = { ...this.userSurfaceState, active: true }
    this.window.activate(this.surface)
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }

  notifyInactive(): void {
    if (!this.userSurfaceState.active) {
      return
    }
    this.userSurfaceState = { ...this.userSurfaceState, active: false }
    this.window.activate(undefined)
    this.session.userShell.events.updateUserSurface?.(this.userSurface, this.userSurfaceState)
  }
}
