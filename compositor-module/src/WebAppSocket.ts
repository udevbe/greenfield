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

import { SendMessage } from 'westfield-runtime-common'
import { Client } from 'westfield-runtime-server'
import { CompositorWebAppSocket } from './index'
import Session from './Session'

interface WebAppSocketMessage {
  protocolMessage: ArrayBuffer
  meta: Transferable[]
}

function instanceOfWebAppSocketMessage(object: any): object is WebAppSocketMessage {
  return (
    'protocolMessage' in object
    && 'meta' in object
    && object.protocolMessage instanceof ArrayBuffer
    && Array.isArray(object.meta)
  )
}

export default class WebAppSocket implements CompositorWebAppSocket {
  private _session: Session

  static create(session: Session): WebAppSocket {
    return new WebAppSocket(session)
  }

  private constructor(session: Session) {
    this._session = session
  }

  onWebAppWorker(webWorker: Worker): Client {
    // TODO How listen for webWorker terminate/close/destroy?
    // TODO close client connection when worker is terminated

    const client = this._session.display.createClient()

    webWorker.onmessage = event => {
      if (!instanceOfWebAppSocketMessage(event.data)) {
        console.error('[web-worker-connection] client send an illegal message object. Expected ArrayBuffer.')
        client.close()
      }

      const webAppSocketMessage = event.data as WebAppSocketMessage
      const buffer = new Uint32Array(webAppSocketMessage.protocolMessage)
      const fds = webAppSocketMessage.meta.map(transferable => {
        if (transferable instanceof ArrayBuffer) {
          return this._session.webFS.fromArrayBuffer(transferable)
        } else if (transferable instanceof ImageBitmap) {
          return this._session.webFS.fromImageBitmap(transferable)
        } else if (transferable instanceof OffscreenCanvas) {
          return this._session.webFS.fromOffscreenCanvas(transferable)
        }// else if (transferable instanceof MessagePort) {
        // }
        throw new Error(`Unsupported transferable: ${transferable}`)
      })
      client.connection.message({ buffer, fds })
      fds.forEach(fd => fd.close())
    }

    const flushQueue: SendMessage[][] = []
    client.connection.onFlush = async (wireMessages) => {
      flushQueue.push(wireMessages)

      if (flushQueue.length > 1) {
        return
      }

      while (flushQueue.length) {
        const sendWireMessages = flushQueue[0]

        // convert to as single arrayBuffer so it can be send over a data channel using zero copy semantics.
        const messagesSize = sendWireMessages.reduce((previousValue, currentValue) => previousValue + currentValue.buffer.byteLength, 0)

        const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize))
        let offset = 0
        const meta: Transferable[] = []
        for (const wireMessage of sendWireMessages) {
          for (const webFd of wireMessage.fds) {
            const transferable = await webFd.getTransferable()
            meta.push(transferable)
            webFd.close()
          }
          const message = new Uint32Array(wireMessage.buffer)
          sendBuffer.set(message, offset)
          offset += message.length
        }

        webWorker.postMessage({
          protocolMessage: sendBuffer.buffer,
          meta
        }, [sendBuffer.buffer, ...meta])
        flushQueue.shift()
      }
    }

    client.onClose().then(() => {
      this._session.userShell.events.destroyApplicationClient?.({
        id: client.id,
        variant: 'web'
      })
    })
    this._session.userShell.events.createApplicationClient?.({ id: client.id, variant: 'web' })
    return client
  }
}
