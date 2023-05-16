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
import { ClientSignaling } from './ClientSignaling'

// TODO create logger per proxy session instance
const logger = createLogger('compositor-proxy-session')

let proxySessions: ProxySession[] = []

export function createProxySession(compositorSessionId: string): ProxySession {
  const proxySession = new ProxySession(compositorSessionId)
  logger.info(`Session created.`)
  proxySessions.push(proxySession)

  return proxySession
}

export function findProxySessionByCompositorSessionId(compositorSessionId: string): ProxySession | undefined {
  return proxySessions.find((proxySession) => proxySession.compositorSessionId === compositorSessionId)
}

export class ProxySession {
  public compositorPeerIdentity?: string

  public readonly nativeCompositorSession: NativeCompositorSession
  private readonly xWaylandSession: XWaylandSession
  private clientSignalings: ClientSignaling[] = []

  constructor(public readonly compositorSessionId: string) {
    this.nativeCompositorSession = createNativeCompositorSession(this)
    this.xWaylandSession = XWaylandSession.create(this.nativeCompositorSession)
    this.xWaylandSession.createXWaylandListenerSocket()
  }

  private resetPeerConnectionState(): void {
    for (const client of this.nativeCompositorSession.clients) {
      client.nativeClientSession.destroy()
    }
  }

  close() {
    this.compositorPeerIdentity = undefined
    this.resetPeerConnectionState()
    this.nativeCompositorSession.destroy()
    proxySessions = proxySessions.filter(
      (proxySession) => proxySession.compositorSessionId !== this.compositorSessionId,
    )
  }

  createClientSignaling() {
    const clientSignaling = new ClientSignaling(this)
    this.clientSignalings.push(clientSignaling)
    clientSignaling.destroyListeners.push(() => {
      this.clientSignalings = this.clientSignalings.filter(
        (otherClientSignaling) => otherClientSignaling !== clientSignaling,
      )
    })

    return clientSignaling
  }

  getFirstClientSignaling(): ClientSignaling | undefined {
    return this.clientSignalings[0]
  }

  findClientSignalingByKey(key: string): ClientSignaling | undefined {
    return this.clientSignalings.find((clientSignaling) => clientSignaling.key === key)
  }

  findEmptyClientSignaling(): ClientSignaling | undefined {
    return this.clientSignalings.find((clientSignaling) => clientSignaling.nativeClientSession === undefined)
  }
}

export function closeAllProxySessions() {
  for (const proxySession of proxySessions) {
    proxySession.close()
  }
}
