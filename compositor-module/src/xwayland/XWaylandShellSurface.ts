import { Time } from 'xtsb'
import { DesktopSurface } from '../Desktop'
import { ORIGIN, Point } from '../math/Point'
import { createRect, RectWithInfo } from '../math/Rect'
import { Size, ZERO_SIZE } from '../math/Size'
import Output from '../Output'
import { Pointer } from '../Pointer'
import Session from '../Session'
import Surface from '../Surface'
import { DesktopSurfaceRole } from '../SurfaceRole'
import View from '../View'
import { XWindow } from './XWindow'

export enum SurfaceState {
  NONE,
  TOP_LEVEL,
  MAXIMIZED,
  FULLSCREEN,
  TRANSIENT,
  XWAYLAND,
}

export default class XWaylandShellSurface implements DesktopSurfaceRole {
  added = false
  pid = 0
  state = SurfaceState.NONE
  sendConfigure?: (size: Size) => void
  sendPosition?: (position: Point) => void
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
  desktopSurface: DesktopSurface
  private hasNextGeometry = false
  private nextGeometry?: RectWithInfo
  private committed = false

  constructor(
    readonly session: Session,
    readonly window: XWindow,
    readonly surface: Surface,
    public readonly view: View,
  ) {
    this.desktopSurface = DesktopSurface.create(this.surface, this)
  }

  static create(session: Session, window: XWindow, surface: Surface): XWaylandShellSurface {
    const view = View.create(surface)
    const xWaylandShellSurface = new XWaylandShellSurface(session, window, surface, view)
    surface.role = xWaylandShellSurface

    view.transformationUpdatedListeners = [
      ...view.transformationUpdatedListeners,
      () => {
        xWaylandShellSurface.sendPosition?.(view.positionOffset)
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

    surface.resource.onDestroy().then(() => xWaylandShellSurface.handleDestroy())

    return xWaylandShellSurface
  }

  requestClose(): void {
    this.window.close(Time.CurrentTime)
  }

  queryMaximized(): boolean {
    return this.state === SurfaceState.MAXIMIZED
  }

  queryFullscreen(): boolean {
    return this.state === SurfaceState.FULLSCREEN
  }

  queryGeometry(): RectWithInfo {
    return this.surface.geometry
  }

  queryMinSize(): Size {
    const sizeHints = this.window.sizeHints
    return sizeHints ? { width: sizeHints.minWidth, height: sizeHints.minHeight } : ZERO_SIZE
  }

  queryMaxSize(): Size {
    const sizeHints = this.window.sizeHints
    return sizeHints
      ? { width: sizeHints.maxWidth, height: sizeHints.maxHeight }
      : { width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER }
  }

  configureMaximized(maximized: boolean): void {
    // no op
  }

  configureFullscreen(fullscreen: boolean): void {
    // no op
  }

  configureSize(size: Size): void {
    this.sendConfigure?.(size)
  }

  configureActivated(activated: boolean): void {
    // no op
  }

  configureResizing(resizing: boolean): void {
    // no op
  }

  onCommit(surface: Surface): void {
    surface.commitPending()

    this.committed = true
    if (this.hasNextGeometry && this.nextGeometry) {
      const oldGeometry = this.surface.geometry
      this.surface.state.dx -= this.nextGeometry.position.x - oldGeometry.position.x
      this.surface.state.dy -= this.nextGeometry.position.y - oldGeometry.position.y

      this.hasNextGeometry = false
      this.surface.updateGeometry(this.nextGeometry)
    }

    this.desktopSurface.commit()
    this.session.renderer.render(() => this.withFrameDecoration())
  }

  setToplevel(): void {
    this.changeState(SurfaceState.TOP_LEVEL, undefined, ORIGIN)
  }

  setToplevelWithPosition(x: number, y: number): void {
    this.changeState(SurfaceState.TOP_LEVEL, undefined, ORIGIN)
    this.desktopSurface.setXWaylandPosition({ x, y })
  }

  setParent(parent: Surface): void {
    if (parent.role?.desktopSurface === undefined) {
      return
    }
    this.desktopSurface.setParent(parent.role.desktopSurface)
  }

  setTransient(parent: Surface, x: number, y: number): void {
    if (parent.role?.desktopSurface === undefined) {
      return
    }
    this.changeState(SurfaceState.TRANSIENT, parent.role.desktopSurface, { x, y })
  }

  setFullscreen(output?: Output): void {
    this.changeState(SurfaceState.FULLSCREEN, undefined, ORIGIN)
    this.desktopSurface.setFullscreen(true)
  }

  setXWayland(x: number, y: number): void {
    this.changeState(SurfaceState.XWAYLAND, undefined, { x, y })
    this.view.positionOffset = { x, y }
  }

  move(pointer: Pointer): void {
    if (this.state === SurfaceState.TOP_LEVEL && pointer.grabSerial) {
      this.desktopSurface.move(pointer.grabSerial)
    }
  }

  resize(pointer: Pointer, edges: number): void {
    if (this.state === SurfaceState.TOP_LEVEL && pointer.grabSerial) {
      this.desktopSurface.resize(pointer.grabSerial, edges)
    }
  }

  setTitle(title: string): void {
    this.desktopSurface.setTitle(title)
  }

  setWindowGeometry(x: number, y: number, width: number, height: number): void {
    this.hasNextGeometry = true
    this.nextGeometry = createRect({ x, y }, { width, height })
  }

  setMaximized(): void {
    this.changeState(SurfaceState.MAXIMIZED, undefined, ORIGIN)
    this.desktopSurface.setMaximized(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPid(pid: number): void {
    this.pid = pid
  }

  private withFrameDecoration() {
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

  private changeState(state: SurfaceState, parent: DesktopSurface | undefined, position: Point) {
    const toAdd = parent === undefined && state !== SurfaceState.XWAYLAND

    if (toAdd && this.added) {
      this.state = state
      return
    }

    if (this.state !== state) {
      if (this.state === SurfaceState.XWAYLAND) {
        // TODO send to centralized logging
        console.assert(!this.added)
        // TODO destroy view?
        this.surface.unmap()
      }

      if (toAdd) {
        this.desktopSurface?.setParent(undefined)
        this.desktopSurface.add()
        this.added = true
        if (this.state === SurfaceState.NONE && this.committed) {
          /* We had a race, and wl_surface.commit() was
           * faster, just fake a commit to map the
           * surface */
          this.desktopSurface.commit()
        }
      } else if (this.added) {
        this.desktopSurface.removed()
        this.added = false
      }

      if (state === SurfaceState.XWAYLAND) {
        // TODO send to centralized logging
        console.assert(!this.added)
        this.surface.mapped = true
        this.view.mapped = true
        this.session.renderer.addTopLevelView(this.view)
      }

      this.state = state
    }

    if (parent !== undefined) {
      this.surface.surfaceChildSelf.position = position
      this.desktopSurface.setParent(parent)
    }
  }

  private handleDestroy() {
    if (this.added) {
      this.desktopSurface.removed()
    }
  }
}
