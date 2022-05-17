// Copyright 2020 Erik De Rijcke
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

import { Configuration, WebfsApi } from './api'
import { WebFD } from 'westfield-runtime-common'
import { Client } from 'westfield-runtime-server'

export interface GWebFD {
  webFd: WebFD
  write(data: Blob): Promise<void>
  read(count: number): Promise<Blob>
  readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>>
  readBlob(): Promise<Blob>
  close(): Promise<void>
}

export function wrapClientWebFD(client: Client, webFd: WebFD): GWebFD {
  if (client.userData.webfs instanceof RemoteWebFS) {
    // TODO check if webFD and webfs api have same origin
    return new RemoteWebFD(client.userData.webfs.api, webFd)
  }

  throw new Error('BUG. Unsupported client webfs.')
}

export interface WebFS {
  mkstempMmap(data: Blob): Promise<GWebFD>
  mkfifo(): Promise<Array<GWebFD>>
}

export function createRemoteWebFS(basePath: string, compositorSessionId: string): WebFS {
  return new RemoteWebFS(basePath, compositorSessionId)
}

class RemoteWebFS implements WebFS {
  readonly api: WebfsApi

  constructor(basePath: string, compositorSessionId: string) {
    this.api = new WebfsApi(
      new Configuration({
        basePath,
        headers: {
          ['X-Compositor-Session-Id']: compositorSessionId,
        },
      }),
    )
  }

  async mkstempMmap(data: Blob): Promise<GWebFD> {
    const webFD: WebFD = await this.api.mkstempMmap({ body: data })
    return new RemoteWebFD(this.api, webFD)
  }

  async mkfifo(): Promise<Array<GWebFD>> {
    const pipe: WebFD[] = await this.api.mkfifo()
    return [new RemoteWebFD(this.api, pipe[0]), new RemoteWebFD(this.api, pipe[1])]
  }
}

class RemoteWebFD implements GWebFD {
  constructor(private readonly api: WebfsApi, readonly webFd: WebFD) {}

  write(data: Blob): Promise<void> {
    if (typeof this.webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    return this.api.writeStream({
      fd: this.webFd.handle,
      body: data,
    })
  }

  read(count: number): Promise<Blob> {
    if (typeof this.webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    return this.api.read({ fd: this.webFd.handle, count })
  }

  async readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>> {
    if (typeof this.webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    const rawResponse = await this.api.readStreamRaw({ fd: this.webFd.handle, chunkSize })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a webfd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.body
  }

  async readBlob(): Promise<Blob> {
    if (typeof this.webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    const rawResponse = await this.api.readStreamRaw({ fd: this.webFd.handle })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a webfd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.blob()
  }

  close(): Promise<void> {
    if (typeof this.webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    return this.api.close({ fd: this.webFd.handle })
  }
}

class BrowserPipeWebFD implements GWebFD {
  private readBuffer?: Blob
  constructor(private readonly messageChannel: MessageChannel, private readonly messagePort: MessagePort) {}

  get webFd(): WebFD {
    throw new Error('BUG. Not yet implemented.')
  }

  async close(): Promise<void> {
    await this.write(new Blob([new ArrayBuffer(0)]))
    this.messagePort.close()
  }

  private readFromBuffer(count: number): Blob | undefined {
    if (this.readBuffer && this.readBuffer.size >= count) {
      const readDiff = this.readBuffer.size - count
      if (readDiff === 0) {
        const buffer = this.readBuffer
        this.readBuffer = undefined
        return buffer
      } else {
        const buffer = this.readBuffer.slice(readDiff)
        this.readBuffer = this.readBuffer.slice(0, readDiff)
        return buffer
      }
    }
    return undefined
  }

  private appendBuffer(blob: Blob) {
    if (this.readBuffer) {
      this.readBuffer = new Blob([this.readBuffer, blob])
    } else {
      this.readBuffer = blob
    }
  }

  async read(count: number): Promise<Blob> {
    const bufferResult = this.readFromBuffer(count)
    if (bufferResult) {
      return bufferResult
    }

    return new Promise<Blob>((resolve, reject) => {
      this.messagePort.addEventListener(
        'message',
        (ev) => {
          const eventData = ev.data
          if (eventData instanceof ArrayBuffer) {
            const data = new Blob([eventData])
            this.appendBuffer(data)
            const bufferResult = this.readFromBuffer(count)
            if (bufferResult) {
              resolve(data)
            } else if (data.size === 0) {
              // EOF
              resolve(data)
            }
          } else {
            reject(new Error('Received non blob data.'))
          }
        },
        {
          once: true,
          passive: true,
        },
      )
      this.messagePort.addEventListener(
        'messageerror',
        (ev) => {
          reject(new Error(ev.data))
        },
        {
          once: true,
          passive: true,
        },
      )
      this.messagePort.start()
    })
  }

  readBlob(): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      this.messagePort.addEventListener(
        'message',
        (ev) => {
          const eventData = ev.data
          if (eventData instanceof ArrayBuffer) {
            const data = new Blob([eventData])
            if (data.size === 0) {
              // EOF
              const buffer = this.readBuffer ?? data
              this.readBuffer = undefined
              resolve(buffer)
            } else {
              this.appendBuffer(data)
            }
          } else {
            reject(new Error('Received non ArrayBuffer data.'))
          }
        },
        {
          passive: true,
        },
      )
      this.messagePort.addEventListener('messageerror', (ev) => reject(new Error(ev.data)), {
        once: true,
        passive: true,
      })
      this.messagePort.start()
    })
  }

  async readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>> {
    const blob = await this.readBlob()
    // @ts-ignore
    return blob.stream()
  }

  async write(data: Blob): Promise<void> {
    const messageData = await data.arrayBuffer()
    this.messagePort.postMessage(messageData, [messageData])
  }
}

class BrowserWebFS implements WebFS {
  async mkfifo(): Promise<Array<GWebFD>> {
    const messageChannel = new MessageChannel()
    return [
      new BrowserPipeWebFD(messageChannel, messageChannel.port1),
      new BrowserPipeWebFD(messageChannel, messageChannel.port2),
    ]
  }

  mkstempMmap(data: Blob): Promise<GWebFD> {
    throw new Error('BUG. Not yet implemented.')
  }
}

export const browserWebFS: WebFS = new BrowserWebFS()
