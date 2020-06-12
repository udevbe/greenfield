// Copyright 2019 Erik De Rijcke
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

export { init as initWasm } from './lib'
export { default as Session } from './Session'
export { default as WebAppLauncher } from './WebAppLauncher'
export { default as RemoteAppLauncher } from './RemoteAppLauncher'
export { default as WebAppSocket } from './WebAppSocket'
export { default as RemoteSocket } from './RemoteSocket'
export * from './ButtonEvent'
export * from './AxisEvent'
export * from './KeyEvent'

export interface CompositorSurfaceState {
  title?: string
  appId?: string
  mapped?: boolean
  active?: boolean
  unresponsive?: boolean
  minimized?: boolean
  key?: string
  lastActive?: number
  type?: 'remote' | 'local'
}

export interface CompositorSurface {
  id: string
  clientId: string
}

export interface CompositorSeatState {
  pointerGrab?: CompositorSurface
  keyboardFocus?: CompositorSurface
}

export interface CompositorClient {
  id: string
  variant: 'web' | 'remote'
}

export interface UserConfiguration {
  scrollFactor: number
  keyboardLayoutName?: string
}
