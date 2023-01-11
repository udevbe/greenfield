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

import { Client } from 'westfield-runtime-server'
import { RemoteConnector } from './remote/RemoteConnector'
import Session, { GreenfieldLogger } from './Session'
import { UserShellApi } from './UserShellApi'
import { nrmlvo } from './Xkb'
import { WebWorkerAppLauncher } from './web/WebWorkerAppLauncher'

export { init as initWasm } from './lib'
export * from './ButtonEvent'
export * from './AxisEvent'
export * from './KeyEvent'
export { nrmlvo }
export { GreenfieldLogger }

export function createCompositorSession(sessionId?: string, logger?: GreenfieldLogger): Promise<CompositorSession> {
  return Session.create(sessionId, logger)
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
  compositorSessionId: string
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

export interface ClientConnectionListener {
  onClient: (client: Client) => void
}

export interface CompositorConnector {
  listen(url: URL, auth?: string): ClientConnectionListener
}

export function createConnector(session: CompositorSession, type: 'remote' | 'web'): CompositorConnector {
  if (!(session instanceof Session)) {
    throw new Error('Session does not have expected implementation.')
  }
  if (type == 'remote') {
    return RemoteConnector.create(session)
  } else if (type === 'web') {
    return WebWorkerAppLauncher.create(session)
  } else {
    throw new Error(`Connector type must be 'remote' or 'web'.`)
  }
}
