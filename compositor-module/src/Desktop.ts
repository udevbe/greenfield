import { WlShellSurfaceResize } from 'westfield-runtime-server'
import { AxisEvent } from './AxisEvent'
import { setBrowserCursor } from './browser/pointer'
import { ButtonEvent } from './ButtonEvent'
import { CompositorSurface } from './index'
import { minusPoint, ORIGIN, plusPoint, Point } from './math/Point'
import { RectWithInfo } from './math/Rect'
import { Size } from './math/Size'
import { PointerGrab } from './Pointer'
import Surface from './Surface'
import { DesktopSurfaceRole } from './SurfaceRole'
import { toCompositorSurface } from './UserShellApi'

class ResizeGrab implements PointerGrab {
  private constructor(
    public readonly desktopSurface: DesktopSurface,
    public readonly edges: number,
    public readonly geometry: RectWithInfo,
  ) {}

  static create(desktopSurface: DesktopSurface, edges: number, geometry: RectWithInfo) {
    return new ResizeGrab(desktopSurface, edges, geometry)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  axis(event: AxisEvent): void {
    // do nothing
  }

  button(event: ButtonEvent): void {
    const pointer = this.desktopSurface.surface.session.globals.seat.pointer
    if (pointer.buttonCount === 0 && event.released) {
      if (!this.desktopSurface.surface.destroyed) {
        this.desktopSurface.role.configureResizing(false)
      }
      this.desktopSurface.grabbed = false
      this.desktopSurface.resizeEdges = 0
      pointer.seat.session.renderer.resetCursor()
      pointer.endGrab()
    }
  }

  cancel(): void {
    this.desktopSurface.role.configureResizing(false)
    this.desktopSurface.grabbed = false
    this.desktopSurface.resizeEdges = 0
    this.desktopSurface.surface.session.globals.seat.pointer.endGrab()
  }

  focus(): void {
    // do nothing
  }

  frame(): void {
    // do nothing
  }

  motion(event: ButtonEvent): void {
    const pointer = this.desktopSurface.surface.session.globals.seat.pointer
    pointer.moveTo(event)
    if (this.desktopSurface.surface.destroyed || pointer.grabPoint === undefined) {
      return
    }

    const from = this.desktopSurface.role.view.sceneToViewSpace(pointer.grabPoint)
    const to = this.desktopSurface.role.view.sceneToViewSpace(pointer)

    let width = this.geometry.size.width
    if (this.edges & WlShellSurfaceResize.left) {
      width += from.x - to.x
    } else if (this.edges & WlShellSurfaceResize.right) {
      width += to.x - from.x
    }

    let height = this.geometry.size.height
    if (this.edges & WlShellSurfaceResize.top) {
      height += from.y - to.y
    } else if (this.edges & WlShellSurfaceResize.bottom) {
      height += to.y - from.y
    }

    const maxSize = this.desktopSurface.role.queryMaxSize()
    const minSize = this.desktopSurface.role.queryMinSize()

    if (width < minSize.width) {
      width = minSize.width
    } else if (maxSize.width > 0 && width > maxSize.width) {
      width = maxSize.width
    }
    if (height < minSize.height) {
      height = minSize.height
    } else if (maxSize.width > 0 && width > maxSize.width) {
      width = maxSize.width
    }

    this.desktopSurface.role.configureSize({ width, height })
  }

  start() {
    const pointer = this.desktopSurface.surface.session.globals.seat.pointer
    pointer.seat.popupGrabEnd()

    this.desktopSurface.grabbed = true
    pointer.startGrab(this)
    pointer.clearFocus()
    if (pointer.sprite === undefined) {
      this.setResizeCursor()
    }
  }

  private setResizeCursor() {
    if (
      (this.edges & WlShellSurfaceResize.top && this.edges & WlShellSurfaceResize.right) ||
      (this.edges & WlShellSurfaceResize.bottom && this.edges & WlShellSurfaceResize.left)
    ) {
      // TODO
      // setBrowserCursor('nesw-resize')
    } else if (
      (this.edges & WlShellSurfaceResize.top && this.edges & WlShellSurfaceResize.left) ||
      (this.edges & WlShellSurfaceResize.bottom && this.edges & WlShellSurfaceResize.right)
    ) {
      // TODO
      // setBrowserCursor('nwse-resize')
    } else if (this.edges & (WlShellSurfaceResize.top | WlShellSurfaceResize.bottom)) {
      // TODO
      // setBrowserCursor('ns-resize')
    } else if (this.edges & (WlShellSurfaceResize.left | WlShellSurfaceResize.right)) {
      // TODO
      // setBrowserCursor('ew-resize')
    }
  }
}

class MoveGrab implements PointerGrab {
  private constructor(readonly desktopSurface: DesktopSurface, readonly deltaPoint: Point) {}

