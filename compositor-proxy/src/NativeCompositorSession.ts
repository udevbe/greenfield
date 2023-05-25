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

import { PollHandle, startPoll, stopPoll } from './proxy-poll-addon'
import { createProxyInputOutput } from './io/ProxyInputOutput'
import { createLogger } from './Logger'
import { createNativeClientSession, NativeClientSession } from './NativeClientSession'
import { config } from './config'
import {
  addSocketAuto,
  createDisplay,
  destroyClient,
  destroyDisplay,
  dispatchRequests,
  DRMHandle,
  getCredentials,
  getFd,
  initDrm,
  initShm,
  nativeGlobalNames,
  WlClient,
  WlDisplay,
} from 'westfield-proxy'
import { Channel, createProtocolChannel } from './Channel'
import { webcrypto } from 'crypto'
import { ProxySession } from './ProxySession'
import { readFileSync } from 'fs'
import { NativeAppContext } from './NativeAppContext'

const logger = createLogger('native-compositor-session')
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' as const

export type ClientEntry = {
  protocolChannel: Channel
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

export function createNativeCompositorSession(proxySession: ProxySession): NativeCompositorSession {
  return new NativeCompositorSession(proxySession)
}

export class NativeCompositorSession {
  readonly wlDisplay: WlDisplay
  readonly waylandDisplay: string
  readonly drmContext: DRMHandle
  private readonly wlDisplayFdWatcher: PollHandle

  constructor(
    public readonly proxySession: ProxySession,
    public readonly webFS = createProxyInputOutput(proxySession, config.public.baseURL),
    public readonly clients: ClientEntry[] = [],
  ) {
    this.wlDisplay = createDisplay(
      (wlClient: WlClient) => this.clientForNativeAppContext(wlClient),
      (globalName: number) => onGlobalCreated(globalName),
      (globalName: number) => onGlobalDestroyed(globalName),
    )

    this.waylandDisplay = addSocketAuto(this.wlDisplay)
    initShm(this.wlDisplay)
    this.drmContext = initDrm(this.wlDisplay, config.encoder.renderDevice)

    this.wlDisplayFdWatcher = startPoll(getFd(this.wlDisplay), (status) => {
      if (status < 0) {
        console.error('epoll error: ', status)
        process.exit(1)
      }
      dispatchRequests(this.wlDisplay)
    })

    logger.info(`Listening on: WAYLAND_DISPLAY="${this.waylandDisplay}".`)
  }

  destroy(): void {
    stopPoll(this.wlDisplayFdWatcher)
    for (const client of this.clients) {
      client.nativeClientSession.destroy()
    }
    destroyDisplay(this.wlDisplay)
  }

  private findMatchingNativeAppContext(pid: number): NativeAppContext | undefined {
    const nativeAppContext = this.proxySession.findNativeAppContextByPid(pid)
    if (nativeAppContext) {
      return nativeAppContext
    }

    for (const line of readFileSync(`/proc/${pid}/status`, 'ascii').split('\n')) {
      if (line.startsWith('PPid')) {
        const ppid = Number.parseInt(line.split(':')[1].trim())
        if (ppid === 0) {
          // no matches available
          return undefined
        } else {
          return this.findMatchingNativeAppContext(ppid)
        }
      }
    }
  }

  private clientForNativeAppContext(wlClient: WlClient) {
    logger.info(`New Wayland client.`)

    const pidUidGid = new Uint32Array(3)
    getCredentials(wlClient, pidUidGid)
    const clientPid = pidUidGid[0]
    let nativeAppContext = this.findMatchingNativeAppContext(clientPid)

    if (nativeAppContext === undefined) {
      const firstNativeAppContext = this.proxySession.getFirstNativeAppContext()
      if (firstNativeAppContext === undefined) {
        // terminate client, wayland client was not started as an action from the user
        destroyClient(wlClient)
        return
      }
      // get pid from wlClient
      nativeAppContext = this.proxySession.createNativeAppContext(clientPid)
      firstNativeAppContext.sendNewClientNotify(nativeAppContext.key)
    }

    const clientId = newClientId()
    const protocolChannel = createProtocolChannel(clientId, nativeAppContext)
    const nativeClientSession = createNativeClientSession(wlClient, this, protocolChannel, clientId, nativeAppContext)
    const clientEntry = {
      nativeClientSession,
      protocolChannel,
      clientId,
    }
    this.clients.push(clientEntry)
    nativeClientSession.destroyListeners.push(() => {
      const index = this.clients.indexOf(clientEntry)
      if (index > -1) {
        this.clients.splice(index, 1)
      }
    })
  }
}
