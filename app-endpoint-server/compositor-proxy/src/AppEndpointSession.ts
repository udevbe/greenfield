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
import type { URLSearchParams } from 'url'
import WebSocket from 'ws'
import { loggerConfig } from './index'

import { NativeCompositorSession } from './NativeCompositorSession'

const logger = Logger({
  ...loggerConfig,
  name: `app-endpoint-session`,
})

export class AppEndpointSession {
  static create(compositorSessionId: string): AppEndpointSession {
    const nativeCompositorSession = NativeCompositorSession.create(compositorSessionId)
    const appEndpointSession = new AppEndpointSession(nativeCompositorSession, compositorSessionId)
    nativeCompositorSession.onDestroy().then(() => appEndpointSession.destroy())
    logger.info(`Session started.`)
    return appEndpointSession
  }

  private _destroyResolve?: (value: void | PromiseLike<void>) => void
  private _destroyPromise = new Promise<void>((resolve) => {
    this._destroyResolve = resolve
  })

  constructor(private _nativeCompositorSession: NativeCompositorSession, public compositorSessionId: string) {}

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    logger.info(`Session destroyed.`)
    this._destroyResolve?.()
  }

  async createWlConnection(webSocket: WebSocket, query: URLSearchParams): Promise<void> {
    const clientIdParam = query.get('clientId')
    if (clientIdParam === null) {
      webSocket.close(4400, `Missing client id.`)
      return
    }
    const clientId = Number.parseInt(clientIdParam)
    this._nativeCompositorSession.socketForClient(webSocket, clientId)
  }

  async launchApplication(webSocket: WebSocket, query: URLSearchParams): Promise<void> {
    const applicationId = query.get('launch')

    try {
      // TODO http call to app-launcher
      this._nativeCompositorSession.childSpawned(webSocket)
    } catch (e) {
      logger.error(`Application: ${applicationId} failed to start.`)
      logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
      logger.error('error object stack: ')
      logger.error(e.stack)

      webSocket.close(4503, `Application: ${applicationId} failed to start.`)
    }
  }

  handleIncomingDataTransfer(webSocket: WebSocket, query: URLSearchParams): void {
    const fd = query.get('fd')
    if (fd === null) {
      webSocket.close(4400, 'Missing fd query parameter.')
      return
    }

    const compositorSessionId = query.get('compositorSessionId')
    if (compositorSessionId === null) {
      webSocket.close(4400, 'Missing compositorSessionId query parameter.')
      return
    }

    this._nativeCompositorSession.appEndpointWebFS.incomingDataTransfer(webSocket, { fd, compositorSessionId })
  }

  handleConnection(webSocket: WebSocket, query: URLSearchParams): void {
    try {
      logger.debug(`New web socket open.`)
      if (query.get('clientId')) {
        this.createWlConnection(webSocket, query)
      } else if (query.get('launch')) {
        this.launchApplication(webSocket, query)
      } else if (query.get('fd')) {
        this.handleIncomingDataTransfer(webSocket, query)
      }
    } catch (e) {
      logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
      logger.error('error object stack: ')
      logger.error(e.stack)
      webSocket.close(4503, `Server encountered an exception.`)
    }
  }
}
