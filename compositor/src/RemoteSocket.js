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

import RemoteOutOfBandChannel from './RemoteOutOfBandChannel'
import StreamingBuffer from './remotestreaming/StreamingBuffer'
import WlBufferResource from './protocol/WlBufferResource'
import { WebFD } from 'westfield-runtime-common'

class RemoteSocket {
  /**
   *
   * @param {Session}session
   * @returns {RemoteSocket}
   */
  static create (session) {
    return new RemoteSocket(session)
  }

  constructor (session) {
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {TextEncoder}
     * @private
     */
    this._textEncoder = new window.TextEncoder()
    /**
     * @type {TextDecoder}
     * @private
     */
    this._textDecoder = new window.TextDecoder()
  }

  /**
   * @param {WebFD}webFD
   * @return {Promise<ArrayBuffer>}
   * @private
   */
  async _getShmTransferable (webFD) {
    // TODO get all contents at once from remote endpoint and put it in an array buffer
    // TODO do this on each invocation
    // return new ArrayBuffer(0)

    throw new Error('shm transferable from endpoint not yet implemented.')
  }

  /**
   * @param {WebFD}webFD
   * @return {Promise<void>}
   * @private
   */
  async _closeShmTransferable (webFD) {
    // TODO signal the remote end (if any) that it should close the fd
    throw new Error('close shm transferable from endpoint not yet implemented.')
  }

  /**
   * @param {WebFD}webFD
   * @return {Promise<MessagePort>}
   * @private
   */
  async _getPipeTransferable (webFD) {
    // TODO setup an open connection with the remote endpoint and transfer data on demand
    // const messageChannel = new MessageChannel()
    // TODO use port1 to interface with the remote endpoint
    // TODO only do this once until the messageChannel is closed
    // return messageChannel.port2

    throw new Error('pipe transferable from endpoint not yet implemented.')
  }

  /**
   * @param {WebFD}webFD
   * @return {Promise<void>}
   * @private
   */
  async _closePipeTransferable (webFD) {
    // TODO signal the remote end (if any) that it should close the fd
    // TODO close the messageChannel object

    throw new Error('close pipe transferable from endpoint not yet implemented.')
  }

  /**
   * @param {WebSocket}webSocket
   */
  onWebSocket (webSocket) {
    DEBUG && console.log(`[WebSocket] - created.`)

    webSocket.binaryType = 'arraybuffer'
    webSocket.onopen = () => {
      DEBUG && console.log(`[WebSocket] - open.`)

      const client = this._session.display.createClient()
      client.onClose().then(() => DEBUG && console.log(`[client] - closed.`))

      webSocket.onclose = () => {
        DEBUG && console.log(`[WebSocket] - closed.`)
        client.close()
      }
      webSocket.onerror = event => DEBUG && console.log(`[WebSocket] - error: ${event.message}.`)

      /**
       * @param {Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>}wireMessages
       */
      client.connection.onFlush = (wireMessages) => this._flushWireMessages(client, webSocket, wireMessages)

      const wsOutOfBandChannel = RemoteOutOfBandChannel.create(sendBuffer => {
        try {
          webSocket.send(sendBuffer)
        } catch (e) {
          console.log(e.message)
          client.close()
        }
      })
      this._setupClientOutOfBandHandlers(webSocket, client, wsOutOfBandChannel)

      webSocket.onmessage = event => this._handleMessageEvent(client, event, wsOutOfBandChannel)
    }
  }

  /**
   * @param {WebSocket}webSocket
   * @param {Client}client
   * @param {RemoteOutOfBandChannel}wsOutOfBandChannel
   * @private
   */
  _setupClientOutOfBandHandlers (webSocket, client, wsOutOfBandChannel) {
    // send out-of-band resource destroy. opcode: 1
    client.addResourceDestroyListener(resource => wsOutOfBandChannel.send(1, new Uint32Array([resource.id]).buffer))

    // listen for buffer creation. opcode: 2
    wsOutOfBandChannel.setListener(2, message => {
      const wlBufferResource = new WlBufferResource(client, new Uint32Array(message)[0], 1)
      wlBufferResource.implementation = StreamingBuffer.create(wlBufferResource)
    })

    // listen for buffer contents arriving. opcode: 3
    wsOutOfBandChannel.setListener(3, outOfBandMessage => {
      const bufferContentsDataView = new DataView(outOfBandMessage)
      const bufferId = bufferContentsDataView.getUint32(0, true)
      const wlBufferResource = client.connection.wlObjects[bufferId]
      const streamingBuffer = wlBufferResource.implementation

      const bufferContents = new Uint8Array(outOfBandMessage, 4)
      streamingBuffer.bufferStream.onBufferContents(bufferContents)
    })

    // listen for file contents request. opcode: 4
    wsOutOfBandChannel.setListener(4, async arrayBuffer => {
      const uint32Array = new Uint32Array(arrayBuffer)
      const fd = uint32Array[0]
      const webFD = this._session.webFS.getWebFD(fd)
      const transferable = await webFD.getTransferable()
      // FIXME after contents have been transmitted, endpoint should send a webfd close(?)
      if (transferable instanceof ArrayBuffer) {
        const serializedWebFdURL = this._textEncoder.encode(webFD.url.href)
        const webFDByteLength = serializedWebFdURL.byteLength
        const message = new Uint8Array(Uint32Array.BYTES_PER_ELEMENT + webFDByteLength + transferable.byteLength) // webFdURL + fileContents
        let byteOffset = 0
        // web fd url length
        new DataView(message.buffer).setUint32(byteOffset, webFDByteLength, true)
        byteOffset += Uint32Array.BYTES_PER_ELEMENT
        // web fd url
        message.set(serializedWebFdURL, byteOffset)
        byteOffset += (webFDByteLength + 3) & ~3
        // fd contents
        message.set(new Uint8Array(transferable), byteOffset)

        // send back file contents. opcode: 4
        wsOutOfBandChannel.send(4, message.buffer)
      } // TODO else error out?
    })

    // listen for web socket creation request. opcode: 5
    wsOutOfBandChannel.setListener(5, arrayBuffer => {
      const uint32Array = new Uint32Array(arrayBuffer)
      const clientId = uint32Array[0]

      const webSocketURL = new URL(webSocket.url)
      webSocketURL.searchParams.append('clientId', `${clientId}`)

      const newWebSocket = new window.WebSocket(webSocketURL)
      this.onWebSocket(newWebSocket)
    })
  }

