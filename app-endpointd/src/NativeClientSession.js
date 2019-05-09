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

const { parse, unparse } = require('./UUIDUtil')

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
    const messageInterceptor = MessageInterceptor.create(wlClient, nativeCompositorSession.wlDisplay, wl_display_interceptor, { communicationChannel: webSocketChannel })
    const nativeClientSession = new NativeClientSession(wlClient, nativeCompositorSession, webSocketChannel, messageInterceptor)
    nativeClientSession.onDestroy().then(() => {
      if (webSocketChannel.readyState === 'open' || webSocketChannel.readyState === 'connecting') {
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
   */
  constructor (wlClient, nativeCompositorSession, webSocketChannel, messageInterceptor) {
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
     * @type {Array<ArrayBuffer>}
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
      1: (payload) => this._destroyResourceSilently(payload),
      // listen for file contents request. opcode: 4
      4: (payload) => this._handleWebFDContentTransferReply(payload)
    }
    /**
     * @type {Object.<string, {shm: { contents: Uint8Array, pendingBytes: number }, resolve: function(data:ArrayBuffer|null):void}>}
     * @private
     */
    this._webFDTransferRequests = {}
  }

  /**
   * @param {Uint32Array}sourceBuf
   * @return {{fdDomainUUID: string, fd: number, fdType: string}}
   * @private
   */
  _deserializeWebFD (sourceBuf) {
    const fd = sourceBuf[0]
    let fdType
    switch (sourceBuf[1]) {
      case 1:
        fdType = 'shm'
        break
      case 2:
        fdType = 'pipe'
        break
      default:
        fdType = 'unsupported'
    }
    const fdDomainUUID = unparse(new Uint8Array(sourceBuf.buffer, sourceBuf.byteOffset + 4 + 4, 16))
    return { fd, fdType, fdDomainUUID }
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
        const webFds = []
        for (let i = 0; i < fdsCount; i++) {
          const webFD = this._deserializeWebFD(inboundMessage.subarray(readOffset, readOffset + 6))
          webFds.push(webFD)
          readOffset += 6
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
        for (let i = 0; i < webFds.length; i++) {
          const webFD = webFds[i]
          // FIXME use endpoint URL form when comparing ie fdDomainUUID <=> schema://hostname:port/compositorSessionId
          if (webFD.fdDomainUUID === this._nativeCompositorSession.compositorSessionId) {
            // the fd originally came from this machine, which means we can just use it as is.
            fdsBuffer[i] = webFD.fd
          } else {
            // foreign fd.
            // the fd comes from a different host. In case of shm, we need to create local shm and
            // transfer the contents of the remote fd. In case of pipe, we need to create a local pipe and transfer
            // the contents on-demand.
            fdsBuffer[i] = await this._handleForeignWebFD(webFD)
          }
        }
        Endpoint.sendEvents(this.wlClient, messageBuffer, fdsBuffer)
      }
      Endpoint.flush(this.wlClient)

      this._inboundMessages.shift()
    }
  }

  /**
   * Creates a local fd that matches the content & behavior of the foreign webfd
   * @param {number}fd
   * @param {string}fdType
   * @param {string}fdDomainUUID
   * @return {Promise<number>}
   * @private
   */
  async _handleForeignWebFD ({ fd, fdType, fdDomainUUID }) {
    let fdCommunicationChannel = null
    // FIXME use endpoint URL form when comparing ie fdDomainUUID <=> schema://hostname:port/compositorSessionId
    if (this._nativeCompositorSession.compositorSessionId === fdDomainUUID) {
      // If the fd originated from the compositor, we can reuse the existing websocket connection to transfer the
      // fd contents
      fdCommunicationChannel = this._webSocketChannel
    } else {
      // TODO currently unsupported => need this once we properly implement c/p & dnd functionality
      // TODO need a way to detect when new data channel is created on an app endpoint.
      // fd came from another endpoint, establish a new communication channel
      fdCommunicationChannel = this._createFdCommunicationChannel(fdDomainUUID)
      fdCommunicationChannel.onmessage = event => this._onMessage(event)
    }

    let localFD = -1
    if (fdType === 'shm') {
      localFD = await this._handleForeignWebFDShm(fdCommunicationChannel, fd, fdDomainUUID)
    } else if (fdType === 'pipe') { // because we can't distinguish between read or write end of a pipe, we always assume read-end of pipe here (as per c/p use-case in wayland protocol)
      // TODO currently unsupported => need this once we properly implement c/p & dnd functionality
      localFD = await this._handleForeignWebFDPipe(fdCommunicationChannel, fd, fdDomainUUID)
    }

    return localFD
  }

  async _handleForeignWebFDShm (fdCommunicationChannel, fd, fdDomainUUID) {
    return new Promise((resolve, reject) => {
      // register listener for incoming content on com chanel
      this._webFDTransferRequests[`${fdDomainUUID}|${fd}`] = {
        shm: { contents: null, pendingBytes: -1 },
        resolve
      }
      // request file contents. opcode: 4
      fdCommunicationChannel.send(new Uint32Array([4, fd]).buffer)
    }).then((data) => {
      return Endpoint.createMemoryMappedFile(Buffer.from(data))
    })
  }

  async _handleForeignWebFDPipe (fdCommunicationChannel, fd, fdDomainUUID) {
    return new Promise((resolve, reject) => {
      // register listener for incoming content on com chanel
      this._webFDTransferRequests[`${fdDomainUUID}|${fd}`] = resolve
      // TODO send message over com channel with fd as argument to receive all content
      fdCommunicationChannel.send(new Uint32Array([4, fd]).buffer)
    }).then((/** @type{ArrayBuffer} */contents) => {
      // TODO send message over com channel with fd as argument to send all data received on read end of remote pipe fd
      // TODO create new local pipe
      // TODO listen for incoming content on com channel
      // TODO write to write end of local pipe
      // TODO return read end of local pipe
    })
  }

  /**
   * @param {ArrayBuffer}payload
   * @private
   */
  _handleWebFDContentTransferReply (payload) {
    const payloadBuffer = Buffer.from(payload)

    // payload = fd (uint32) + fdDomainUUID (16 bytes) + totalSize (uint32) + chunk contents (max 16kb - 24 bytes)

    const fd = payloadBuffer.readUInt32LE(0, true)

    const fdDomainUUIDBuffer = payloadBuffer.slice(4, 20)
    const fdDomainUUID = unparse(new Uint8Array(fdDomainUUIDBuffer))

    const webFDTransfer = this._webFDTransferRequests[`${fdDomainUUID}|${fd}`]

    if (webFDTransfer.shm.contents === null) {
      // init pendingBytes as totalSize
      webFDTransfer.shm.pendingBytes = payloadBuffer.readUInt32BE(20, true)
      webFDTransfer.shm.contents = new Uint8Array(webFDTransfer.shm.pendingBytes)
    }

    const contents = new Uint8Array(payload.slice(24))
    webFDTransfer.shm.contents.set(contents, webFDTransfer.shm.contents.length - webFDTransfer.shm.pendingBytes)
    webFDTransfer.shm.pendingBytes -= contents.length

    if (webFDTransfer.shm.pendingBytes === 0) {
      webFDTransfer.resolve(webFDTransfer.shm.contents.buffer)
    }
  }

  /**
   * @param fdDomainUUID
   * @return {WebSocketChannel}
   * @private
   */
  _createFdCommunicationChannel (fdDomainUUID) {
    return this._nativeCompositorSession.channelFactoryPool.get(fdDomainUUID).createChannel()
  }

  _flushOutboundMessage () {
    while (this._outboundMessages.length) { this._webSocketChannel.send(this._outboundMessages.shift()) }
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

      const interceptedMessage = { buffer: message, fds: [], bufferOffset: 8, consumed: 0, size: size }
      const destination = this._messageInterceptor.interceptRequest(objectId, opcode, interceptedMessage)
      if (destination === 1) {
      } else {
        this._pendingMessageBufferSize += interceptedMessage.buffer.byteLength
        this._pendingWireMessages.push(interceptedMessage.buffer)
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
    const webFDIntSize = 6 // fd (1) + type (1) + uuid (4)
    let nroFds = 0
    let fdsIntBufferSize = 1
    if (fdsInWithType) {
      nroFds = fdsInWithType.byteLength / (Uint32Array.BYTES_PER_ELEMENT * 2) // fd + type (shm or pipe) = 2
      fdsIntBufferSize += (nroFds * webFDIntSize)
    }

    // +1 because we prefix the length
    const sendBuffer = new Uint32Array(1 + fdsIntBufferSize + (this._pendingMessageBufferSize / Uint32Array.BYTES_PER_ELEMENT))
    let offset = 0
    sendBuffer[offset++] = 0 // disable out-of-band
    sendBuffer[offset++] = nroFds

    if (fdsInWithType) {
      const fdsArray = new Uint32Array(fdsInWithType)
      for (let i = 0; i < nroFds; i++) {
        // TODO keep track of (web)fd in case another host wants to get it's content or issues an fd close
        const fd = fdsInWithType[i * 2]
        const fdType = fdsInWithType[(i * 2) + 1]
        const outBuf = sendBuffer.subarray(offset, offset + 6)
        this._serializeWebFD(fd, fdType, outBuf)
        offset += 6
      }
      offset += fdsArray.length
    }

    this._pendingWireMessages.forEach(value => {
      const wireMessage = new Uint32Array(value)
      sendBuffer.set(wireMessage, offset)
      offset += wireMessage.length
    })

    if (this._webSocketChannel.readyState === 'open') {
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
   * @param {Uint32Array}targetBuf
   * @private
   */
  _serializeWebFD (fd, fdType, targetBuf) {
    targetBuf[0] = fd
    targetBuf[1] = fdType
    // FIXME serialize (endpoint url + compositor session id) into a single byte array
    const fdDomainUUID = this._nativeCompositorSession.appEndpointCompositorPair.appEndpointSessionId
    new Uint8Array(targetBuf.buffer, targetBuf.byteOffset + 8, 16).set(parse(fdDomainUUID))
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

  requestWebSocket (clientId) {
    this._sendOutOfBand()
  }

  /**
   * @param {MessageEvent}event
   * @private
   */
  _onMessage (event) {
    if (!this.wlClient) { return }

    const receiveBuffer = /** @type {ArrayBuffer} */event.data
    const buffer = Buffer.from(receiveBuffer)
    const outOfBandOpcode = buffer.readUInt32LE(0, true)
    if (outOfBandOpcode) {
      this._browserChannelOutOfBandHandlers[outOfBandOpcode](receiveBuffer.slice(4))
    } else {
      this._onWireMessageEvents(new Uint32Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT))
    }
  }

  /**
   * @param {ArrayBuffer}payload
   * @private
   */
  _destroyResourceSilently (payload) {
    const deleteObjectId = Buffer.from(payload).readUInt32LE(0, true)
    Endpoint.destroyWlResourceSilently(this.wlClient, deleteObjectId)
    delete this._messageInterceptor.interceptors[deleteObjectId]
    if (deleteObjectId === 1) {
      // 1 is the display id, which means client is being disconnected
      this._disconnecting = true
    }
  }

  /**
   * @param {number}opcode
   * @param {ArrayBuffer}payload
   */
  _sendOutOfBand (opcode, payload) {
    // FIXME there's the danger of sending > 16kb, which might fail in chrome. => Chunk the message
    // if (payload.byteLength > (15 * 1024)) {
    //   throw new Error('Exceeded maximum size for out an of band message. Maximum is 15kb.')
    // }
    const sendBuffer = new ArrayBuffer(4 + payload.byteLength)
    const dataView = new DataView(sendBuffer)
    dataView.setUint32(0, opcode, true)
    new Uint8Array(sendBuffer, 4).set(new Uint8Array(payload))

    this._webSocketChannel.webSocket.send(sendBuffer.buffer.slice(sendBuffer.byteOffset, sendBuffer.byteOffset + sendBuffer.byteLength))
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
