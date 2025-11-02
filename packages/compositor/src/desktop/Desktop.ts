// Copyright 2024 Erik De Rijcke
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

import { Point } from '../math/Point'
import Surface from '../Surface'
import { RectWithInfo } from '../math/Rect'
import { Size } from '../math/Size'
import SurfaceRole from '../SurfaceRole'
import { AlwaysFullscreenDesktopSurface } from './AlwaysFullScreenDesktopSurface'
import { FloatingDesktopSurface } from './FloatingDesktopSurface'

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

  init(): void

  surface: Surface
  role: DesktopSurfaceRole
}

export function createDesktopSurface(surface: Surface, desktopSurfaceRole: DesktopSurfaceRole): DesktopSurface {
  switch (surface.session.config.mode) {
    case 'experimental-fullscreen':
      return new AlwaysFullscreenDesktopSurface(surface, desktopSurfaceRole)
    case 'floating':
    default:
      return new FloatingDesktopSurface(surface, desktopSurfaceRole)
  }
}
