import { WlShellSurfaceResize } from '@gfld/compositor-protocol'
import { CompositorSurface } from '../index'
import { ORIGIN, Point } from '../math/Point'
import Surface from '../Surface'
import { toCompositorSurface } from '../UserShellApi'
import { DesktopSurface, DesktopSurfaceRole } from './Desktop'
import { FloatingDesktopSurface } from './FloatingDesktopSurface'

type XWayland = {
  isSet: boolean
  position: Point
}

export class AlwaysFullscreenDesktopSurface implements DesktopSurface {
  focusCount = 0
  xWayland: XWayland = {
    isSet: false,
    position: ORIGIN,
  }
  public readonly compositorSurface: CompositorSurface

  private floatingDesktopSurface?: FloatingDesktopSurface

  constructor(
    public surface: Surface,
    readonly role: DesktopSurfaceRole,
  ) {
    this.compositorSurface = toCompositorSurface(this)
  }

  init() {
    if (!this.role.queryFullscreen()) {
      this.prepareFullscreen()
      this.setFullscreen(true)
    }
  }

  move(grabSerial: number): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.move(grabSerial)
    }
  }

  resize(grabSerial: number, edges: WlShellSurfaceResize): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.resize(grabSerial, edges)
    }
  }

  setFullscreen(fullscreen: boolean): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.setFullscreen(fullscreen)
    } else if (fullscreen) {
      const fullScreenScene = this.role.view.relevantScene ?? Object.values(this.surface.session.renderer.scenes)[0]
      fullScreenScene.sizeListeners.push(() => {
        const { width, height } = fullScreenScene.canvas
        this.role.configureSize({ width, height })
      })
      const { width, height } = fullScreenScene.canvas
      this.role.configureFullscreen(true)
      this.role.configureSize({ width, height })
    }
  }

  setMaximized(maximized: boolean): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.setMaximized(maximized)
    }
  }

  commit(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.commit()
      return
    }

    if (this.surface.size === undefined) {
      return
    }

    if (!this.surface.mapped) {
      this.map()
      this.surface.mapped = true
    }
  }

  loseFocus(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.loseFocus()
      return
    }

    if (--this.focusCount === 0) {
      this.role.configureActivated(false)
      this.surface.session.userShell.events.surfaceActivationUpdated?.(this.compositorSurface, false)
    }
  }

  gainFocus(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.gainFocus()
      return
    }

    if (this.focusCount++ === 0) {
      this.role.configureActivated(true)
      this.surface.session.userShell.events.surfaceActivationUpdated?.(this.compositorSurface, true)
    }
  }

  setParent(parent: DesktopSurface | undefined): void {
    if (parent !== undefined && this.floatingDesktopSurface === undefined) {
      this.floatingDesktopSurface = new FloatingDesktopSurface(this.surface, this.role)
      this.floatingDesktopSurface.init()
      this.floatingDesktopSurface.focusCount = this.focusCount
      this.floatingDesktopSurface.xWayland = { ...this.xWayland }
      this.floatingDesktopSurface.fullscreen = true
      this.floatingDesktopSurface.setFullscreen(false)
    }

    if (this.floatingDesktopSurface) {
      this.floatingDesktopSurface.setParent(parent)
    }

    if (parent === undefined && this.floatingDesktopSurface !== undefined) {
      this.focusCount = this.floatingDesktopSurface.focusCount
      this.xWayland = { ...this.floatingDesktopSurface.xWayland }
      this.floatingDesktopSurface = undefined
    }
  }

  activate(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.activate()
      return
    }

    const child = this.lastMappedChild()
    if (child) {
      child.activate()
      return
    }

    this.surface.session.globals.seat.setKeyboardFocus(this)

    this.surface.session.renderer.raiseSurface(this.surface)
  }

  minimize(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.minimize()
      return
    }

    this.role.view.mapped = false
    const seat = this.surface.session.globals.seat
    if (this.surface === seat.keyboard.focus?.getMainSurface()) {
      seat.keyboard.setFocus(undefined)
      seat.dropFocus()
    }
  }

  popupGrab(serial: number): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.popupGrab(serial)
      return
    }

    if (this.surface.session.globals.seat.popupGrabStart(this.surface.resource.client, serial)) {
      this.surface.session.globals.seat.popupGrab?.addSurface(this)
    } else {
      this.popupDismiss()
    }
  }

  popupDismiss(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.popupDismiss()
      return
    }

    this.surface.session.globals.seat.popupGrab?.removeSurface(this)
    this.role.requestClose()
  }

  setXWaylandPosition(position: Point): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.setXWaylandPosition(position)
      return
    }

    this.xWayland.position = position
    this.xWayland.isSet = true
  }

  add(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.add()
      return
    }

    this.surface.session.renderer.addTopLevelView(this.role.view)
    this.surface.session.userShell.events.surfaceCreated?.(this.compositorSurface)
  }

  removed(): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.removed()
      return
    }

    this.surface.session.renderer.removeTopLevelView(this.role.view)
    this.surface.session.userShell.events.surfaceDestroyed?.(this.compositorSurface)
  }

  setTitle(title: string): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.setTitle(title)
      return
    }

    this.surface.session.userShell.events.surfaceTitleUpdated?.(this.compositorSurface, title)
  }

  setAppId(appId: string): void {
    if (this.floatingDesktopSurface !== undefined) {
      this.floatingDesktopSurface.setAppId(appId)
      return
    }

    this.surface.session.userShell.events.surfaceAppIdUpdated?.(this.compositorSurface, appId)
  }

  private prepareFullscreen() {
    // TODO prepare and configure the renderer to show this surface fullscreen
    this.role.view.positionOffset = ORIGIN
  }

  private map() {
    this.role.view.mapped = true
    this.activate()
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
