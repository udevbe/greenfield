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

const Logger = require('pino')

const { Endpoint, MessageInterceptor } = require('westfield-endpoint')
// eslint-disable-next-line camelcase
const wl_display_interceptor = require('./protocol/wl_display_interceptor')
// eslint-disable-next-line camelcase
const wl_buffer_interceptor = require('./protocol/wl_buffer_interceptor')

class NativeClientSession {
  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {WebSocketChannel}webSocketChannel
   * @returns {NativeClientSession}
   */
  static create (wlClient, nativeCompositorSession, webSocketChannel) {
    const logger = Logger({
      name: `app-endpoint-session::${nativeCompositorSession.compositorSessionId}::native-client-session`,
      prettyPrint: (process.env.DEBUG && process.env.DEBUG == true)
    })

    const messageInterceptor = MessageInterceptor.create(wlClient, nativeCompositorSession.wlDisplay, wl_display_interceptor, { communicationChannel: webSocketChannel })

    const nativeClientSession = new NativeClientSession(logger, wlClient, nativeCompositorSession, webSocketChannel, messageInterceptor)
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
      logger.info(`Web socket to browser is open.`)
      nativeClientSession._flushOutboundMessageOnOpen()
    }

    nativeClientSession._allocateBrowserServerObjectIdsBatch()

    return nativeClientSession
  }

  /**
   * @param logger
   * @param {Object}wlClient
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {WebSocketChannel}webSocketChannel
   * @param {MessageInterceptor}messageInterceptor
   */
  constructor (logger, wlClient, nativeCompositorSession, webSocketChannel, messageInterceptor) {
    /**
     * @private
     */
    this._logger = logger
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
      4: payload => this._nativeCompositorSession.appEndpointWebFS.handleWebFDContentTransferReply(payload)
    }
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
          const { webFdURL, bytesRead } = this._nativeCompositorSession.appEndpointWebFS.deserializeWebFdURL(inboundMessage.subarray(readOffset))
          webFdURLs.push(webFdURL)
          readOffset += (bytesRead / Uint32Array.BYTES_PER_ELEMENT)
        }

        const objectId = inboundMessage[readOffset]
        const sizeOpcode = inboundMessage[readOffset + 1]
        const size = sizeOpcode >>> 16
        const opcode = sizeOpcode & 0x0000FFFF

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
          fdsBuffer[i] = await this._nativeCompositorSession.appEndpointWebFS.handleWebFdURL(webFdURL, this._webSocketChannel)
        }

        this._messageInterceptor.interceptEvent(objectId, opcode, {
          buffer: messageBuffer.buffer,
          fds: Array.from(fdsBuffer),
          bufferOffset: messageBuffer.byteOffset + (2 * Uint32Array.BYTES_PER_ELEMENT),
          consumed: 0,
          size: messageBuffer.length * 4 * Uint32Array.BYTES_PER_ELEMENT
        })
        Endpoint.sendEvents(this.wlClient, messageBuffer, fdsBuffer)
      }
      Endpoint.flush(this.wlClient)

      this._inboundMessages.shift()
    }
  }

  /**
   * @private
   */
  _allocateBrowserServerObjectIdsBatch () {
    const idsReply = new Uint32Array(1001)
    Endpoint.getServerObjectIdsBatch(this.wlClient, idsReply.subarray(1))
    // out-of-band w. opcode 6
    idsReply[0] = 6
    if (this._webSocketChannel.readyState === 1) {
      this._webSocketChannel.send(idsReply.buffer)
    } else {
      // web socket not open, queue up reply
      this._outboundMessages.push(idsReply.buffer)
    }
  }

  /**
   * @private
   */
  _flushOutboundMessageOnOpen () {
    this._allocateBrowserServerObjectIdsBatch()
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
      this._logger.fatal('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
      this._logger.fatal('error object stack: ')
      this._logger.fatal(e.stack)
      process.exit(-1)
    }
  }

  /**
   * @param {Object}wlClient
   * @param {ArrayBuffer}fdsInBuffer
   */
  _onWireMessageEnd (wlClient, fdsInBuffer) {
    let nroFds = 0
    let fdsIntBufferSize = 1 // start with one because we start with the number of webfds specified
    /** @type {Array<Uint8Array>} */const serializedWebFDs = new Array(nroFds)
    if (fdsInBuffer) {
      const fdsInWithType = new Uint32Array(fdsInBuffer)
      nroFds = fdsInWithType.length / 2 // fd + type (shm or pipe) = 2
      for (let i = 0; i < nroFds; i++) {
        // TODO keep track of (web)fd in case another host wants to get it's content or issues an fd close
        const fd = fdsInWithType[i * 2]
        const fdType = fdsInWithType[(i * 2) + 1]

        const serializedWebFD = this._nativeCompositorSession.appEndpointWebFS.serializeWebFD(fd, fdType)
        serializedWebFDs[i] = serializedWebFD
        // align webfdurl size to 32bits
        fdsIntBufferSize += 1 + (((serializedWebFD.byteLength + 3) & ~3) / 4) // size (1) + data (n)
      }
    }

    const sendBuffer = new Uint32Array(1 + fdsIntBufferSize + this._pendingMessageBufferSize)
    let offset = 0
    sendBuffer[offset++] = 0 // disable out-of-band
    sendBuffer[offset++] = nroFds
    serializedWebFDs.forEach(serializedWebFD => {
      sendBuffer[offset++] = serializedWebFD.byteLength
      new Uint8Array(sendBuffer.buffer, offset * Uint32Array.BYTES_PER_ELEMENT, serializedWebFD.length).set(serializedWebFD)
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
    this._logger.error(`Web socket is in error ${JSON.stringify(event.error)}.`)
  }

  /**
   * @param {Event}event
   * @private
   */
  _onClose (event) {
    this._logger.info(`Web socket is closed.`)
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
