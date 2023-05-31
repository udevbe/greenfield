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
import { NativeAppContext } from './NativeAppContext'
import { Configschema } from './@types/config'

// TODO create logger per proxy session instance
const logger = createLogger('compositor-proxy-session')

let proxySessions: ProxySession[] = []

export function createProxySession(compositorSessionId: string, config: Configschema): ProxySession {
  const proxySession = new ProxySession(compositorSessionId, config)
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
  private nativeAppContexts: NativeAppContext[] = []

  constructor(readonly compositorSessionId: string, readonly config: Configschema) {
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

  createNativeAppContext(pid: number, name: string) {
    const nativeAppContext = new NativeAppContext(this, pid, name)
    this.nativeAppContexts.push(nativeAppContext)
    nativeAppContext.destroyListeners.push(() => {
      this.nativeAppContexts = this.nativeAppContexts.filter(
        (otherNativeAppContext) => otherNativeAppContext !== nativeAppContext,
      )
    })

    return nativeAppContext
  }

  getFirstNativeAppContext(): NativeAppContext | undefined {
    return this.nativeAppContexts[0]
  }

  findNativeAppContextByKey(key: string): NativeAppContext | undefined {
    return this.nativeAppContexts.find((nativeAppContext) => nativeAppContext.key === key)
  }

  findNativeAppContextByPid(pid: number) {
    return this.nativeAppContexts.find((nativeAppContext) => nativeAppContext.pid === pid)
  }
}

export function closeAllProxySessions() {
  for (const proxySession of proxySessions) {
    proxySession.close()
  }
}
