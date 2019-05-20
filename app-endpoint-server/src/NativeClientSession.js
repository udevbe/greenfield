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

const { TextEncoder, TextDecoder } = require('util')
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

const { Endpoint, MessageInterceptor } = require('westfield-endpoint')
// eslint-disable-next-line camelcase
const wl_display_interceptor = require('./protocol/wl_display_interceptor')
// eslint-disable-next-line camelcase
const wl_buffer_interceptor = require('./protocol/wl_buffer_interceptor')
const WebSocket = require('ws')

const config = require('../config.json5')

class NativeClientSession {
  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {WebSocketChannel}webSocketChannel
   * @returns {NativeClientSession}
   */
  static create (wlClient, nativeCompositorSession, webSocketChannel) {
    const messageInterceptor = MessageInterceptor.create(wlClient, nativeCompositorSession.wlDisplay, wl_display_interceptor, { communicationChannel: webSocketChannel })

    const { protocol, hostname, port } = config.serverConfig.httpServer
    const localWebFDBaseURL = new URL(`${protocol}//${hostname}:${port}`)
    localWebFDBaseURL.searchParams.append('compositorSessionId', nativeCompositorSession.compositorSessionId)

    const nativeClientSession = new NativeClientSession(wlClient, nativeCompositorSession, webSocketChannel, messageInterceptor, localWebFDBaseURL)
    nativeClientSession.onDestroy().then(() => {
      if (webSocketChannel.readyState === 1 || webSocketChannel.readyState === 0) {
        webSocketChannel.onerror = null
        webSocketChannel.onclose = null
        webSocketChannel.onmessage = null
        webSocketChannel.close()
      }
    })

    Endpoint.setClientDestroyedCallback(wlClient, () => {
      if (nativeClientSession._destroyResolve) {
        nativeClientSession._destroyResolve()
        nativeClientSession._destroyResolve = null
        nativeClientSession.wlClient = null
      }
    })
    Endpoint.setRegistryCreatedCallback(wlClient, (wlRegistry, registryId) => nativeClientSession._onRegistryCreated(wlRegistry, registryId))
    Endpoint.setWireMessageCallback(wlClient, (wlClient, message, objectId, opcode) => nativeClientSession._onWireMessageRequest(wlClient, message, objectId, opcode))
    Endpoint.setWireMessageEndCallback(wlClient, (wlClient, fdsIn) => nativeClientSession._onWireMessageEnd(wlClient, fdsIn))

    Endpoint.setBufferCreatedCallback(wlClient, (bufferId) => {
      // eslint-disable-next-line new-cap
      messageInterceptor.interceptors[bufferId] = new wl_buffer_interceptor(wlClient, messageInterceptor.interceptors, 1, null, null)
      // send buffer creation notification. opcode: 2
      webSocketChannel.send(new Uint32Array([2, bufferId]).buffer)
    })

    webSocketChannel.onerror = () => nativeClientSession.destroy()
    webSocketChannel.onclose = event => nativeClientSession._onClose(event)
    webSocketChannel.onmessage = event => nativeClientSession._onMessage(event)

    webSocketChannel.onopen = () => {
      webSocketChannel.onerror = event => nativeClientSession._onError(event)
      // flush out any requests that came in while we were waiting for the data channel to open.
      process.env.DEBUG && console.log(`[app-endpoint-${nativeCompositorSession.compositorSessionId}] Native client session: communication channel to browser is open.`)
      nativeClientSession._flushOutboundMessage()
    }

    return nativeClientSession
  }

  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {WebSocketChannel}webSocketChannel
   * @param {MessageInterceptor}messageInterceptor
   * @param {URL}localWebFDBaseURL
   */
  constructor (wlClient, nativeCompositorSession, webSocketChannel, messageInterceptor, localWebFDBaseURL) {
    /**
     * @type {Object}
     */
    this.wlClient = wlClient
    /**
     * @type {NativeCompositorSession}
     * @private
     */
    this._nativeCompositorSession = nativeCompositorSession
    /**
     * @type {function():void}
     * @private
     */
    this._destroyResolve = null
    /**
     * @type {Promise<void>}
     * @private
     */
    this._destroyPromise = new Promise(resolve => { this._destroyResolve = resolve })
    /**
     * @type {Array<Uint32Array>}
     * @private
     */
    this._pendingWireMessages = []
    /**
     * @type {number}
     * @private
     */
    this._pendingMessageBufferSize = 0
    /**
     * @type {Array<ArrayBuffer>}
     * @private
     */
    this._outboundMessages = []
    /**
     * @type {Array<Uint32Array>}
     * @private
     */
    this._inboundMessages = []
    /**
     * @type {MessageInterceptor}
     * @private
     */
    this._messageInterceptor = messageInterceptor
    /**
     * @type {URL}
     * @private
     */
    this._localWebFDBaseURL = localWebFDBaseURL
    /**
     * @type {Object.<number, Object>}
     * @private
     */
    this._wlRegistries = {}
    /**
     * @type {WebSocketChannel}
     * @private
     */
    this._webSocketChannel = webSocketChannel
    /**
     * @type {boolean}
     * @private
     */
    this._disconnecting = false

    this._browserChannelOutOfBandHandlers = {
      // listen for out-of-band resource destroy. opcode: 1
      1: payload => this._destroyResourceSilently(payload),
      // listen for file contents request. opcode: 4
      4: payload => this._handleWebFDContentTransferReply(payload)
    }
    /**
     * @type {Object.<string, {resolve: function(data:Uint8Array):void}>}
     * @private
     */
    this._webFDTransferRequests = {}
  }

