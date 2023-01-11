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
import nodeDataChannel, { DataChannel, PeerConnection } from 'node-datachannel'
import { URLSearchParams } from 'url'

const logger = createLogger('compositor-proxy-session')

export function createCompositorProxySession(compositorSessionId: string): CompositorProxySession {
  const peerConnection = new nodeDataChannel.PeerConnection('peer', {
    iceServers: ['stun:stun.l.google.com:19302'],
    enableIceUdpMux: true,
  })

  const nativeCompositorSession = createNativeCompositorSession(compositorSessionId, peerConnection)
  const xWaylandSession = XWaylandSession.create(nativeCompositorSession)
  xWaylandSession.createXWaylandListenerSocket()

  const compositorProxySession = new CompositorProxySession(
    nativeCompositorSession,
    compositorSessionId,
    xWaylandSession,
    peerConnection,
  )
  nativeCompositorSession.onDestroy().then(() => compositorProxySession.destroy())
  logger.info(`Session created.`)

  return compositorProxySession
}

export class CompositorProxySession {
  private destroyResolve?: (value: void | PromiseLike<void>) => void
  private _destroyPromise = new Promise<void>((resolve) => {
    this.destroyResolve = resolve
  })

  constructor(
    public readonly nativeCompositorSession: NativeCompositorSession,
    public readonly compositorSessionId: string,
    private readonly xWaylandSession: XWaylandSession,
    public readonly peerConnection: PeerConnection,
  ) {}

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    logger.info(`Session destroyed.`)
    this.destroyResolve?.()
  }
}
