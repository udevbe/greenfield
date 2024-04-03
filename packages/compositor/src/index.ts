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

import { Client } from '@gfld/compositor-protocol'
import { RemoteAppLauncher } from './remote/RemoteAppLauncher'
import Session, { GreenfieldLogger } from './Session'
import { UserShellApi } from './UserShellApi'
import { nrmlvo } from './Xkb'
import { WebAppLauncher } from './web/WebAppLauncher'

export { init as initWasm } from '@gfld/compositor-wasm'
export * from './ButtonEvent'
export * from './AxisEvent'
export * from './KeyEvent'
export type { nrmlvo }
export type { GreenfieldLogger }

export function createCompositorSession(
  sessionConfig: SessionConfig,
  logger?: GreenfieldLogger,
): Promise<CompositorSession> {
  return Session.create(sessionConfig, logger)
}

export interface CompositorPointer {
  scrollFactor: number
}

export interface CompositorKeyboard {
  nrmlvo: nrmlvo
  defaultNrmlvo: nrmlvo
  nrmlvoEntries: nrmlvo[]
}

export interface CompositorSeat {
  keyboard: CompositorKeyboard
  pointer: CompositorPointer
}

export interface CompositorSession {
  userShell: UserShellApi
  globals: CompositorGlobals
  config: SessionConfig
}

export interface CompositorGlobals {
  register(): void

  unregister(): void

  seat: CompositorSeat
}

export interface CompositorSurface {
  id: number
  client: CompositorClient
}

export interface CompositorClient {
  id: string
}

export interface CompositorConfiguration {
  scrollFactor: number
  keyboardLayoutName?: string
}

export interface AppContext {
  readonly state: 'closed' | 'open' | 'connecting' | 'terminated' | 'error'
  readonly key?: string
  readonly name?: string

  onKeyChanged: (key: string) => void
  onNameChanged: (name: string) => void
  onStateChange: (state: Exclude<AppContext['state'], 'connecting'>) => void
  onError: (error: Error) => void

  onClient: (client: Client) => void

  close(): void
}

export interface AppLauncher {
  launch(url: URL, onChildAppContext: (childAppContext: AppContext) => void): AppContext
}

export function createAppLauncher(session: CompositorSession, type: 'web' | 'remote'): AppLauncher {
  if (!(session instanceof Session)) {
    throw new Error('Session does not have expected implementation.')
  }
  if (type === 'remote') {
    return RemoteAppLauncher.create(session)
  } else if (type === 'web') {
    return WebAppLauncher.create(session)
  } else {
    throw new Error(`Connector type must be 'remote' or 'web'.`)
  }
}

export interface SessionConfig {
  id?: string
  mode: 'floating' | 'fullscreen'
}