  /**
   * @param {Uint32Array}sourceBuf
   * @return {{webFdURL:URL, bytesRead: number}}webFdURL
   * @private
   */
  _deserializeWebFdURL (sourceBuf) {
    const webFDByteLength = sourceBuf[0]
    const fdURLUint8Array = new Uint8Array(sourceBuf.buffer, sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT, webFDByteLength)
    const fdURLString = textDecoder.decode(fdURLUint8Array)
    const webFdURL = new URL(fdURLString)
    // sort so we can do string comparison of urls
    webFdURL.searchParams.sort()

    const alignedWebFDBytesLength = (webFDByteLength + 3) & ~3
    return { webFdURL, bytesRead: alignedWebFDBytesLength + Uint32Array.BYTES_PER_ELEMENT }
  }

  /**
   * Delegates messages from the browser compositor to it's native counterpart.
   * This method is async as transferring the contents of file descriptors might take some time
   * @param {Uint32Array}receiveBuffer
   * @private
   */
  async _onWireMessageEvents (receiveBuffer) {
    if (this._inboundMessages.push(receiveBuffer) > 1) { return }

    while (this._inboundMessages.length) {
      const inboundMessage = this._inboundMessages[0]

      let readOffset = 0
      let localGlobalsEmitted = false
      while (readOffset < inboundMessage.length) {
        const fdsCount = inboundMessage[readOffset++]
        /** @type {Array<URL>} */
        const webFdURLs = []
        for (let i = 0; i < fdsCount; i++) {
          const { webFdURL, bytesRead } = this._deserializeWebFdURL(inboundMessage.subarray(readOffset))
          webFdURLs.push(webFdURL)
          readOffset += (bytesRead / Uint32Array.BYTES_PER_ELEMENT)
        }

        const sizeOpcode = inboundMessage[readOffset + 1]
        const size = sizeOpcode >>> 16

        const length = size / Uint32Array.BYTES_PER_ELEMENT
        const messageBuffer = inboundMessage.subarray(readOffset, readOffset + length)
        readOffset += length

        if (!localGlobalsEmitted) {
          // check if browser compositor is emitting globals, if so, emit the local globals as well.
          localGlobalsEmitted = this._emitLocalGlobals(messageBuffer)
        }

        const fdsBuffer = new Uint32Array(fdsCount)
        for (let i = 0; i < webFdURLs.length; i++) {
          const webFdURL = webFdURLs[i]

          if (webFdURL.host === this._localWebFDBaseURL.host &&
            webFdURL.searchParams.get('compositorSessionId') === this._nativeCompositorSession.compositorSessionId) {
            // the fd originally came from this process, which means we can just use it as is.
            fdsBuffer[i] = Number.parseInt(webFdURL.searchParams.get('fd'))
          } else {
            // foreign fd.
            // the fd comes from a different host. In case of shm, we need to create local shm and
            // transfer the contents of the remote fd. In case of pipe, we need to create a local pipe and transfer
            // the contents on-demand.
            fdsBuffer[i] = await this._handleForeignWebFdURL(webFdURL)
          }
        }
        Endpoint.sendEvents(this.wlClient, messageBuffer, fdsBuffer)
      }
      Endpoint.flush(this.wlClient)

      this._inboundMessages.shift()
    }
  }

