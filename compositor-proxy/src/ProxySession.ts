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

import { createLogger } from './Logger'

import { createNativeCompositorSession, NativeCompositorSession } from './NativeCompositorSession'
import { XWaylandSession } from './XWaylandSession'
import { WebSocket } from 'uWebSockets.js'
import {randomBytes} from "crypto";

const logger = createLogger('compositor-proxy-session')

let proxySessions: ProxySession[] = []

export function createProxySession(compositorSessionId: string): ProxySession {
  const proxySession = new ProxySession(compositorSessionId)
  logger.info(`Session created.`)

  proxySessions.push(proxySession)

  return proxySession
}

export function findProxySessionsByCompositorSessionId(compositorSessionId: string): ProxySession[] {
  return proxySessions.filter((proxySession) => proxySession.compositorSessionId === compositorSessionId)
}

export function findProxySessionByIdentity(proxyIdentity: string): ProxySession | undefined {
  return proxySessions.find((proxySession)=>proxySession.identity===proxyIdentity)
}

export type SignalingUserData = {
  proxySession: ProxySession
}

export class ProxySession {
  private signalingSendBuffer: Uint8Array[] = []
  public signalingWebSocket?: WebSocket<SignalingUserData>

  public compositorPeerIdentity?: string
  public readonly identity = randomBytes(8).toString('hex')

  public readonly nativeCompositorSession: NativeCompositorSession
  private readonly xWaylandSession: XWaylandSession

  constructor(
    public readonly compositorSessionId: string,
  ) {
    this.nativeCompositorSession = createNativeCompositorSession(this)
    this.xWaylandSession = XWaylandSession.create(this.nativeCompositorSession)
    this.xWaylandSession.createXWaylandListenerSocket(compositorSessionId)
  }

  resetPeerConnectionState(killAllClients: boolean): void {
    for (const client of this.nativeCompositorSession.clients) {
      if (client.nativeClientSession.hasCompositorState || killAllClients) {
        client.nativeClientSession.destroy()
      }
    }
  }

  signalingSend(message: Uint8Array) {
    if (this.signalingWebSocket) {
      this.signalingWebSocket.send(message, true)
    } else {
      this.signalingSendBuffer.push(message)
    }
  }

  flushCachedSignalingSends() {
    if (this.signalingWebSocket === undefined) {
      return
    }
    if (this.signalingSendBuffer.length === 0) {
      return
    }
    for (const message of this.signalingSendBuffer) {
      this.signalingWebSocket.send(message, true)
    }
    this.signalingSendBuffer = []
  }

  close() {
    this.compositorPeerIdentity = undefined
    this.resetPeerConnectionState(true)
    this.nativeCompositorSession.destroy()
    proxySessions = proxySessions.filter(
      (proxySession) => proxySession.compositorSessionId !== this.compositorSessionId,
    )
  }
}

export function closeAllProxySessions() {
  for (const proxySession of proxySessions) {
    proxySession.close()
  }
}
