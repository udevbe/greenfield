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

  close(): void

  readonly type: CompositorConnector['type']
}

export interface AppContext extends ClientConnectionListener {
  readonly state: 'closed' | 'open' | 'connecting' | 'terminated' | 'error'
  readonly type: 'remote'
  readonly key?: string
  readonly name?: string

  onKeyChanged: (key: string) => void
  onNameChanged: (name: string) => void
  onStateChange: (state: Exclude<AppContext['state'], 'connecting'>) => void
  onError: (error: Error) => void
}

export interface AppLauncher {
  launch(url: URL, onChildAppContext: (childAppContext: AppContext) => void): AppContext
  readonly type: 'remote'
}

export interface WebClientConnectionListener extends ClientConnectionListener {
  readonly type: 'web'
  onClose?: () => void
  webAppIFrame?: HTMLIFrameElement
  onNeedIFrameAttach?: (webAppIFrame: HTMLIFrameElement) => void
}

export interface WebCompositorConnector {
  launch(url: URL): WebClientConnectionListener
  readonly type: 'web'
}

export type CompositorConnector = AppLauncher | WebCompositorConnector

type CompositorConnectorTypeMap = {
  web: WebCompositorConnector
  remote: AppLauncher
}

export function createAppLauncher<T extends CompositorConnector['type']>(
  session: CompositorSession,
  type: T,
): CompositorConnectorTypeMap[T] {
  if (!(session instanceof Session)) {
    throw new Error('Session does not have expected implementation.')
  }
  if (type === 'remote') {
    // @ts-ignore
    return RemoteAppLauncher.create(session)
  } else if (type === 'web') {
    // @ts-ignore
    return WebAppLauncher.create(session)
  } else {
    throw new Error(`Connector type must be 'remote' or 'web'.`)
  }
}