  static create(desktopSurface: DesktopSurface) {
    const pointer = desktopSurface.surface.session.globals.seat.pointer
    if (pointer.grabPoint === undefined) {
      pointer.seat.session.logger.error('BUG. Move grab. Pointer does not have grab point.')
      throw new Error('BUG. Move grab. Pointer does not have grab point.')
    }

    const deltaPoint = minusPoint(desktopSurface.role.view.viewToSceneSpace(ORIGIN), pointer.grabPoint)
    return new MoveGrab(desktopSurface, deltaPoint)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  axis(event: AxisEvent): void {
    // do nothing
  }

  button(event: ButtonEvent): void {
    const pointer = this.desktopSurface.surface.session.globals.seat.pointer
    if (pointer.buttonCount === 0 && event.released) {
      this.desktopSurface.grabbed = false
      pointer.seat.session.renderer.resetCursor()
      pointer.endGrab()
    }
  }

  cancel(): void {
    const pointer = this.desktopSurface.surface.session.globals.seat.pointer
    this.desktopSurface.grabbed = false
    pointer.endGrab()
  }

  focus(): void {
    // do nothing
  }

  frame(): void {
    // do nothing
  }

  motion(event: ButtonEvent): void {
    if (this.desktopSurface.surface.destroyed) {
      return
    }
    const pointer = this.desktopSurface.surface.session.globals.seat.pointer

    pointer.moveTo(event)
    this.desktopSurface.role.view.positionOffset = plusPoint(pointer, this.deltaPoint)
    const parentPosition = this.desktopSurface.role.view.surface.parent?.role?.view.positionOffset
    if (parentPosition) {
      this.desktopSurface.role.view.positionOffset = minusPoint(
        this.desktopSurface.role.view.positionOffset,
        parentPosition,
      )
    }
    pointer.seat.session.renderer.render()
  }

  start() {
    const pointer = this.desktopSurface.surface.session.globals.seat.pointer
    pointer.seat.popupGrabEnd()

    this.desktopSurface.grabbed = true
    pointer.startGrab(this)
    pointer.clearFocus()
    if (pointer.sprite === undefined) {
      // TODO
      // setBrowserCursor('move')
    }
  }
}

type XWayland = {
  isSet: boolean
  position: Point
}

export class DesktopSurface {
  resizeEdges: WlShellSurfaceResize = WlShellSurfaceResize.none
  grabbed = false
  fullscreen = false
  maximized = false
  lastSize?: Size
  savedPosition?: Point
  focusCount = 0
  xWayland: XWayland = {
    isSet: false,
    position: ORIGIN,
  }
  public readonly compositorSurface: CompositorSurface

  private constructor(public surface: Surface, readonly role: DesktopSurfaceRole) {
    this.compositorSurface = toCompositorSurface(this)
  }

  static create(surface: Surface, desktopSurfaceRole: DesktopSurfaceRole): DesktopSurface {
    return new DesktopSurface(surface, desktopSurfaceRole)
  }

  move(grabSerial: number): void {
    if (this.surface.destroyed) {
      return
    }

    if (this.grabbed) {
      return
    }

    const pointer = this.surface.session.globals.seat.pointer
    if (
      pointer.focus &&
      pointer.buttonCount > 0 &&
      pointer.grabSerial === grabSerial &&
      pointer.focus.surface.getMainSurface() === this.surface
    ) {
      MoveGrab.create(this).start()
    }
  }

