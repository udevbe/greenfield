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
import { Secret, verify } from 'jsonwebtoken'

import { NativeCompositorSession } from './NativeCompositorSession'

const logger = Logger({
  ...loggerConfig,
  name: `session`,
})

export class CompositorProxySession {
  static create(compositorSessionId: string, publicKey: Secret): CompositorProxySession {
    const nativeCompositorSession = NativeCompositorSession.create(compositorSessionId)
    const appEndpointSession = new CompositorProxySession(nativeCompositorSession, compositorSessionId, publicKey)
    nativeCompositorSession.onDestroy().then(() => appEndpointSession.destroy())
    logger.info(`Session created.`)
    return appEndpointSession
  }

  private _destroyResolve?: (value: void | PromiseLike<void>) => void
  private _destroyPromise = new Promise<void>((resolve) => {
    this._destroyResolve = resolve
  })

  constructor(
    private _nativeCompositorSession: NativeCompositorSession,
    public compositorSessionId: string,
    private publicKey: Secret,
  ) {}

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    logger.info(`Session destroyed.`)
    this._destroyResolve?.()
  }

  async createWlConnection(webSocket: WebSocket, clientIdParam: string): Promise<void> {
    if (clientIdParam === null) {
      webSocket.close(4400, `Missing client id.`)
      return
    }
    const clientId = Number.parseInt(clientIdParam)
    this._nativeCompositorSession.socketForClient(webSocket, clientId)
  }

  // async launchApplication(webSocket: WebSocket, applicationId: string, token: string): Promise<void> {
  //   try {
  //     logger.info(`Launching application: ${applicationId}`)
  //     this._nativeCompositorSession.childSpawned(webSocket)
  //     // TODO make docker-controller hostname configurable
  //     await fetch(`http://request-controller/compositor/${this.compositorSessionId}/application/${applicationId}`, {
  //       method: 'PUT',
  //       headers: {
  //         Authentication: `Bearer ${token}`,
  //       },
  //     })
  //   } catch (e) {
  //     logger.error(`Application: ${applicationId} failed to start.`)
  //     logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
  //     logger.error('error object stack: ')
  //     logger.error(e.stack)
  //
  //     webSocket.close(4503, `Application: ${applicationId} failed to start.`)
  //   }
  // }

  // handleIncomingDataTransfer(webSocket: WebSocket, fd: string): void {
  //   const compositorSessionId = query.get('compositorSessionId')
  //   if (compositorSessionId === null) {
  //     webSocket.close(4400, 'Missing compositorSessionId query parameter.')
  //     return
  //   }
  //
  //   this._nativeCompositorSession.appEndpointWebFS.incomingDataTransfer(webSocket, { fd, compositorSessionId })
  // }

  handleConnection(webSocket: WebSocket, query: URLSearchParams, token: string): void {
    verify(token, this.publicKey)

    // TODO use express with path mapping compositor/:session-id/application/launch/:application-id
    // TODO use express with path mapping compositor/:session-id/connection/create/:client-id
    try {
      logger.info(`New web socket open.`)
      const clientId = query.get('clientId')
      const launch = query.get('launch')
      // const fd = query.get('fd')
      if (clientId && launch === null) {
        this.createWlConnection(webSocket, clientId)
        // } else if (launch && clientId === null) {
        //   this.launchApplication(webSocket, launch, token)
        // TODO cross-host c/p
        // FIXME disabled for now
        // } else if (fd && launch === null && clientId === null) {
        //   this.handleIncomingDataTransfer(webSocket, fd)
      } else {
        webSocket.close(4400, 'Unknown or ambiguous query params.')
        webSocket.terminate()
        return
      }
    } catch (e) {
      logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
      logger.error('error object stack: ')
      logger.error(e.stack)
      webSocket.close(4503, `Server encountered an exception.`)
    }
  }
}
