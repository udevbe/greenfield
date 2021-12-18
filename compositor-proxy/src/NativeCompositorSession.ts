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
import { Endpoint, nativeGlobalNames } from 'westfield-endpoint'
import WebSocket from 'ws'
import { RetransmittingWebSocket } from '../../../retransmit.js'
import { createCompositorProxyWebFS } from './CompositorProxyWebFS'
import { createLogger } from './Logger'

import { createNativeClientSession, NativeClientSession } from './NativeClientSession'
import { WebSocketChannel } from './WebSocketChannel'

const logger = createLogger('native-compositor-session')

export type ClientEntry = { webSocketChannel: WebSocketChannel; nativeClientSession?: NativeClientSession }

function onGlobalCreated(globalName: number): void {
  nativeGlobalNames.push(globalName)
}

function onGlobalDestroyed(globalName: number): void {
  const idx = nativeGlobalNames.indexOf(globalName)
  if (idx > -1) {
    nativeGlobalNames.splice(idx, 1)
  }
}

export function createNativeCompositorSession(compositorSessionId: string): NativeCompositorSession {
  const compositorSession = new NativeCompositorSession(compositorSessionId)

  const wlDisplayFd = Endpoint.getFd(compositorSession.wlDisplay)

  // TODO handle err
  // TODO write our own native epoll
  const fdWatcher = new Epoll((err: unknown) => {
    if (err) {
      console.error('epoll error: ', err)
      process.exit(1)
    }
    Endpoint.dispatchRequests(compositorSession.wlDisplay)
  })
  fdWatcher.add(wlDisplayFd, Epoll.EPOLLPRI | Epoll.EPOLLIN | Epoll.EPOLLERR)

  return compositorSession
}

export class NativeCompositorSession {
  readonly wlDisplay: unknown
  readonly waylandDisplay: string

  private destroyResolve?: (value: void | PromiseLike<void>) => void
  private destroyPromise: Promise<void> = new Promise<void>((resolve) => {
    this.destroyResolve = resolve
  })

  constructor(
    public readonly compositorSessionId: string,
    public readonly appEndpointWebFS = createCompositorProxyWebFS(compositorSessionId),
    public clients: ClientEntry[] = [],
  ) {
    this.wlDisplay = Endpoint.createDisplay(
      (wlClient: unknown) => this.clientForSocket(wlClient),
      (globalName: number) => onGlobalCreated(globalName),
      (globalName: number) => onGlobalDestroyed(globalName),
    )

    this.waylandDisplay = Endpoint.addSocketAuto(this.wlDisplay)
    Endpoint.initShm(this.wlDisplay)

    logger.info(`Listening on: WAYLAND_DISPLAY="${this.waylandDisplay}".`)
  }

  onDestroy(): Promise<void> {
    return this.destroyPromise
  }

  destroy(): void {
    if (this.destroyResolve === undefined) {
      return
    }

    this.clients.forEach((client) => client.nativeClientSession?.destroy())
    Endpoint.destroyDisplay(this.wlDisplay)

    this.destroyResolve()
    this.destroyResolve = undefined
  }

  private clientForSocket(wlClient: unknown) {
    logger.info(`New Wayland connection.`)

    let client = this.clients.find((client) => client.nativeClientSession === undefined)

    if (client) {
      logger.debug('Found client without a wayland connection, will associating with new wayland connection.')
      // associate native wayland connection with previously created placeholder client
      client.nativeClientSession = createNativeClientSession(wlClient, this, client.webSocketChannel)
    } else {
      logger.debug(
        'No client found without a wayland connection, will create a placeholder client without a websocket connection.',
      )
      const webSocketChannel = WebSocketChannel.createNoWebSocket()
      client = {
        nativeClientSession: createNativeClientSession(wlClient, this, webSocketChannel),
        webSocketChannel,
      }
      this.clients = [...this.clients, client]

      // no previously created web sockets available, so ask compositor to create a new one
      const otherClient = this.clients.find((client) => client.webSocketChannel.webSocket !== undefined)
      if (otherClient) {
        logger.debug('Previous client found with a websocket connection, will ask for a new a websocket connection.')
        otherClient.nativeClientSession?.requestWebSocket()
      }
    }

    if (client.nativeClientSession) {
      client.nativeClientSession.onDestroy().then(() => {
        this.clients = this.clients.filter((value) => value !== client)
      })
    }
  }

  socketForClient(webSocket: RetransmittingWebSocket): void {
    logger.info(`New websocket connected.`)

    // find a client who does not have a websocket associated
    const client = this.clients.find((client) => client.webSocketChannel.webSocket === undefined)
    if (client === undefined) {
      // create a placeholder client for future wayland client connections.
      const placeHolderClient: ClientEntry = { webSocketChannel: WebSocketChannel.create(webSocket) }
      this.clients = [...this.clients, placeHolderClient]
      webSocket.addEventListener('close', () => placeHolderClient.nativeClientSession?.destroy())
    } else {
      // associate the websocket with an already connected wayland client.
      client.webSocketChannel.webSocket = webSocket
      webSocket.addEventListener('close', () => client.nativeClientSession?.destroy())
    }
  }
}