  resize(grabSerial: number, edges: WlShellSurfaceResize): void {
    const pointer = this.surface.session.globals.seat.pointer
    if (
      pointer.buttonCount === 0 ||
      pointer.grabSerial !== grabSerial ||
      pointer.focus === undefined ||
      pointer.focus.surface.getMainSurface() !== this.surface
    ) {
      return
    }

    const focus = this.surface.session.globals.seat.pointer.focus?.surface.getMainSurface()
    if (focus !== this.surface) {
      return
    }

    const resizeTopBottom = WlShellSurfaceResize.top | WlShellSurfaceResize.bottom
    const resizeLeftRight = WlShellSurfaceResize.left | WlShellSurfaceResize.right
    const resizeAny = resizeTopBottom | resizeLeftRight

    if (this.grabbed || this.role.queryFullscreen() || this.role.queryMaximized()) {
      return
    }

    /* Check for invalid edge combinations. */
    if (
      edges === WlShellSurfaceResize.none ||
      edges > resizeAny ||
      (edges & resizeTopBottom) === resizeTopBottom ||
      (edges & resizeLeftRight) == resizeLeftRight
    ) {
      return
    }

    this.resizeEdges = edges

    const geometry = this.role.queryGeometry()
    this.role.configureResizing(true)
    ResizeGrab.create(this, edges, geometry).start()
  }

  setFullscreen(fullscreen: boolean): void {
    const output = this.role.view.relevantScene
    const outputSize: Size = output?.canvas ?? { width: 0, height: 0 }
    this.role.configureFullscreen(fullscreen)
    this.role.configureSize(outputSize)
  }

  setMaximized(maximized: boolean): void {
    if (maximized) {
      // FIXME views should have their relevant scene set explicitly based on their location instead of re-calculated each time.
      const maximizedScene = this.role.view.relevantScene ?? Object.values(this.surface.session.renderer.scenes)[0]
      const { width, height } = maximizedScene.canvas
      this.role.configureSize({ width, height })
    } else {
      // zero size means the client should pick it's own size.
      this.role.configureSize({ width: 0, height: 0 })
    }

    this.role.configureMaximized(maximized)
  }

  commit(): void {
    if (this.surface.size === undefined) {
      return
    }

    const wasFullscreen = this.fullscreen
    const wasMaximixed = this.maximized

    this.fullscreen = this.role.queryFullscreen()
    this.maximized = this.role.queryMaximized()

    if (!this.surface.mapped) {
      this.map()
      this.surface.mapped = true
      return
    }

    if (
      this.surface.state.dx === 0 &&
      this.surface.state.dy === 0 &&
      this.lastSize?.width === this.surface.size.width &&
      this.lastSize?.height === this.surface.size.height &&
      wasFullscreen === this.fullscreen &&
      wasMaximixed === this.maximized
    ) {
      return
    }

    if (wasFullscreen) {
      this.unsetFullscreen()
    }
    if (wasMaximixed) {
      this.unsetMaximized()
    }

    if ((this.fullscreen || this.maximized) && this.savedPosition === undefined) {
      this.savedPosition = this.role.view.positionOffset
    }

    if (this.fullscreen) {
      this.prepareFullscreen()
    } else if (this.maximized) {
      this.setMaximizedPosition()
    } else {
      let sx = this.resizeEdges ? 0 : this.surface.state.dx
      let sy = this.resizeEdges ? 0 : this.surface.state.dy

      if (this.resizeEdges & WlShellSurfaceResize.left) {
        sx = (this.lastSize?.width ?? 0) - (this.surface.size.width ?? 0)
      }
      if (this.resizeEdges & WlShellSurfaceResize.top) {
        sy = (this.lastSize?.height ?? 0) - (this.surface.size.height ?? 0)
      }

      const from = this.role.view.viewToSceneSpace(ORIGIN)
      const to = this.role.view.viewToSceneSpace({ x: sx, y: sy })
      this.role.view.positionOffset = minusPoint(plusPoint(this.role.view.positionOffset, to), from)
    }

    this.lastSize = this.surface.size
  }

  loseFocus(): void {
    if (--this.focusCount === 0) {
      this.role.configureActivated(false)
      this.surface.session.userShell.events.active?.(this.compositorSurface, false)
    }
  }