  /**
   * @param {number}fd
   * @param {string}type
   * @return {URL}
   * @private
   */
  _createLocalWebFDURL (fd, type) {
    const localWebFDURL = new URL(this._localWebFDBaseURL.href)
    localWebFDURL.searchParams.append('fd', `${fd}`)
    localWebFDURL.searchParams.append('type', type)
    localWebFDURL.searchParams.sort()
    return localWebFDURL
  }

  /**
   * Creates a local fd that matches the content & behavior of the foreign webfd
   * @param {URL}webFdURL
   * @return {Promise<number>}
   * @private
   */
  async _handleForeignWebFdURL (webFdURL) {
    /** @type {WebSocket} */
    let fdTransferWebSocket
    if (webFdURL.protocol === 'compositor:' &&
      this._nativeCompositorSession.compositorSessionId === webFdURL.searchParams.get('compositorSessionId')) {
      // If the fd originated from the compositor, we can reuse the existing websocket connection to transfer the fd contents
      fdTransferWebSocket = this._webSocketChannel.webSocket
    } else if (webFdURL.protocol.startsWith('ws')) {
      // TODO currently unsupported => need this once we properly implement c/p & dnd functionality
      // fd came from another endpoint, establish a new communication channel
      fdTransferWebSocket = this._createFdTransferWebSocket(webFdURL)
      fdTransferWebSocket.onmessage = event => this._onMessage(event)
    } else {
      // TODO unsupported websocket url
      console.error(`[app-endpoint-session: ${this._nativeCompositorSession.compositorSessionId}] - Unsupported websocket URL ${webFdURL.href}.`)
    }

    let localFD = -1
    const webFdType = webFdURL.searchParams.get('type')
    if (webFdType === 'ArrayBuffer') {
      localFD = await this._handleForeignWebFDShm(fdTransferWebSocket, webFdURL)
    } else if (webFdType === 'MessagePort') {
      // because we can't distinguish between read or write end of a pipe, we always assume read-end of pipe here (as per c/p & DnD use-case in wayland protocol)
      // TODO currently unsupported => need this once we properly implement c/p & dnd functionality
      localFD = await this._handleForeignWebFDPipe(fdTransferWebSocket, webFdURL)
    }

    return localFD
  }

  /**
   * @param {WebSocket}fdTransferWebSocket
   * @param {URL}webFdURL
   * @return {Promise<number>}
   * @private
   */
  async _handleForeignWebFDShm (fdTransferWebSocket, webFdURL) {
    return new Promise((resolve, reject) => {
      // register listener for incoming content on com chanel
      this._webFDTransferRequests[webFdURL.href] = { resolve }
      // request file contents. opcode: 4
      const fd = Number.parseInt(webFdURL.searchParams.get('fd'))
      fdTransferWebSocket.send(new Uint32Array([4, fd]).buffer)
    }).then(/** @type{Uint8Array} */ uint8Array =>
      Endpoint.createMemoryMappedFile(Buffer.from(uint8Array.buffer, uint8Array.byteOffset))
    )
  }

