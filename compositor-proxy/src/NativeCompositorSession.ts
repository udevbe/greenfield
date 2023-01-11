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
import { createProxyInputOutput } from './io/ProxyInputOutput'
import { createLogger } from './Logger'
import { createNativeClientSession, NativeClientSession } from './NativeClientSession'
import { config } from './config'
import {
  addSocketAuto,
  createDisplay,
  destroyDisplay,
  dispatchRequests,
  getFd,
  initDrm,
  initShm,
  nativeGlobalNames,
} from 'westfield-proxy'
import { ARQDataChannel, createProtocolChannel } from './ARQDataChannel'
import { PeerConnection } from 'node-datachannel'
import { webcrypto } from 'crypto'

const logger = createLogger('native-compositor-session')
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' as const

export type ClientEntry = {
  protocolChannel: ARQDataChannel
  nativeClientSession: NativeClientSession
  clientId: string
}

function base32Encode(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)

  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < view.byteLength; i++) {
    value = (value << 8) | view.getUint8(i)
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  return output
}

function newClientId(): string {
  const randomBytes = new Uint8Array(16)
  webcrypto.getRandomValues(randomBytes)
  return `cid${base32Encode(randomBytes).toLowerCase()}`
}

function onGlobalCreated(globalName: number): void {
  nativeGlobalNames.push(globalName)
}

function onGlobalDestroyed(globalName: number): void {
  const idx = nativeGlobalNames.indexOf(globalName)
  if (idx > -1) {
    nativeGlobalNames.splice(idx, 1)
  }
}

export function createNativeCompositorSession(
  compositorSessionId: string,
  peerConnection: PeerConnection,
): NativeCompositorSession {
  return new NativeCompositorSession(compositorSessionId, peerConnection)
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
    public readonly peerConnection: PeerConnection,
    public readonly webFS = createProxyInputOutput(compositorSessionId, config.public.baseURL),
    public clients: ClientEntry[] = [],
  ) {
    this.wlDisplay = createDisplay(
      (wlClient: unknown) => this.clientForSocket(wlClient),
      (globalName: number) => onGlobalCreated(globalName),
      (globalName: number) => onGlobalDestroyed(globalName),
    )

    this.waylandDisplay = addSocketAuto(this.wlDisplay)
    initShm(this.wlDisplay)
    this.drmContext = initDrm(this.wlDisplay, config.encoder.renderDevice)

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

    const clientId = newClientId()
    const protocolChannel = createProtocolChannel(this.peerConnection, clientId)
    const clientEntry: ClientEntry = {
      nativeClientSession: createNativeClientSession(wlClient, this, protocolChannel, clientId),
      protocolChannel,
      clientId,
    }
    this.clients = [...this.clients, clientEntry]
    clientEntry.nativeClientSession.onDestroy().then(() => {
      this.clients = this.clients.filter((value) => value !== clientEntry)
    })
  }
}
