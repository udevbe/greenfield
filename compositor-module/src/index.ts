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
import RemoteAppLauncher from './RemoteAppLauncher'
import RemoteSocket from './RemoteSocket'
import Session, { GreenfieldLogger } from './Session'
import { UserShellApi } from './UserShellApi'
import { nrmlvo } from './Xkb'

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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type CompositorRemoteSocket = unknown

export function createCompositorRemoteSocket(session: CompositorSession): CompositorRemoteSocket {
  if (session instanceof Session) {
    return RemoteSocket.create(session)
  } else {
    throw new Error('Session does not have expected implementation.')
  }
}

export interface CompositorProxyConnector {
  connectTo(url: URL, auth?: string): Promise<Client>
}

export function createCompositorProxyConnector(
  session: CompositorSession,
  remoteSocket: CompositorRemoteSocket,
): CompositorProxyConnector {
  if (session instanceof Session && remoteSocket instanceof RemoteSocket) {
    return RemoteAppLauncher.create(session, remoteSocket)
  } else {
    throw new Error('Session and/or remote socket do not have expected implementation.')
  }
}
