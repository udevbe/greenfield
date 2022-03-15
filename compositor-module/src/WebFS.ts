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

import { WebFD } from 'westfield-runtime-common'
import { Client } from 'westfield-runtime-server'
import { RemoteOutOfBandSendOpcode } from './RemoteOutOfBandChannel'
import Session from './Session'

let webFdRequestSerial = 0
const webFdReplyPromises: Record<number, (value: [WebFD, WebFD] | PromiseLike<[WebFD, WebFD]>) => void> = {}
const webFdTextDecoder = new TextDecoder()

export default class WebFS {
  private _webFDs: { [key: number]: WebFD } = {}
  private _nextFD = 0

  static create(session: Session): WebFS {
    return new WebFS(session)
  }

  private constructor(private readonly session: Session) {}

  fromArrayBuffer(arrayBuffer: ArrayBuffer): WebFD {
    const fd = this._nextFD++
    const type = 'ArrayBuffer'
    // FIXME we want to use reference counting here instead of simply deleting.
    // Sending the WebFD to an endpoint will increase the ref, and we should wait until the endpoint has closed the fd as well.
    // TODO probably lots of other edge cases here as well => write some extensive e2e tests
    const webFdURL = new URL('compositor://')
    webFdURL.searchParams.append('fd', `${fd}`)
    webFdURL.searchParams.append('type', type)
    webFdURL.searchParams.append('compositorSessionId', this.session.compositorSessionId)

    const webFD = new WebFD(
      fd,
      type,
      webFdURL,
      () => Promise.resolve(arrayBuffer),
      () => {
        delete this._webFDs[fd]
      },
    )
    this._webFDs[fd] = webFD
    return webFD
  }

  fromImageBitmap(imageBitmap: ImageBitmap): WebFD {
    const fd = this._nextFD++
    const type = 'ImageBitmap'

    const webFdURL = new URL('compositor://')
    webFdURL.searchParams.append('fd', `${fd}`)
    webFdURL.searchParams.append('type', type)
    webFdURL.searchParams.append('compositorSessionId', this.session.compositorSessionId)

    const webFD = new WebFD(
      fd,
      'ImageBitmap',
      webFdURL,
      () => Promise.resolve(imageBitmap),
      () => {
        delete this._webFDs[fd]
      },
    )
    this._webFDs[fd] = webFD
    return webFD
  }

  // TODO fromMessagePort

  getWebFD(fd: number): WebFD {
    return this._webFDs[fd]
  }

  /**
   * Allocates a pipe on the remote proxy and returns the read & write end as a WebFD
   * @param client the connection to the remote proxy
   */
  createProxyPipeWebFD(client: Client): Promise<[WebFD, WebFD]> {
    this.session
      .getRemoteClientConnection(client)
      // TODO implement this call in compositor-proxy
      .remoteOutOfBandChannel.send(
        RemoteOutOfBandSendOpcode.CreatePipeWebFdsRequest,
        new Uint32Array([webFdRequestSerial++]).buffer,
      )

    return new Promise<[WebFD, WebFD]>((resolve) => (webFdReplyPromises[webFdRequestSerial] = resolve))
  }

  handleProxyPipeWebFDsReply(message: Uint8Array): void {
    // parse read & write webfds
    let offset = 0
    const webFdReplySerial = new Uint32Array(message.buffer, message.byteOffset, 1)[0]
    offset += Uint32Array.BYTES_PER_ELEMENT

    const readLength = new Uint32Array(message.buffer, message.byteOffset + offset, 1)[0]
    offset += Uint32Array.BYTES_PER_ELEMENT
    const readURLText = webFdTextDecoder.decode(new Uint8Array(message.buffer, message.byteOffset + offset, readLength))
    offset += readLength

    const writeLength = new Uint32Array(message.buffer, message.byteOffset + offset, 1)[0]
    offset += Uint32Array.BYTES_PER_ELEMENT
    const writeURLText = webFdTextDecoder.decode(
      new Uint8Array(message.buffer, message.byteOffset + offset, writeLength),
    )

    // read
    const readURL = new URL(readURLText)
    const readFDParam = readURL.searchParams.get('fd')
    if (readFDParam === null) {
      throw new Error('BUG. WebFD URL does not have fd query param.')
    }
    const readFd = Number.parseInt(readFDParam)
    const readType = readURL.searchParams.get('type')

    if (readType !== 'MessagePort') {
      throw new Error('BUG. pipe WebFD is not of type MessagePort.')
    }

    // write
    const writeURL = new URL(writeURLText)
    const writeFDParam = writeURL.searchParams.get('fd')
    if (writeFDParam === null) {
      throw new Error('BUG. WebFD URL does not have fd query param.')
    }
    const writeFd = Number.parseInt(writeFDParam)
    const writeType = readURL.searchParams.get('type')

    if (writeType !== 'MessagePort') {
      throw new Error('BUG. pipe WebFD is not of type MessagePort.')
    }

    const resolve = webFdReplyPromises[webFdReplySerial]
    delete webFdReplyPromises[webFdRequestSerial]

    resolve([
      new WebFD(
        readFd,
        readType,
        readURL,
        () => {
          throw new Error('NOT YET IMPLEMENTED. This pipe WebFD should not be read yet.')
        },
        () => {
          throw new Error('NOT YET IMPLEMENTED. This pipe WebFD should not be closed yet.')
        },
      ),
      new WebFD(
        writeFd,
        writeType,
        writeURL,
        () => {
          throw new Error('NOT YET IMPLEMENTED. This pipe WebFD should not be read yet.')
        },
        () => {
          throw new Error('NOT YET IMPLEMENTED. This pipe WebFD should not be closed yet.')
        },
      ),
    ])
  }

  /**
   * Notify the given callback of read events (length, remaining etc. sans actual data), happening remotely.
   * @param webFD
   */
  readAndNotify(webFD: WebFD, client: Client) {
    // this.session
    //   .getRemoteClientConnection(client)
    //   // TODO implement this call in compositor-proxy
    //   .remoteOutOfBandChannel.send(
    //     RemoteOutOfBandSendOpcode.ReadWebFDAndNotify,
    //     // TODO serialize webfd
    //     // TODO handle this request
    //     new Uint32Array([webFdRequestSerial++, webFD]).buffer,
    //   )
  }
}
