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

import { PollHandle, startPoll, stopPoll } from './addons/proxy-poll-addon'
import { createProxyInputOutput } from './io/ProxyInputOutput.js'
import { createLogger } from './Logger.js'
import { createNativeClientSession, NativeWaylandClientSession } from './NativeWaylandClientSession.js'
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
} from './wayland-server.js'
import { Channel, createProtocolChannel } from './Channel.js'
import { webcrypto } from 'node:crypto'
import { Session } from './Session.js'
import { readFileSync } from 'node:fs'
import { NativeAppContext } from './NativeAppContext.js'
import { pid } from 'node:process'

const logger = createLogger('native-compositor-session')
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' as const

export type ClientEntry = {
  protocolChannel: Channel
  nativeClientSession: NativeWaylandClientSession
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

export function createNativeCompositorSession(session: Session): NativeWaylandCompositorSession {
  return new NativeWaylandCompositorSession(session)
}

export class NativeWaylandCompositorSession {
  readonly wlDisplay: WlDisplay
  readonly waylandDisplay: string
  readonly drmContext: DRMHandle
  private readonly wlDisplayFdWatcher: PollHandle

  constructor(
    public readonly session: Session,
    public readonly webFS = createProxyInputOutput(session, session.config.public.baseURL),
    public readonly clients: ClientEntry[] = [],
  ) {
    this.wlDisplay = createDisplay(
      (wlClient: WlClient) => this.clientForNativeAppContext(wlClient),
      (globalName: number) => onGlobalCreated(globalName),
      (globalName: number) => onGlobalDestroyed(globalName),
    )

    this.waylandDisplay = addSocketAuto(this.wlDisplay)
    initShm(this.wlDisplay)
    this.drmContext = initDrm(this.wlDisplay, this.session.config.encoder.renderDevice)

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
    const nativeAppContext = this.session.findNativeAppContextByPid(pid)
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

  private getNameFromPid(pid: number) {
    for (const line of readFileSync(`/proc/${pid}/status`, 'ascii').split('\n')) {
      if (line.startsWith('Name')) {
        return line.split(':')[1].trim()
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
      const firstNativeAppContext = this.session.getFirstNativeAppContext()
      if (firstNativeAppContext === undefined) {
        // terminate client, wayland client was not started as an action from the user
        destroyClient(wlClient)
        return
      }

      const name = this.getNameFromPid(clientPid) ?? 'unknown_app'
      nativeAppContext = this.session.createNativeAppContext(clientPid, name, true)
      firstNativeAppContext.sendCreateChildAppContext(nativeAppContext, clientPid === pid)
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

      // close session if all clients have disconnected
      if (this.clients.length === 0) {
        // give it some time to tear down
        setTimeout(() => {
          if (this.clients.length === 0) {
            this.session.close()
          }
        }, 1000)
      }
    })
  }
}
