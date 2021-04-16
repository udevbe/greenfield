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

import Logger from 'pino'
import WebSocket from 'ws'
import { loggerConfig } from './index'

import { createNativeCompositorSession, NativeCompositorSession } from './NativeCompositorSession'

const logger = Logger({
  ...loggerConfig,
  name: `session`,
})

export function createCompositorProxySession(compositorSessionId: string): CompositorProxySession {
  const nativeCompositorSession = createNativeCompositorSession(compositorSessionId)
  const appEndpointSession = new CompositorProxySession(nativeCompositorSession, compositorSessionId)
  nativeCompositorSession.onDestroy().then(() => appEndpointSession.destroy())
  logger.info(`Session created.`)
  return appEndpointSession
}

class CompositorProxySession {
  private destroyResolve?: (value: void | PromiseLike<void>) => void
  private _destroyPromise = new Promise<void>((resolve) => {
    this.destroyResolve = resolve
  })

  constructor(private nativeCompositorSession: NativeCompositorSession, public compositorSessionId: string) {}

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    logger.info(`Session destroyed.`)
    this.destroyResolve?.()
  }

  handleConnection(webSocket: WebSocket): void {
    try {
      this.nativeCompositorSession.socketForClient(webSocket)
    } catch (e) {
      logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
      logger.error('error object stack: ')
      logger.error(e.stack)
      webSocket.close(4503, `Server encountered an exception.`)
    }
  }
}
