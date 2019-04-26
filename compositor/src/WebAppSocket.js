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

'use strict'

export default class WebAppSocket {
  /**
   * @param {Session}session
   * @return {WebAppSocket}
   */
  static create (session) {
    return new WebAppSocket(session)
  }

  /**
   * @param {Session}session
   */
  constructor (session) {
    /**
     * @type {Session}
     */
    this._session = session
  }

  /**
   * @param {Worker}webWorker
   * @return {Client}
   */
  onWebAppWorker (webWorker) {
    // TODO How listen for webWorker terminate/close/destroy?
    // TODO close client connection when worker is terminated

    const client = this._session.display.createClient((sendBuffer) => webWorker.postMessage(sendBuffer, [sendBuffer]))

    /**
     * @param {MessageEvent}event
     */
    webWorker.onmessage = (event) => {
      const webWorkerMessage = /** @type {{protocolMessage:ArrayBuffer, meta:Array<Transferable>}} */event.data
      if (webWorkerMessage.protocolMessage instanceof ArrayBuffer) {
        const buffer = new Uint32Array(/** @type {ArrayBuffer} */webWorkerMessage.protocolMessage)
        const fds = /** @type {Array<WebFD>} */webWorkerMessage.meta.map(transferable => {
          if (transferable instanceof ArrayBuffer) {
            return this._session.webFS.fromArrayBuffer(transferable)
          } else if (transferable instanceof ImageBitmap) {
            return this._session.webFS.fromImageBitmap(transferable)
          }// else if (transferable instanceof MessagePort) {
          // }
          throw new Error(`Unsupported transferable: ${transferable}`)
        })
        client.connection.message({ buffer, fds })
        fds.forEach(fd => fd.close())
      } else {
        console.error(`[web-worker-connection] client send an illegal message object. Expected ArrayBuffer.`)
        client.close()
      }
    }

    /**
     * @type {Array<Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>>}
     * @private
     */
    const flushQueue = []

    /**
     * @param {Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>}wireMessages
     */
    client.connection.onFlush = async (wireMessages) => {
      flushQueue.push(wireMessages)

      if (flushQueue.length > 1) { return }

      while (flushQueue.length) {
        const sendWireMessages = flushQueue[0]

        // convert to as single arrayBuffer so it can be send over a data channel using zero copy semantics.
        const messagesSize = sendWireMessages.reduce((previousValue, currentValue) => previousValue + currentValue.buffer.byteLength, 0)

        const sendBuffer = new Uint32Array(new ArrayBuffer(messagesSize))
        let offset = 0
        const meta = []
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

        webWorker.postMessage({ protocolMessage: sendBuffer.buffer, meta }, [sendBuffer.buffer].concat(meta))
        flushQueue.shift()
      }
    }

    return client
  }
}