  async _handleForeignWebFDPipe (fdCommunicationChannel, webFdURL) {
    return new Promise((resolve, reject) => {
      // register listener for incoming content on com chanel
      this._webFDTransferRequests[webFdURL.href] = resolve
      // TODO send message over com channel with fd as argument to receive all content
      const fd = Number.parseInt(webFdURL.searchParams.get('fd'))
      fdCommunicationChannel.send(new Uint32Array([4, fd]).buffer)
    }).then((/** @type{Uint8Array} */contents) => {
      // TODO send message over com channel with fd as argument to send all data received on read end of remote pipe fd
      // TODO create new local pipe
      // TODO listen for incoming content on com channel
      // TODO write to write end of local pipe
      // TODO return read end of local pipe
    })
  }

  /**
   * @param {Uint8Array}payload
   * @private
   */
  _handleWebFDContentTransferReply (payload) {
    // payload = fdURLByteSize (4 bytes) + fdURL (aligned to 4 bytes) + contents
    const { webFdURL, bytesRead } = this._deserializeWebFdURL(payload)
    const webFDTransfer = this._webFDTransferRequests[webFdURL]
    delete this._webFDTransferRequests[webFdURL]
    webFDTransfer.resolve(payload.subarray(bytesRead))
  }

  /**
   * @param {URL}webFdURL
   * @return {WebSocket}
   * @private
   */
  _createFdTransferWebSocket (webFdURL) {
    // TODO enable compression
    return new WebSocket(webFdURL)
  }

  _flushOutboundMessage () {
    while (this._outboundMessages.length) {
      this._webSocketChannel.send(this._outboundMessages.shift())
    }
  }

  /**
   * @param {Uint32Array}wireMessageBuffer
   * @returns {boolean}
   * @private
   */
  _emitLocalGlobals (wireMessageBuffer) {
    const id = wireMessageBuffer[0]
    const wlRegistry = this._wlRegistries[id]
    if (wlRegistry) {
      const sizeOpcode = wireMessageBuffer[1]
      const messageOpcode = sizeOpcode & 0x0000FFFF
      const globalOpcode = 0
      if (messageOpcode === globalOpcode) {
        Endpoint.emitGlobals(wlRegistry)
        return true
      }
    }
    return false
  }

  /**
   * @param {Object}wlClient
   * @param {ArrayBuffer}message
   * @param {number}objectId
   * @param {number}opcode
   * @returns {number}
   * @private
   */
  _onWireMessageRequest (wlClient, message, objectId, opcode) {
    if (this._disconnecting) {
      return 0
    }
    try {
      const receiveBuffer = new Uint32Array(message)
      const sizeOpcode = receiveBuffer[1]
      const size = sizeOpcode >>> 16

      /**
       * @type {{consumed: number, fds: Array, bufferOffset: number, size: number, buffer: ArrayBuffer}}
       */
      const interceptedMessage = { buffer: message, fds: [], bufferOffset: 8, consumed: 0, size: size }
      const destination = this._messageInterceptor.interceptRequest(objectId, opcode, interceptedMessage)
      if (destination === 1) {
      } else {
        const interceptedBuffer = new Uint32Array(interceptedMessage.buffer)
        this._pendingMessageBufferSize += interceptedBuffer.length
        this._pendingWireMessages.push(interceptedBuffer)
      }

      // destination: 0 => browser only,  1 => native only, 2 => both
      return destination
    } catch (e) {
      console.log(e.stack)
      process.exit(-1)
    }
  }

