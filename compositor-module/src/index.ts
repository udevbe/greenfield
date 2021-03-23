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
import Session from './Session'
import { UserShellApi } from './UserShellApi'
import WebAppLauncher from './WebAppLauncher'
import WebAppSocket from './WebAppSocket'
import { nrmlvo } from './Xkb'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { init as initWasm } from './lib'
export * from './ButtonEvent'
export * from './AxisEvent'
export * from './KeyEvent'
export { nrmlvo }

export function createCompositorSession(): CompositorSession {
  return Session.create()
}

export interface CompositorPointer {
  scrollFactor: number
}

export interface CompositorKeyboard {
  nrmlvo: nrmlvo
  nrmlvoEntries: nrmlvo[]
}

export interface CompositorSeat {
  keyboard: CompositorKeyboard
  pointer: CompositorPointer
}

export interface CompositorSession {
  userShell: UserShellApi
  globals: CompositorGlobals
}

export interface CompositorGlobals {
  register(): void

  unregister(): void

  seat: CompositorSeat
}

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

export interface CompositorClient {
  id: string
  variant: 'web' | 'remote'
}

export interface CompositorConfiguration {
  scrollFactor: number
  keyboardLayoutName?: string
}

export type CompositorWebAppSocket = unknown

export function createCompositorWebAppSocket(session: CompositorSession): CompositorWebAppSocket {
  if (session instanceof Session) {
    return WebAppSocket.create(session)
  } else {
    throw new Error('Session does not have expected implementation.')
  }
}

export type CompositorRemoteSocket = unknown

export function createCompositorRemoteSocket(session: CompositorSession): CompositorRemoteSocket {
  if (session instanceof Session) {
    return RemoteSocket.create(session)
  } else {
    throw new Error('Session does not have expected implementation.')
  }
}

export interface CompositorRemoteAppLauncher {
  launch(appEndpointURL: URL, remoteAppId: string): Promise<Client>
  launchURL(appEndpointURL: URL): Promise<Client>
}

export function createCompositorRemoteAppLauncher(
  session: CompositorSession,
  remoteSocket: CompositorRemoteSocket,
): CompositorRemoteAppLauncher {
  if (session instanceof Session && remoteSocket instanceof RemoteSocket) {
    return RemoteAppLauncher.create(session, remoteSocket)
  } else {
    throw new Error('Session and/or remote socket do not have expected implementation.')
  }
}

export interface CompositorWebAppLauncher {
  launch(webAppURL: URL): Promise<Client>
}

export function createCompositorWebAppLauncher(webAppSocket: CompositorWebAppSocket): CompositorWebAppLauncher {
  if (webAppSocket instanceof WebAppSocket) {
    return WebAppLauncher.create(webAppSocket)
  } else {
    throw new Error('Web app socket does not have expected implementation.')
  }
}
