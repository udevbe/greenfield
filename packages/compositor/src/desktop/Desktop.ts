import { Point } from '../math/Point'
import Surface from '../Surface'
import { FloatingDesktopSurface } from './FloatingDesktopSurface'
import { RectWithInfo } from '../math/Rect'
import { Size } from '../math/Size'
import SurfaceRole from '../SurfaceRole'
import { AlwaysFullscreenDesktopSurface } from './AlwaysFullScreenDesktopSurface'

export interface DesktopSurfaceRole extends SurfaceRole {
  requestClose(): void

  queryMaximized(): boolean

  queryFullscreen(): boolean

  queryGeometry(): RectWithInfo

  queryMinSize(): Size

  queryMaxSize(): Size

  configureMaximized(maximized: boolean): void

  configureFullscreen(fullscreen: boolean): void

  configureSize(size: Size): void

  configureActivated(activated: boolean): void

  configureResizing(resizing: boolean): void
}

export interface DesktopSurface {
  removed(): void
  commit(): void
  setParent(parent: DesktopSurface | undefined): void
  setTitle(title: string): void
  setAppId(appId: string): void
  move(serial: number): void
  resize(serial: number, edges: number): void
  setMaximized(enable: boolean): void
  setFullscreen(enabled: boolean): void
  minimize(): void
  add(): void
  activate(): void
  gainFocus(): void
  loseFocus(): void

  setXWaylandPosition(position: Point): void
  popupGrab(serial: number): void

  surface: Surface
  role: DesktopSurfaceRole
}

export function createDesktopSurface(surface: Surface, desktopSurfaceRole: DesktopSurfaceRole): DesktopSurface {
  // TODO from config
  // return new FloatingDesktopSurface(surface, desktopSurfaceRole)
  return new AlwaysFullscreenDesktopSurface(surface, desktopSurfaceRole)
}