  /**
   * @param {Object}wlClient
   * @param {ArrayBuffer}fdsInWithType
   */
  _onWireMessageEnd (wlClient, fdsInWithType) {
    let nroFds = 0
    let fdsIntBufferSize = 1 // start with one because we start with the number of webfds specified
    /** @type {Array<Uint8Array>} */const serializedWebFDs = new Array(nroFds)
    if (fdsInWithType) {
      nroFds = fdsInWithType.byteLength / (Uint32Array.BYTES_PER_ELEMENT * 2) // fd + type (shm or pipe) = 2
      for (let i = 0; i < nroFds; i++) {
        // TODO keep track of (web)fd in case another host wants to get it's content or issues an fd close
        const fd = fdsInWithType[i * 2]
        const fdType = fdsInWithType[(i * 2) + 1]

        const serializedWebFD = this._serializeWebFD(fd, fdType)
        serializedWebFDs[i] = serializedWebFD
        // align webfdurl size to 32bits
        fdsIntBufferSize += (1 + ((serializedWebFD.byteLength + 3) & ~3) / 4)
      }
    }

    const sendBuffer = new Uint32Array(1 + fdsIntBufferSize + this._pendingMessageBufferSize)
    let offset = 0
    sendBuffer[offset++] = 0 // disable out-of-band
    sendBuffer[offset++] = nroFds
    serializedWebFDs.forEach(serializedWebFD => {
      sendBuffer[offset++] = serializedWebFD.byteLength
      sendBuffer.set(serializedWebFD, offset)
      // align offset to 32bits
      offset += ((serializedWebFD.byteLength + 3) & ~3) / 4
    })

    this._pendingWireMessages.forEach(pendingWireMessage => {
      sendBuffer.set(pendingWireMessage, offset)
      offset += pendingWireMessage.length
    })

    if (this._webSocketChannel.readyState === 1) { // 1 === 'open'
      this._webSocketChannel.send(sendBuffer.buffer)
    } else {
      // queue up data until the channel is open
      this._outboundMessages.push(sendBuffer.buffer)
    }

    this._pendingMessageBufferSize = 0
    this._pendingWireMessages = []
  }

  /**
   * @param {number}fd
   * @param {number}fdType
   * @return {Uint8Array}
   * @private
   */
  _serializeWebFD (fd, fdType) {
    let type
    switch (fdType) {
      case 1:
        type = 'ArrayBuffer'
        break
      case 2:
        type = 'MessageChannel'
        break
      default:
        type = 'unsupported'
    }

    const webFdURL = this._createLocalWebFDURL(fd, type)
    return textEncoder.encode(webFdURL.href)
  }

  /**
   * @returns {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    if (this._destroyResolve) {
      this._destroyResolve()
      this._destroyResolve = null
      Endpoint.destroyClient(this.wlClient)
      this.wlClient = null
    }
  }

  /**
   * @param {number}clientId
   */
  requestWebSocket (clientId) {
    this._webSocketChannel.send(Uint32Array.from([5, clientId]).buffer)
  }

  /**
   * @param {MessageEvent}event
   * @private
   */
  _onMessage (event) {
    if (!this.wlClient) { return }

    const receiveBuffer = /** @type {ArrayBuffer} */event.data
    const outOfBandOpcode = new Uint32Array(receiveBuffer, 0, 1)[0]
    if (outOfBandOpcode) {
      this._browserChannelOutOfBandHandlers[outOfBandOpcode](new Uint8Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT))
    } else {
      this._onWireMessageEvents(new Uint32Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT))
    }
  }

  /**
   * @param {Uint8Array}payload
   * @private
   */
  _destroyResourceSilently (payload) {
    const deleteObjectId = new Uint32Array(payload.buffer, payload.byteOffset, 1)[0]
    Endpoint.destroyWlResourceSilently(this.wlClient, deleteObjectId)
    delete this._messageInterceptor.interceptors[deleteObjectId]
    if (deleteObjectId === 1) {
      // 1 is the display id, which means client is being disconnected
      this._disconnecting = true
    }
  }

  /**
   * @param {ErrorEvent}event
   * @private
   */
  _onError (event) {
    // TODO log error
    process.env.DEBUG && console.log(`[app-endpoint-session: ${this._nativeCompositorSession.compositorSessionId}] - Native client session: communication channel is in error ${JSON.stringify(event.error)}.`)
  }

  /**
   * @param {Event}event
   * @private
   */
  _onClose (event) {
    process.env.DEBUG && console.log(`[app-endpoint-session: ${this._nativeCompositorSession.compositorSessionId}] - Native client session: communication channel is closed.`)
    this.destroy()
  }

  /**
   * @param {Object}wlRegistry
   * @param {number}registryId
   * @private
   */
  _onRegistryCreated (wlRegistry, registryId) {
    this._wlRegistries[registryId] = wlRegistry
  }
}

module.exports = NativeClientSession
