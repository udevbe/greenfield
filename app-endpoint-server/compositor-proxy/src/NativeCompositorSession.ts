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

import { Epoll } from 'epoll'
import Logger from 'pino'
import { Endpoint, nativeGlobalNames } from 'westfield-endpoint'
import WebSocket from 'ws'
import { CompositorProxyWebFS } from './CompositorProxyWebFS'

import { loggerConfig } from './index'

import { NativeClientSession } from './NativeClientSession'
import { WebSocketChannel } from './WebSocketChannel'

const logger = Logger({
  ...loggerConfig,
  name: `native-compositor-session`,
})

export type ClientEntry = { webSocketChannel: WebSocketChannel; nativeClientSession?: NativeClientSession; id: number }

export class NativeCompositorSession {
  static create(compositorSessionId: string): NativeCompositorSession {
    const compositorSession = new NativeCompositorSession(compositorSessionId)

    // TODO move global create/destroy callback implementations into Endpoint.js

    const wlDisplayFd = Endpoint.getFd(compositorSession.wlDisplay)

    // TODO handle err
    // TODO write our own native epoll
    const fdWatcher = new Epoll((err: unknown) => Endpoint.dispatchRequests(compositorSession.wlDisplay))
    fdWatcher.add(wlDisplayFd, Epoll.EPOLLPRI | Epoll.EPOLLIN | Epoll.EPOLLERR)

    return compositorSession
  }

  readonly wlDisplay: unknown
  readonly waylandDisplay: string

  private _destroyResolve?: (value: void | PromiseLike<void>) => void
  private _destroyPromise: Promise<void> = new Promise<void>((resolve) => {
    this._destroyResolve = resolve
  })

  constructor(
    public readonly compositorSessionId: string,
    public readonly appEndpointWebFS = CompositorProxyWebFS.create(compositorSessionId),
    public clients: ClientEntry[] = [],
    private _nextClientId = 100,
  ) {
    this.wlDisplay = Endpoint.createDisplay(
      (wlClient: unknown) => this._onClientCreated(wlClient),
      (globalName: number) => this._onGlobalCreated(globalName),
      (globalName: number) => this._onGlobalDestroyed(globalName),
    )

    this.waylandDisplay = Endpoint.addSocketAuto(this.wlDisplay)
    Endpoint.initShm(this.wlDisplay)

    logger.info(`Listening on: WAYLAND_DISPLAY="${this.waylandDisplay}".`)
  }

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    if (this._destroyResolve === undefined) {
      return
    }

    this.clients.forEach((client) => client.nativeClientSession?.destroy())
    Endpoint.destroyDisplay(this.wlDisplay)

    this._destroyResolve()
    this._destroyResolve = undefined
  }

  private _requestWebSocket(clientId: number) {
    // We hijack the very first web socket connection we find to send an out of band message asking for a new web socket.
    const client = this.clients.find((client) => client.webSocketChannel.webSocket !== null)
    if (client) {
      client.nativeClientSession?.requestWebSocket(clientId)
    }
    // else wait for browser make a websocket connection
  }

  private _onClientCreated(wlClient: unknown) {
    logger.info(`New Wayland client connected.`)

    let client = this.clients.find((client) => client.nativeClientSession === null)

    if (client) {
      client.nativeClientSession = NativeClientSession.create(wlClient, this, client.webSocketChannel)
    } else {
      const webSocketChannel = WebSocketChannel.createNoWebSocket()
      const id = this._nextClientId++
      client = {
        nativeClientSession: NativeClientSession.create(wlClient, this, webSocketChannel),
        webSocketChannel,
        id,
      }
      this.clients.push(client)
      // no browser initiated web sockets available, so ask compositor to create a new one linked to clientId
      this._requestWebSocket(id)
    }

    if (client.nativeClientSession) {
      const constClient = client
      client.nativeClientSession.onDestroy().then(() => this.removeClient(constClient))
    }
  }

  removeClient(client: ClientEntry): void {
    const idx = this.clients.indexOf(client)
    if (idx > -1) {
      this.clients.splice(idx, 1)
    }
  }

  socketForClient(webSocket: WebSocket, clientId: number): void {
    webSocket.binaryType = 'arraybuffer'
    const foundClientEntry = this.clients.find((client) => client.id === clientId)
    if (foundClientEntry === undefined) {
      throw new Error('BUG. Expected a client entry.')
    }
    // As a side effect, this will notify the NativeClientSession that a web socket is now available
    foundClientEntry.webSocketChannel.webSocket = webSocket
  }

  private _onGlobalCreated(globalName: number): void {
    nativeGlobalNames.push(globalName)
  }

  private _onGlobalDestroyed(globalName: number): void {
    const idx = nativeGlobalNames.indexOf(globalName)
    if (idx > -1) {
      nativeGlobalNames.splice(idx, 1)
    }
  }
}
