const { Endpoint } = require('westfield-endpoint')

const WireMessageUtil = require('./WireMessageUtil')

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
        const args = this.parse(id, bindOpcode, 'usun', message)
        const globalName = args[0]
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
    // If the resource exist locally, we don't want to delegate it to the browser. Except:
    //  - If the resource is 'display' and the request is 'get_registry', then the request should be happen
    // both locally & in the browser.
    //  - If the resource is 'display' and the request is 'sync', then the request should be happen both locally & in the browser.
    //  - If a bind request happens on a registry resource for a locally created global, then don't delegate to the browser.
    // If none of the above applies, delegate to browser.

    // by default, always consume the message & delegate to browser
    let consumed = 1

    // if there is a native resource and the request is not a bind to a remote global or a sync, then there are some special cases that apply.
    if (hasNativeResource &&
      !this._isSync(objectId, opcode) &&
      !this._isRemoteGlobalBind(objectId, opcode, message)) {
      if (this._isGetRegistry(objectId, opcode)) {
        // if the resource is 'display' and the request is 'get_registry', then the request should be happen
        // both locally & in the browser.
        consumed = 0
      } else {
        // if none of the above conditions apply, then let the local resource implementation handle the request
        return 0
      }
    }

    // TODO analyse wire message to check for compositor requests & track the surface id.

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
    // send sendBuffer.buffer over data channel
    if (this._dataChannel.readyState === 'open') {
      this._dataChannel.send(sendBuffer.buffer)
    } else {
      // queue up data until the channel is open
      this._outboundMessages.push(sendBuffer.buffer)
    }
  }

  /**
   * Returns the arguments parsed from the wire messages, or null if no matches are found. Does not support signature
   * with file descriptors.
   *
   * @param {number}objectId
   * @param {number}opcode
   * @param {string}signature
   * @param {ArrayBuffer}wireMessageBuffer
   * @returns {null|Array<*>}
   */
  parse (objectId, opcode, signature, wireMessageBuffer) {
    const id = new Uint32Array(wireMessageBuffer)[0]
    const bufu16 = new Uint16Array(wireMessageBuffer, 4)
    const size = bufu16[1]
    if (size > wireMessageBuffer.byteLength) {
      throw new Error('wireMessageBuffer too small')
    }
    const messageOpcode = bufu16[0]
    if (objectId === id && opcode === messageOpcode) {
      return WireMessageUtil.unmarshallArgs({
        buffer: wireMessageBuffer,
        bufferOffset: 0,
        consumed: 8,
        fds: [],
        size: size
      }, signature)
    } else {
      return null
    }
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
    Endpoint.emitGlobals(wlRegistry)
  }

  /**
   * @param {number}objectId
   * @param {number}opcode
   * @returns {boolean}
   * @private
   */
  _isGetRegistry (objectId, opcode) {
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
  _isSync (objectId, opcode) {
    const displayId = 1
    const syncOpcode = 0
    return objectId === displayId && opcode === syncOpcode
  }
}

module.exports = NativeClientSession