  /**
   * @param {Client}client
   * @param {MessageEvent}event
   * @param {RemoteOutOfBandChannel}wsOutOfBandChannel
   * @private
   */
  _handleMessageEvent (client, event, wsOutOfBandChannel) {
    const arrayBuffer = /** @type {ArrayBuffer} */event.data
    const dataView = new DataView(arrayBuffer)
    const outOfBand = dataView.getUint32(0, true)
    if (outOfBand) {
      wsOutOfBandChannel.message(arrayBuffer)
    } else {
      let offset = 0
      const receiveBuffer = new Uint32Array(arrayBuffer, Uint32Array.BYTES_PER_ELEMENT)
      const fdsInCount = receiveBuffer[offset++]
      const webFDs = new Array(fdsInCount)
      for (let i = 0; i < fdsInCount.length; i++) {
        const { read, webFd } = this._deserializeWebFD(receiveBuffer.subarray(offset))
        offset += read
        webFDs[i] = webFd
      }
      const buffer = receiveBuffer.subarray(offset)
      client.connection.message({ buffer, fds: webFDs })
    }
  }

  /**
   * @param {Client}client
   * @param {WebSocket}webSocket
   * @param {Array<{buffer: ArrayBuffer, fds: Array<WebFD>}>}wireMessages
   * @private
   */
  _flushWireMessages (client, webSocket, wireMessages) {
    let messageSize = 1 // +1 for indicator of it's an out of band message
    /**
     * @type {Array<{buffer: ArrayBuffer, serializedWebFds: Array<Uint8Array>}>}
     */
    const serializedWireMessages = wireMessages.map(/** @type {{buffer: ArrayBuffer, fds: Array<WebFD>}} */ wireMessage => {
      let size = 1 // +1 for fd length
      const serializedWebFds = wireMessage.fds.map(webFd => {
        const serializedWebFD = this._textEncoder.encode(webFd.url.href)
        size += 1 + (((serializedWebFD.byteLength + 3) & ~3) / 4) // +1 for fd url length
        return serializedWebFD
      })

      messageSize += (size + (wireMessage.buffer.byteLength / 4))

      return {
        buffer: wireMessage.buffer,
        serializedWebFds
      }
    })

    const sendBuffer = new Uint32Array(messageSize)
    let offset = 0
    sendBuffer[offset++] = 0 // no out-of-band opcode

    serializedWireMessages.forEach(serializedWireMessage => {
      sendBuffer[offset++] = serializedWireMessage.serializedWebFds.length
      serializedWireMessage.serializedWebFds.forEach(serializedWebFd => {
        sendBuffer[offset++] = serializedWebFd.byteLength
        new Uint8Array(sendBuffer.buffer, sendBuffer.byteOffset + (offset * Uint32Array.BYTES_PER_ELEMENT)).set(serializedWebFd)
        offset += ((serializedWebFd.byteLength + 3) & ~3) / 4
      })

      const message = new Uint32Array(serializedWireMessage.buffer)
      sendBuffer.set(message, offset)
      offset += message.length
    })

    if (webSocket.readyState === 1) { // 1 === 'open'
      try {
        webSocket.send(sendBuffer.buffer)
      } catch (e) {
        console.log(e.message)
        client.close()
      }
    }
  }

  /**
   * @param {Uint32Array}sourceBuf
   * @return {{read:number,webFd: WebFD}}
   * @private
   */
  _deserializeWebFD (sourceBuf) {
    // FIXME we only need to handle fetching remote contents if the webfd does not match this compositor
    // If it does match, we simply need to lookup the WebFD from our own WebFS cache, and return that one instead.
    const webFdbyteLength = sourceBuf[0]
    const webFdBytes = new Uint8Array(sourceBuf.buffer, sourceBuf.byteOffset, webFdbyteLength)

    const webFdURL = new URL(this._textDecoder.decode(webFdBytes))
    const fd = Number.parseInt(webFdURL.searchParams.get('fd'))
    const type = webFdURL.searchParams.get('type')

    let fdType
    let onGetTransferable
    let onClose
    switch (type) {
      case 'ArrayBuffer':
        onGetTransferable = (webFD) => this._getShmTransferable(webFD)
        onClose = (webFD) => this._closeShmTransferable(webFD)
        break
      case 'MessagePort':
        onGetTransferable = (webFD) => this._getPipeTransferable(webFD)
        onClose = (webFD) => this._closePipeTransferable(webFD)
        break
      // case 3: 'ImageBitmap' can not be transferred to a remote
      default:
        fdType = 'unsupported'
        onGetTransferable = () => { throw new Error('unsupported fd type') }
        onClose = () => { throw new Error('unsupported fd type') }
    }
    return {
      read: ((webFdbyteLength.byteLength + 3) & ~3) / 4,
      webFd: new WebFD(fd, fdType, webFdURL, onGetTransferable, onClose)
    }
  }
}

export default RemoteSocket
