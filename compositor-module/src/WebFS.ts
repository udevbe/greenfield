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

export class WebFS {
  private readonly api: WebfsApi

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

  mkstempMmap(data: Blob): Promise<WebFD> {
    return this.api.mkstempMmap({ body: data })
  }

  mkfifo(): Promise<Array<WebFD>> {
    return this.api.mkfifo()
  }

  write(webFd: WebFD, data: Blob): Promise<void> {
    if (typeof webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    return this.api.writeStream({
      fd: webFd.handle,
      body: data,
    })
  }

  read(webFd: WebFD, count: number): Promise<Blob> {
    if (typeof webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    return this.api.read({ fd: webFd.handle, count })
  }

  async readStream(webFd: WebFD, chunkSize: number): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    if (typeof webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    const rawResponse = await this.api.readStreamRaw({ fd: webFd.handle, chunkSize })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a webfd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.body?.getReader()
  }

  close(webFd: WebFD): Promise<void> {
    if (typeof webFd.handle !== 'number') {
      throw new Error('BUG. Only WebFDs with a number handle are currently supported.')
    }

    return this.api.close({ fd: webFd.handle })
  }
}
