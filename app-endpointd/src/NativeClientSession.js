const { Endpoint, MessageInterceptor } = require('westfield-endpoint')
const wl_display_interceptor = require('./protocol/wl_display_interceptor')

class NativeClientSession {
  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}compositorSession
   * @returns {NativeClientSession}
   */
  static create (wlClient, compositorSession) {
    const dataChannel = compositorSession.rtcClient.peerConnection.createDataChannel()
    const messageInterceptor = MessageInterceptor.create(wlClient, compositorSession.wlDisplay, wl_display_interceptor.constructor)
    const nativeClientSession = new NativeClientSession(wlClient, compositorSession, dataChannel, messageInterceptor)
    nativeClientSession.onDestroy().then(() => {
      if (dataChannel.readyState === 'open' || dataChannel.readyState === 'connecting') {
        dataChannel.close()
      }
    })

    Endpoint.setClientDestroyedCallback(wlClient, () => nativeClientSession.destroy())
    Endpoint.setRegistryCreatedCallback(wlClient, (wlRegistry, registryId) => nativeClientSession._onRegistryCreated(wlRegistry, registryId))
    Endpoint.setWireMessageCallback(wlClient, (wlClient, message, objectId, opcode, hasNativeResource) => nativeClientSession._onWireMessageRequest(wlClient, message, objectId, opcode, hasNativeResource))
    Endpoint.setWireMessageEndCallback(wlClient, (wlClient, fdsIn) => nativeClientSession._onWireMessageEnd(wlClient, fdsIn))

    dataChannel.onerror = () => nativeClientSession.destroy()
    dataChannel.onclose = event => nativeClientSession._onClose(event)
    dataChannel.onmessage = event => nativeClientSession._onMessage(event)

    // TODO data channel options from config
    dataChannel.onopen = () => {
      dataChannel.onerror = event => nativeClientSession._onError(event)
      // flush out any requests that came in while we were waiting for the data channel to open.
      process.env.DEBUG && console.log(`[app-endpoint-${nativeClientSession._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: RTC data channel to browser is open.`)
      nativeClientSession._flushOutboundMessage()
    }

    return nativeClientSession
  }

  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}nativeCompositorSession
   * @param {RTCDataChannel}dataChannel
   * @param {MessageInterceptor}messageInterceptor
   */
  constructor (wlClient, nativeCompositorSession, dataChannel, messageInterceptor) {
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
     * @type {RTCDataChannel}
     * @private
     */
    this._dataChannel = dataChannel
  }

  /**
   * @param {ArrayBuffer}buffer
   * @private
   */
  _onWireMessageEvents (buffer) {
    process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: received event batch from browser.`)

    const receiveBuffer = new Uint32Array(buffer)
    let readOffset = 0
    let localGlobalsEmitted = false
    while (readOffset < receiveBuffer.length) {
      const fdsCount = receiveBuffer[readOffset++]
      const fdsBuffer = receiveBuffer.subarray(readOffset, readOffset + fdsCount)
      readOffset += fdsCount
      const sizeOpcode = receiveBuffer[readOffset + 1]
      const size = sizeOpcode >>> 16

      const id = receiveBuffer[readOffset]
      const opcode = sizeOpcode & 0x0000FFFF
      process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: event with id=${id}, opcode=${opcode}, length=${size}.`)

      const length = size / Uint32Array.BYTES_PER_ELEMENT
      const messageBuffer = receiveBuffer.subarray(readOffset, readOffset + length)
      readOffset += length

      if (!localGlobalsEmitted) {
        // check if browser compositor is emitting globals, if so, emit the local globals as well.
        localGlobalsEmitted = this._emitLocalGlobals(messageBuffer)
      }

      this._messageInterceptor.handleEvent(id, opcode, messageBuffer)

      Endpoint.sendEvents(
        this.wlClient,
        messageBuffer.buffer.slice(messageBuffer.byteOffset, messageBuffer.byteOffset + messageBuffer.byteLength),
        fdsBuffer.buffer.slice(fdsBuffer.byteOffset, fdsBuffer.byteOffset + fdsBuffer.byteLength)
      )
    }

    process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: sending event batch to native client.`)
    Endpoint.flush(this.wlClient)
  }

  _flushOutboundMessage () {
    process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: sending ${this._outboundMessages.length} queued requests.`)
    while (this._outboundMessages.length) {
      this._dataChannel.send(this._outboundMessages.shift())
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
        process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: received globals emit event from browser. Will send local global events as well.`)
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
    const receiveBuffer = new Uint32Array(message)
    const sizeOpcode = receiveBuffer[1]
    const size = sizeOpcode >>> 16
    process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: received request with id=${objectId}, opcode=${opcode}, length=${size} from native client.`)

    let destination = this._messageInterceptor.interceptRequest(objectId, opcode, message)
    if (destination) {
      this._pendingMessageBufferSize += message.byteLength
      this._pendingWireMessages.push(message)
    } else {
      process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: delegating request to native implementation only.`)
    }

    // TODO we could be a bit smarter with our destination codes...
    // returning a non-zero value means message should not be seen by native code. destination = 0 => native only, 1 => browser only, 2 => both
    return destination === 2 ? 0 : 1
  }

  /**
   * @param {Object}wlClient
   * @param {ArrayBuffer}fdsIn
   */
  _onWireMessageEnd (wlClient, fdsIn) {
    const fdsBufferSize = Uint32Array.BYTES_PER_ELEMENT + (fdsIn ? fdsIn.byteLength : 0)
    const sendBuffer = new Uint32Array(new ArrayBuffer(fdsBufferSize + this._pendingMessageBufferSize))
    let offset = 0
    sendBuffer[0] = fdsIn ? fdsIn.byteLength / Uint32Array.BYTES_PER_ELEMENT : 0
    offset += 1

    if (fdsIn) {
      const fdsArray = new Uint32Array(fdsIn)
      sendBuffer.set(fdsArray)
      offset += fdsArray.length
    }

    this._pendingWireMessages.forEach(value => {
      const wireMessage = new Uint32Array(value)
      sendBuffer.set(wireMessage, offset)
      offset += wireMessage.length
    })

    if (this._dataChannel.readyState === 'open') {
      process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: sending request batch to browser.`)
      this._dataChannel.send(sendBuffer.buffer)
    } else {
      // queue up data until the channel is open
      process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: not sending request batch to browser. RTC data channel not open. Queueing.`)
      this._outboundMessages.push(sendBuffer.buffer)
    }

    this._pendingMessageBufferSize = 0
    this._pendingWireMessages = []
  }

  /**
   *
   * @param {string}signature
   * @param {ArrayBuffer}wireMessageBuffer
   * @returns {null|Array<*>}
   */
  parse (signature, wireMessageBuffer) {
    return WireMessageUtil.unmarshallArgs({
      buffer: wireMessageBuffer,
      bufferOffset: 8,
      consumed: 8,
      fds: [],
      size: new Uint32Array(wireMessageBuffer)[1] >>> 16
    }, signature)
  }

  /**
   * @returns {Promise<void>}
   */
  onDestroy () {
    return this._destroyPromise
  }

  destroy () {
    this._destroyResolve()
  }

  /**
   * @param {MessageEvent}event
   * @private
   */
  _onMessage (event) {
    const receiveBuffer = /** @type {ArrayBuffer} */event.data
    this._onWireMessageEvents(receiveBuffer)
  }

  /**
   * @param {RTCErrorEvent}event
   * @private
   */
  _onError (event) {
    // TODO log error
    process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: RTC data channel is in error ${JSON.stringify(event.error)}.`)
  }

  /**
   * @param {Event}event
   * @private
   */
  _onClose (event) {
    process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: RTC data channel is closed.`)
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
