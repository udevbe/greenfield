import UUIDUtil from './UUIDUtil'

const { Endpoint, MessageInterceptor } = require('westfield-endpoint')
// eslint-disable-next-line camelcase
const wl_display_interceptor = require('./protocol/wl_display_interceptor')
// eslint-disable-next-line camelcase
const wl_buffer_interceptor = require('./protocol/wl_buffer_interceptor')

const RTCConnectionPool = require('./rtc/RTCConnectionPool')

class NativeClientSession {
  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}compositorSession
   * @param {CommunicationChannel}communicationChannel
   * @returns {NativeClientSession}
   */
  static create (wlClient, compositorSession, communicationChannel) {
    const messageInterceptor = MessageInterceptor.create(wlClient, compositorSession.wlDisplay, wl_display_interceptor, { communicationChannel })
    const nativeClientSession = new NativeClientSession(wlClient, compositorSession, communicationChannel, messageInterceptor)
    nativeClientSession.onDestroy().then(() => {
      if (communicationChannel.readyState === 'open' || communicationChannel.readyState === 'connecting') {
        communicationChannel.onerror = null
        communicationChannel.onclose = null
        communicationChannel.onmessage = null
        communicationChannel.close()
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
    // send an out-of-band buffer creation message with object-id (1) and opcode (0) when a new buffer resource is created locally.
    Endpoint.setBufferCreatedCallback(wlClient, (bufferId) => {
      // eslint-disable-next-line new-cap
      messageInterceptor.interceptors[bufferId] = new wl_buffer_interceptor(wlClient, messageInterceptor.interceptors, 1, null, null)
      communicationChannel.send(new Uint32Array([1, 0, bufferId]).buffer)
    })

    communicationChannel.onerror = () => nativeClientSession.destroy()
    communicationChannel.onclose = event => nativeClientSession._onClose(event)
    communicationChannel.onmessage = event => nativeClientSession._onMessage(event)

    communicationChannel.onopen = () => {
      communicationChannel.onerror = event => nativeClientSession._onError(event)
      // flush out any requests that came in while we were waiting for the data channel to open.
      process.env.DEBUG && console.log(`[app-endpoint-${nativeClientSession._nativeCompositorSession.appEndpointCompositorPair.appEndpointSessionId}] Native client session: communication channel to browser is open.`)
      nativeClientSession._flushOutboundMessage()
    }

    return nativeClientSession
  }

  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {CommunicationChannel}communicationChannel
   * @param {MessageInterceptor}messageInterceptor
   */
  constructor (wlClient, nativeCompositorSession, communicationChannel, messageInterceptor) {
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
     * @type {CommunicationChannel}
     * @private
     */
    this._communicationChannel = communicationChannel
    /**
     * @type {boolean}
     * @private
     */
    this._disconnecting = false

    this._outOfBandHandlers = {
      1: {
        2: (objectId, opcode, payload) => this._destroyResourceSilently(objectId, opcode, payload),
        127: (objectId, opcode, payload) => this._openAndWriteShm(objectId, opcode, payload),
        128: (objectId, opcode, payload) => this._closeFd(objectId, opcode, payload)
      }
    }
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
    const fdDomainUUID = UUIDUtil.unparse(new Uint8Array(sourceBuf.buffer, sourceBuf.byteOffset + 8, 16))
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
          if (webFD.fdDomainUUID === this._nativeCompositorSession.appEndpointCompositorPair.appEndpointSessionId) {
            // the fd originally came from this machine, which means we can just use it as is.
            fdsBuffer[i] = webFD.fd
          } else { // foreign fd. the fd comes from a different host. In case of shm, we need to create local shm and
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
    const fdCommunicationChannel = this._createFdCommunicationChannel(fdDomainUUID, fd)

    if (fdType === 'shm') {

    }

    // TODO create a network bridge between local & foreign host
    // TODO check type of fd (unsupported, shm or pipe) and create a local fd of the same tye
    // TODO in case of shm, signal remote end to start sending
    // TODO in case of shm, listen for transfer and write contents to locally created shm file
    // TODO in case of pipe, set up a 'streaming'/'on-demand' transfer
    // TODO in case of pipe, listen for incoming data on pipe & forward, listen for incomding data on com channel and forward to pipe
    return 0
  }

  /**
   * @param fdDomainUUID
   * @param fd
   * @return {CommunicationChannel}
   * @private
   */
  _createFdCommunicationChannel (fdDomainUUID, fd) {
    // TODO decide to use RTC based on config
    const rtcConnection = RTCConnectionPool.get(this._nativeCompositorSession.appEndpointCompositorPair, fdDomainUUID)
    return rtcConnection.createMessagesChannel(`urn:webfd:${fdDomainUUID}:${fd}`)
  }

  _flushOutboundMessage () {
    while (this._outboundMessages.length) { this._communicationChannel.send(this._outboundMessages.shift()) }
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

      // returning a zero value means message should not be seen by native code. destination = 0 => browser only, 1 => native only, 2 => both
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

    if (this._communicationChannel.readyState === 'open') {
      this._communicationChannel.send(sendBuffer.buffer)
    } else {
      // queue up data until the channel is open
      this._outboundMessages.push(sendBuffer.buffer)
    }

    this._communicationChannel.send(sendBuffer.buffer)

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
    const fdDomainUUID = this._nativeCompositorSession.appEndpointCompositorPair.appEndpointSessionId
    new Uint8Array(targetBuf.buffer, targetBuf.byteOffset + 8, 16).set(UUIDUtil.parse(fdDomainUUID))
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
   * @param {MessageEvent}event
   * @private
   */
  _onMessage (event) {
    if (!this.wlClient) { return }

    const receiveBuffer = /** @type {ArrayBuffer} */event.data
    const buffer = Buffer.from(receiveBuffer)
    const outOfBand = buffer.readUInt32LE(0, true)
    if (!outOfBand) {
      const opcode = buffer.readUInt32LE(4, true)
      this._outOfBandHandlers[outOfBand][opcode](outOfBand, opcode, buffer.slice(8))
    } else {
      this._onWireMessageEvents(new Uint32Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT))
    }
  }

  /**
   * @param {number}objectId
   * @param {number}opcode
   * @param {Buffer}payload
   * @private
   */
  _destroyResourceSilently (objectId, opcode, payload) {
    const deleteObjectId = payload.readUInt32LE(0, true)
    Endpoint.destroyWlResourceSilently(this.wlClient, deleteObjectId)
    delete this._messageInterceptor.interceptors[deleteObjectId]
    if (deleteObjectId === 1) {
      // 1 is the display id, which means client is being disconnected
      this._disconnecting = true
    }
  }

  // /**
  //  * @param {number}objectId
  //  * @param {number}opcode
  //  * @param {Buffer}payload
  //  * @private
  //  */
  // _openAndWriteShm (objectId, opcode, payload) {
  //   const webFd = payload.readUInt32LE(0, true)
  //   const contents = payload.slice(4)
  //   const nativeFd = Endpoint.createMemoryMappedFile(contents)
  //   this._dataChannel.send(new Uint32Array([webFd, 127, nativeFd]).buffer)
  // }

  // /**
  //  * @param {number}objectId
  //  * @param {number}opcode
  //  * @param {Buffer}payload
  //  * @private
  //  */
  // _closeFd (objectId, opcode, payload) {
  //   const webFd = payload.readUInt32LE(0, true)
  //   const nativeFd = payload.readUInt32LE(4, true)
  //   // TODO use callback & listen for errors
  //   fs.close(nativeFd, (err) => {
  //     if (err) {
  //       console.error(`Error trying to close fd. ${err.message}`)
  //     }
  //     this._dataChannel.send(new Uint32Array([webFd, 128, err ? -1 : 0]).buffer)
  //   })
  // }

  /**
   * @param {ErrorEvent}event
   * @private
   */
  _onError (event) {
    // TODO log error
    process.env.DEBUG && console.log(`[app-endpoint: ${this._nativeCompositorSession.appEndpointCompositorPair.appEndpointSessionId}] - Native client session: communication channel is in error ${JSON.stringify(event.error)}.`)
  }

  /**
   * @param {Event}event
   * @private
   */
  _onClose (event) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this._nativeCompositorSession.appEndpointCompositorPair.appEndpointSessionId}] - Native client session: communication channel is closed.`)
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
