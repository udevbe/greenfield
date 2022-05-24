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
import { RetransmittingWebSocket, WebSocketLike } from 'retransmitting-websocket'
import { createCompositorProxyWebFS } from './webfs/ProxyWebFS'
import { registerUnboundClientConnection } from './ClientConnectionPool'
import { createLogger } from './Logger'

import { createNativeClientSession, NativeClientSession } from './NativeClientSession'
import { config } from './config'
import {
  addSocketAuto,
  createDisplay,
  destroyDisplay,
  getFd,
  initShm,
  nativeGlobalNames,
  dispatchRequests,
  initDrm,
} from 'westfield-proxy'

const logger = createLogger('native-compositor-session')

export type ClientEntry = { webSocket: WebSocketLike; nativeClientSession?: NativeClientSession }

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
  return new NativeCompositorSession(compositorSessionId)
}

export class NativeCompositorSession {
  readonly wlDisplay: unknown
  readonly waylandDisplay: string
  readonly drmContext: unknown
  private readonly wlDisplayFdWatcher: Epoll

  private destroyResolve?: (value: void | PromiseLike<void>) => void
  private destroyPromise: Promise<void> = new Promise<void>((resolve) => {
    this.destroyResolve = resolve
  })

  constructor(
    public readonly compositorSessionId: string,
    public readonly webFS = createCompositorProxyWebFS(compositorSessionId, config.public.baseURL),
    public clients: ClientEntry[] = [],
  ) {
    this.wlDisplay = createDisplay(
      (wlClient: unknown) => this.clientForSocket(wlClient),
      (globalName: number) => onGlobalCreated(globalName),
      (globalName: number) => onGlobalDestroyed(globalName),
    )

    this.waylandDisplay = addSocketAuto(this.wlDisplay)
    initShm(this.wlDisplay)
    this.drmContext = initDrm(this.wlDisplay)

    // TODO handle err
    // TODO write our own native epoll
    this.wlDisplayFdWatcher = new Epoll((err: unknown) => {
      if (err) {
        console.error('epoll error: ', err)
        process.exit(1)
      }
      dispatchRequests(this.wlDisplay)
    })
    this.wlDisplayFdWatcher.add(getFd(this.wlDisplay), Epoll.EPOLLPRI | Epoll.EPOLLIN | Epoll.EPOLLERR)

    logger.info(`Listening on: WAYLAND_DISPLAY="${this.waylandDisplay}".`)
  }

  onDestroy(): Promise<void> {
    return this.destroyPromise
  }

  destroy(): void {
    if (this.destroyResolve === undefined) {
      return
    }

    this.wlDisplayFdWatcher.close()

    this.clients.forEach((client) => client.nativeClientSession?.destroy())
    destroyDisplay(this.wlDisplay)

    this.destroyResolve()
    this.destroyResolve = undefined
  }

  private clientForSocket(wlClient: unknown) {
    logger.info(`New Wayland connection.`)

    let client = this.clients.find((client) => client.nativeClientSession === undefined)

    if (client) {
      logger.debug('Found client without a wayland connection, will associating with new wayland connection.')
      // associate native wayland connection with previously created placeholder client
      client.nativeClientSession = createNativeClientSession(wlClient, this, client.webSocket)
    } else {
      logger.debug(
        'No client found without a wayland connection, will create a placeholder client without an open websocket connection.',
      )
      const webSocket = new RetransmittingWebSocket()
      client = {
        nativeClientSession: createNativeClientSession(wlClient, this, webSocket),
        webSocket,
      }
      this.clients = [...this.clients, client]
      registerUnboundClientConnection(webSocket)

      // no previously created web sockets available, so ask compositor to create a new one
      const otherClient = this.clients.find((client) => client.webSocket.readyState === 1)
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

  socketForClient(webSocket: WebSocketLike): void {
    logger.info(`New websocket connected.`)
    // find a client who does not have a websocket associated
    const client = this.clients.find((client) => client.webSocket === webSocket)
    if (client === undefined) {
      // create a placeholder client for future wayland client connections.
      const placeHolderClient: ClientEntry = { webSocket }
      this.clients = [...this.clients, placeHolderClient]
      webSocket.addEventListener('close', () => {
        if (placeHolderClient.nativeClientSession) {
          placeHolderClient.nativeClientSession.destroy()
        } else {
          logger.info(`websocket closed without an associated wayland client.`)
          this.clients = this.clients.filter((value) => value !== placeHolderClient)
        }
      })
    } else {
      // associate the websocket with an already connected wayland client.
      webSocket.addEventListener('close', () => {
        logger.info(`websocket closed.`)
        if (client.nativeClientSession) {
          client.nativeClientSession.destroy()
        } else {
          logger.info(`websocket closed without an associated wayland client.`)
          this.clients = this.clients.filter((value) => value !== client)
        }
      })
    }
  }
}
