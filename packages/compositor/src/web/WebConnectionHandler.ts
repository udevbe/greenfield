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

import { Client } from '@gfld/compositor-protocol'
import Session from '../Session'
import { webInputOutput } from './WebInputOutput'

type WebAppMessage = [DataView, ...(ArrayBufferView | ImageBitmap | MessagePort)[]]

function instanceOfWebAppMessage(object: any): object is WebAppMessage {
  return Array.isArray(object)
}

export class WebConnectionHandler {
  static create(session: Session): WebConnectionHandler {
    return new WebConnectionHandler(session)
  }

  private constructor(readonly session: Session) {}

  onWebApp(webAppFrame: HTMLIFrameElement, clientId: string, messagePort: MessagePort): Client {
    const client = this.session.display.createClient(clientId)
    client.userData = { inputOutput: webInputOutput }

    messagePort.onmessageerror = (event) => {
      console.log(event)
    }
    messagePort.onmessage = (event) => {
      const webAppMessage = event.data
      try {
        if (instanceOfWebAppMessage(webAppMessage)) {
          const [view, ...fds] = webAppMessage
          client.connection.message({ buffer: new Uint32Array(view.buffer), fds })
        }
      } catch (e: any) {
        console.error(`[web-worker-connection] client send an illegal message object. ${e.message}`)
        client.close()
      }
    }

    client.connection.onFlush = (wireMessages) => {
      // convert to as single arrayBuffer so it can be send over a data channel using zero copy semantics.
      const messagesSize = wireMessages.reduce(
        (previousValue, currentValue) => previousValue + currentValue.buffer.byteLength,
        0,
      )

      const protocolBuffer = new Uint32Array(new ArrayBuffer(messagesSize))
      const sendBuffer: [Uint32Array, ...(ArrayBufferView | ImageBitmap | MessagePort)[]] = [protocolBuffer]
      const transferables: Transferable[] = [protocolBuffer.buffer]

      let offset = 0
      for (const wireMessage of wireMessages) {
        for (const fd of wireMessage.fds) {
          if (ArrayBuffer.isView(fd) && !transferables.includes(fd.buffer)) {
            if (fd.buffer instanceof ArrayBuffer) {
              transferables.push(fd.buffer)
            } /* else it's an instance of SharedArrayBuffer which should not be transferred */
          } else if (fd instanceof ImageBitmap || fd instanceof MessagePort) {
            transferables.push(fd)
          } else {
            throw new Error(`BUG. Unsupported FD`)
          }
          sendBuffer.push(fd)
        }

        const message = new Uint32Array(wireMessage.buffer)
        protocolBuffer.set(message, offset)
        offset += message.length
      }

      messagePort.postMessage(sendBuffer, transferables)
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
