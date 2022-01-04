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

import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { createLogger } from './Logger'

import { createNativeCompositorSession, NativeCompositorSession } from './NativeCompositorSession'
import { XWaylandSession } from './XWaylandSession'

const logger = createLogger('compositor-proxy-session')

export function createCompositorProxySession(compositorSessionId: string): CompositorProxySession {
  const nativeCompositorSession = createNativeCompositorSession(compositorSessionId)
  const xWaylandSession = XWaylandSession.create(nativeCompositorSession)
  xWaylandSession.createXWaylandListenerSocket()
  const compositorProxySession = new CompositorProxySession(
    nativeCompositorSession,
    compositorSessionId,
    xWaylandSession,
  )
  nativeCompositorSession.onDestroy().then(() => compositorProxySession.destroy())
  logger.info(`Session created.`)
  return compositorProxySession
}

class CompositorProxySession {
  private destroyResolve?: (value: void | PromiseLike<void>) => void
  private _destroyPromise = new Promise<void>((resolve) => {
    this.destroyResolve = resolve
  })

  constructor(
    public readonly nativeCompositorSession: NativeCompositorSession,
    public readonly compositorSessionId: string,
    private readonly xWaylandSession: XWaylandSession,
  ) {}

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    logger.info(`Session destroyed.`)
    this.destroyResolve?.()
  }

  handleConnection(webSocket: RetransmittingWebSocket): void {
    try {
      this.nativeCompositorSession.socketForClient(webSocket)
    } catch (e: any) {
      logger.error(`\tname: ${e.name} message: ${e.message} text: ${e.text}`)
      logger.error('error object stack: ')
      logger.error(e.stack)
      webSocket.close(4503, `Server encountered an exception.`)
    }
  }

  handleXWMConnection(webSocket: RetransmittingWebSocket, xwmFD: number): void {
    webSocket.binaryType = 'arraybuffer'
    this.xWaylandSession.createXWMConnection(webSocket, xwmFD)
  }
}