  gainFocus(): void {
    if (this.focusCount++ === 0) {
      this.role.configureActivated(true)
      this.surface.session.userShell.events.active?.(this.compositorSurface, true)
    }
  }

  setParent(parent: DesktopSurface | undefined): void {
    if (this.surface.parent?.role?.desktopSurface === parent) {
      return
    }

    this.surface.parent?.removeChild(this.surface.surfaceChildSelf)
    parent?.surface.addChild(this.surface.surfaceChildSelf)
  }

  activate(): void {
    const child = this.lastMappedChild()
    if (child) {
      child.activate()
      return
    }

    this.surface.session.globals.seat.setKeyboardFocus(this)

    if (this.role.queryFullscreen()) {
      this.prepareFullscreen()
    }

    this.surface.session.renderer.raiseSurface(this.surface)
  }

  minimize(): void {
    this.role.view.mapped = false
    const seat = this.surface.session.globals.seat
    if (this.surface === seat.keyboard.focus?.getMainSurface()) {
      seat.keyboard.setFocus(undefined)
      seat.dropFocus()
    }
  }

  popupGrab(serial: number): void {
    if (this.surface.session.globals.seat.popupGrabStart(this.surface.resource.client, serial)) {
      this.surface.session.globals.seat.popupGrab?.addSurface(this)
    } else {
      this.popupDismiss()
    }
  }

  popupDismiss(): void {
    this.surface.session.globals.seat.popupGrab?.removeSurface(this)
    this.role.requestClose()
  }

  setXWaylandPosition(position: Point): void {
    this.xWayland.position = position
    this.xWayland.isSet = true
  }

  add(): void {
    this.surface.session.renderer.addTopLevelView(this.role.view)
    this.surface.session.userShell.events.clientSurfaceCreated?.(this.compositorSurface)
  }

  removed(): void {
    this.surface.session.renderer.removeTopLevelView(this.role.view)
    this.surface.session.userShell.events.clientSurfaceDestroyed?.(this.compositorSurface)
  }

  setTitle(title: string): void {
    this.surface.session.userShell.events.title?.(this.compositorSurface, title)
  }

  setAppId(appId: string): void {
    this.surface.session.userShell.events.appId?.(this.compositorSurface, appId)
  }

  private unsetFullscreen() {
    if (this.savedPosition) {
      this.role.view.positionOffset = this.savedPosition
    } else {
      this.role.view.setInitialPosition()
    }
    this.savedPosition = undefined
  }

  private unsetMaximized() {
    if (this.savedPosition) {
      this.role.view.positionOffset = this.savedPosition
    } else {
      this.role.view.setInitialPosition()
    }
    this.savedPosition = undefined
  }

  private prepareFullscreen() {
    // TODO prepare and configure the renderer to show this surface fullscreen
    this.role.view.positionOffset = ORIGIN
  }

  private setMaximizedPosition() {
    const geometry = this.role.queryGeometry()

    // FIXME take output scene into account
    // FIXME get the output/scene where we maximize on and use it's coordinates instead
    this.role.view.positionOffset = minusPoint(
      this.role.view.parent ? minusPoint(ORIGIN, this.role.view.parent.viewToSceneSpace(ORIGIN)) : ORIGIN,
      geometry.position,
    )
  }

  private map() {
    if (this.fullscreen) {
      this.prepareFullscreen()
    } else if (this.maximized) {
      this.setMaximizedPosition()
    } else if (this.xWayland.isSet) {
      this.setPositionFromXWayland()
    } else {
      this.role.view.setInitialPosition()
    }

    this.role.view.mapped = true
    this.activate()
  }

  private setPositionFromXWayland() {
    const geometry = this.surface.geometry
    this.role.view.positionOffset = minusPoint(this.xWayland.position, geometry.position)
  }

  private lastMappedChild(): DesktopSurface | undefined {
    const mappedChildren =
      this.surface.children
        .filter((child) => !child.surface.destroyed)
        .filter((child) => child.surface !== this.surface)
        .filter((child) => child.surface.role?.view.mapped) ?? []
    if (mappedChildren.length) {
      return mappedChildren[mappedChildren.length - 1].surface.role?.desktopSurface
    } else {
      return undefined
    }
  }
}
