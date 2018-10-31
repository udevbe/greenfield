const { Endpoint } = require('westfield-endpoint')

const WireMessageUtil = require('./WireMessageUtil')
const CompositorInterceptor = require('./wire/CompositorInterceptor')

class NativeClientSession {
  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}compositorSession
   * @returns {NativeClientSession}
   */
  static create (wlClient, compositorSession) {
    const dataChannel = compositorSession.rtcClient.peerConnection.createDataChannel()
    const nativeClientSession = new NativeClientSession(wlClient, compositorSession, dataChannel)
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
      nativeClientSession._flushOutboundMessage()
    }

    return nativeClientSession
  }

  /**
   * @param {number}objectId
   * @param {number}opcode
   * @returns {boolean}
   * @private
   */
  static _isGetRegistry (objectId, opcode) {
    const displayId = 1
    const getRegistryOpcode = 1
    return objectId === displayId && opcode === getRegistryOpcode
  }

  /**
   * @param {number}objectId
   * @param {number}opcode
   * @returns {boolean}
   * @private
   */
  static _isSync (objectId, opcode) {
    const displayId = 1
    const syncOpcode = 0
    return objectId === displayId && opcode === syncOpcode
  }

  /**
   * @param {Object}wlClient
   * @param {NativeCompositorSession}compositorSession
   * @param {RTCDataChannel}dataChannel
   */
  constructor (wlClient, compositorSession, dataChannel) {
    /**
     * @type {Object}
     */
    this.wlClient = wlClient
    /**
     * @type {NativeCompositorSession}
     * @private
     */
    this._compositorSession = compositorSession
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
     * @type {Object.<number,WireMessageInterceptor>}
     * @private
     */
    this._interceptors = {}
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
    // receive from data channel
    const receiveBuffer = new Uint32Array(buffer)
    let readOffset = 0
    let localGlobalsEmitted = false
    while (readOffset < receiveBuffer.length) {
      const fdsCount = receiveBuffer[readOffset++]
      const fdsBuffer = receiveBuffer.subarray(readOffset, readOffset + fdsCount)
      readOffset += fdsCount
      const sizeOpcode = receiveBuffer[readOffset + 1]
      const size = sizeOpcode >>> 16
      const length = size / Uint32Array.BYTES_PER_ELEMENT
      const messageBuffer = receiveBuffer.subarray(readOffset, readOffset + length)
      readOffset += length

      if (!localGlobalsEmitted) {
        // check if browser compositor is emitting globals, if so, emit the local globals as well.
        localGlobalsEmitted = this._emitLocalGlobals(messageBuffer)
      }

      Endpoint.sendEvents(
        this.wlClient,
        messageBuffer.buffer.slice(messageBuffer.byteOffset, messageBuffer.byteOffset + messageBuffer.byteLength),
        fdsBuffer.buffer.slice(fdsBuffer.byteOffset, fdsBuffer.byteOffset + fdsBuffer.byteLength)
      )
    }

    Endpoint.flush(this.wlClient)
  }

  _flushOutboundMessage () {
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
        Endpoint.emitGlobals(wlRegistry)
        return true
      }
    }
    return false
  }

  /**
   *
   * @param {number}id
   * @param {number}opcode
   * @param {ArrayBuffer}message
   * @private
   */
  _isRemoteGlobalBind (id, opcode, message) {
    const wlRegistry = this._wlRegistries[id]
    let isRemoteGlobal = false
    if (wlRegistry) {
      const bindOpcode = 0
      if (opcode === bindOpcode) {
        const args = this.parse('usun', message)
        const globalName = args[0]
        this._trackCompositorGlobal(...args)
        isRemoteGlobal = !this._compositorSession.localGlobalNames.includes(globalName)
      }
    }
    return isRemoteGlobal
  }

  /**
   * @param {Object}wlClient
   * @param {ArrayBuffer}message
   * @param {number}objectId
   * @param {number}opcode
   * @param {boolean}hasNativeResource
   * @returns {number}
   * @private
   */
  _onWireMessageRequest (wlClient, message, objectId, opcode, hasNativeResource) {
    // - If the resource does not exist locally, then the request should only happen remotely.
    // - If the resource exist locally, then the request should only happen locally.
    //  Except:
    //  - If the resource is 'display' and the request is 'get_registry', then the request should be happen both locally & remotely.
    //  - If the resource is 'display' and the request is 'sync', then the request should be happen only remotely.
    //  - If the resource is 'registry' and the request is 'bind' for a locally created global, then the request should only happen locally.
    //  - If the resource is 'registry' and the request is 'bind' for a remotely created global, then the request should only happen remotely.

    // by default, always consume the message & delegate to browser
    let consumed = 1

    // if there is a native resource and the request is not a bind to a remote global or a sync, then there are some special cases that apply.
    if (hasNativeResource &&
      !NativeClientSession._isSync(objectId, opcode) &&
      !this._isRemoteGlobalBind(objectId, opcode, message)) {
      if (NativeClientSession._isGetRegistry(objectId, opcode)) {
        // if the resource is 'display' and the request is 'get_registry', then the request should be happen
        // both locally & in the browser.
        consumed = 0
      } else {
        // if none of the above conditions apply, then let the local resource implementation handle the request
        return 0
      }
    }

    if (consumed) {
      const interceptor = this._interceptors[objectId]
      if (interceptor) {
        interceptor.intercept(message, opcode)
      }
    }

    this._pendingMessageBufferSize += message.byteLength
    this._pendingWireMessages.push(message)

    return consumed
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
      this._dataChannel.send(sendBuffer.buffer)
    } else {
      // queue up data until the channel is open
      this._outboundMessages.push(sendBuffer.buffer)
    }
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
      bufferOffset: 0,
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
  }

  /**
   * @param {Event}event
   * @private
   */
  _onClose (event) {
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

  /**
   * @param {number}uniqueName
   * @param {string}interfaceName
   * @param {number}version
   * @param {number}objectId
   * @private
   */
  _trackCompositorGlobal (uniqueName, interfaceName, version, objectId) {
    // TODO track compositor resource destruction
    if (interfaceName === 'wl_compositor') {
      this._interceptors[objectId] = CompositorInterceptor.create(this._interceptors)
    }
  }
}

module.exports = NativeClientSession
