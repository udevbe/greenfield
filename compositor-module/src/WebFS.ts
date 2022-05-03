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

export function wrapClientWebFD(client: Client, webFd: WebFD) {
  // TODO check if webFD and webfs api have same origin
  return new GWebFD(client.userData.webfs.api, webFd)
}

export class GWebFD {
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

  async readStream(chunkSize: number): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    if (typeof this.webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    const rawResponse = await this.api.readStreamRaw({ fd: this.webFd.handle, chunkSize })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a webfd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.body?.getReader()
  }

  close(): Promise<void> {
    if (typeof this.webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    return this.api.close({ fd: this.webFd.handle })
  }
}

export class WebFS {
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
    return new GWebFD(this.api, webFD)
  }

  async mkfifo(): Promise<Array<GWebFD>> {
    const pipe: WebFD[] = await this.api.mkfifo()
    return [new GWebFD(this.api, pipe[0]), new GWebFD(this.api, pipe[1])]
  }
}
