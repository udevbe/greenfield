const { Endpoint, MessageInterceptor } = require('westfield-endpoint')
// eslint-disable-next-line camelcase
const wl_display_interceptor = require('./protocol/wl_display_interceptor')
const config = require('./config')

class NativeClientSession {
  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}compositorSession
   * @returns {NativeClientSession}
   */
  static create (wlClient, compositorSession) {
    const dataChannel = compositorSession.rtcClient.peerConnection.createDataChannel()
    dataChannel.binaryType = 'arraybuffer'

    const messageInterceptor = MessageInterceptor.create(wlClient, compositorSession.wlDisplay, wl_display_interceptor, { dataChannel })
    const nativeClientSession = new NativeClientSession(wlClient, compositorSession, dataChannel, messageInterceptor)
    nativeClientSession.onDestroy().then(() => {
      if (dataChannel.readyState === 'open' || dataChannel.readyState === 'connecting') {
        dataChannel.close()
      }
    })

    Endpoint.setClientDestroyedCallback(wlClient, () => nativeClientSession.destroy())
    Endpoint.setRegistryCreatedCallback(wlClient, (wlRegistry, registryId) => nativeClientSession._onRegistryCreated(wlRegistry, registryId))
    Endpoint.setWireMessageCallback(wlClient, (wlClient, message, objectId, opcode) => nativeClientSession._onWireMessageRequest(wlClient, message, objectId, opcode))
    Endpoint.setWireMessageEndCallback(wlClient, (wlClient, fdsIn) => nativeClientSession._onWireMessageEnd(wlClient, fdsIn))
    // send an out-of-band buffer creation message with object-id (1) and opcode (0) when a new buffer resource is created locally.
    Endpoint.setBufferCreatedCallback(wlClient, (bufferId) => dataChannel.send(new Uint32Array([1, 0, bufferId]).buffer))

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
   * @param {Uint32Array}receiveBuffer
   * @private
   */
  _onWireMessageEvents (receiveBuffer) {
    process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: received event batch from browser.`)

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
    try {
      const receiveBuffer = new Uint32Array(message)
      const sizeOpcode = receiveBuffer[1]
      const size = sizeOpcode >>> 16
      process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: received request with id=${objectId}, opcode=${opcode}, length=${size} from native client.`)

      const interceptedMessage = { buffer: message, fds: [], bufferOffset: 8, consumed: 0, size: size }
      const destination = this._messageInterceptor.interceptRequest(objectId, opcode, interceptedMessage)
      if (destination === 1) {
        process.env.DEBUG && console.log(`[app-endpoint-${this._nativeCompositorSession.rtcClient.appEndpointCompositorPair.appEndpointSessionId}] Native client session: delegating request to native implementation only.`)
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
   * @param {ArrayBuffer}fdsIn
   */
  _onWireMessageEnd (wlClient, fdsIn) {
    const fdsBufferSize = Uint32Array.BYTES_PER_ELEMENT + (fdsIn ? fdsIn.byteLength : 0)
    const sendBuffer = new Uint32Array(new ArrayBuffer(Uint32Array.BYTES_PER_ELEMENT + fdsBufferSize + this._pendingMessageBufferSize))
    sendBuffer[0] = 0 // out-of-band opcode === 0
    let offset = 1
    sendBuffer[offset] = fdsIn ? fdsIn.byteLength / Uint32Array.BYTES_PER_ELEMENT : 0
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
    const buffer = Buffer.from(receiveBuffer)
    const outOfBand = buffer.readUInt32LE(0, true)
    if (!outOfBand) {
      this._onWireMessageEvents(new Uint32Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT))
    } else {
      // TODO handle out-of-band message
    }
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
