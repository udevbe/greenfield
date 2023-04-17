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
import Session from '../Session'

interface WebAppSocketMessage {
  protocolMessage: ArrayBuffer
  meta: Transferable[]
}

function instanceOfWebAppSocketMessage(object: any): object is WebAppSocketMessage {
  return (
    'protocolMessage' in object &&
    'meta' in object &&
    object.protocolMessage instanceof ArrayBuffer &&
    Array.isArray(object.meta)
  )
}

export class WebConnectionHandler {
  static create(session: Session): WebConnectionHandler {
    return new WebConnectionHandler(session)
  }

  private constructor(readonly session: Session) {}

  onWebApp(webAppFrame: HTMLIFrameElement, clientId: string, messagePort: MessagePort): Client {
    // TODO How listen for webWorker terminate/close/destroy?
    // TODO close client connection when worker is terminated
    const client = this.session.display.createClient(clientId)

    messagePort.onmessage = (event) => {
      if (!instanceOfWebAppSocketMessage(event.data)) {
        console.error('[web-worker-connection] client send an illegal message object. Expected ArrayBuffer.')
        client.close()
      }

      const webAppSocketMessage = event.data as WebAppSocketMessage
      const buffer = new Uint32Array(webAppSocketMessage.protocolMessage)
      client.connection.message({ buffer, fds: webAppSocketMessage.meta })
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
        const messagesSize = sendWireMessages.reduce(
          (previousValue, currentValue) => previousValue + currentValue.buffer.byteLength,
          0,
        )

        const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize))
        let offset = 0
        const meta: Transferable[] = []
        for (const wireMessage of sendWireMessages) {
          for (const fd of wireMessage.fds) {
            meta.push(fd as Transferable)
          }
          const message = new Uint32Array(wireMessage.buffer)
          sendBuffer.set(message, offset)
          offset += message.length
        }

        messagePort.postMessage(
          {
            protocolMessage: sendBuffer.buffer,
            meta,
          },
          [sendBuffer.buffer, ...meta],
        )
        flushQueue.shift()
      }
    }

    client.onClose().then(() => {
      this.session.userShell.events.clientDestroyed?.({
        id: client.id,
      })
    })
    this.session.userShell.events.clientCreated?.({ id: client.id })
    return client
  }
}
