const { Endpoint } = require('westfield-endpoint')

const Logger = require('pino')
const config = require('../config.json5')

const fs = require('fs')
const { TextEncoder, TextDecoder } = require('util')
const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()
const WebSocket = require('ws')
const WebsocketStream = require('websocket-stream')

class AppEndpointWebFS {
  /**
   * @param {string}compositorSessionId
   * @return {AppEndpointWebFS}
   */
  static create (compositorSessionId) {
    const logger = Logger({
      name: `app-endpoint-session::${compositorSessionId}::native-client-session`,
      prettyPrint: (process.env.DEBUG && process.env.DEBUG == true),
      level: (process.env.DEBUG && process.env.DEBUG == true) ? 20 : 30
    })

    const { protocol, hostname, port } = config.serverConfig.httpServer
    const localWebFDBaseURL = new URL(`${protocol}//${hostname}:${port}`)

    return new AppEndpointWebFS(logger, compositorSessionId, localWebFDBaseURL)
  }

  /**
   * @param {Object}logger
   * @param {string}compositorSessionId
   * @param {URL}localWebFDBaseURL
   */
  constructor (logger, compositorSessionId, localWebFDBaseURL) {
    /**
     * @type {Object}
     * @private
     */
    this._logger = logger
    /**
     * @type {string}
     * @private
     */
    this._compositorSessionId = compositorSessionId
    /**
     * @type {URL}
     * @private
     */
    this._localWebFDBaseURL = localWebFDBaseURL

    /**
     * @type {Object.<string, {resolve: function(data:Uint8Array):void}>}
     * @private
     */
    this._webFDTransferRequests = {}
  }

  /**
   * @param {number}fd
   * @param {string}type
   * @return {URL}
   * @private
   */
  _createLocalWebFDURL (fd, type) {
    const localWebFDURL = new URL(this._localWebFDBaseURL.href)
    localWebFDURL.searchParams.append('compositorSessionId', `${this._compositorSessionId}`)
    localWebFDURL.searchParams.append('fd', `${fd}`)
    localWebFDURL.searchParams.append('type', type)
    localWebFDURL.searchParams.sort()
    return localWebFDURL
  }

  /**
   * @param {ArrayBufferLike}sourceBuf
   * @return {{webFdURL:URL, bytesRead: number}}webFdURL
   */
  deserializeWebFdURL (sourceBuf) {
    const webFDByteLength = new Uint32Array(sourceBuf.buffer, sourceBuf.byteOffset, 1)[0]
    const fdURLUint8Array = new Uint8Array(sourceBuf.buffer, sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT, webFDByteLength)
    const fdURLString = textDecoder.decode(fdURLUint8Array)
    const webFdURL = new URL(fdURLString)
    // sort so we can do string comparison of urls
    webFdURL.searchParams.sort()

    const alignedWebFDBytesLength = (webFDByteLength + 3) & ~3
    return { webFdURL, bytesRead: alignedWebFDBytesLength + Uint32Array.BYTES_PER_ELEMENT }
  }

  /**
   * Creates a local fd that matches the content & behavior of the foreign webfd
   * @param {URL}webFdURL
   * @param {WebSocketChannel}clientWebSocketChannel
   * @return {Promise<number>}
   */
  async handleWebFdURL (webFdURL, clientWebSocketChannel) {
    if (webFdURL.host === this._localWebFDBaseURL.host &&
      webFdURL.searchParams.get('compositorSessionId') === this._compositorSessionId) {
      // the fd originally came from this process, which means we can just use it as is.
      return Number.parseInt(webFdURL.searchParams.get('fd'))
    } else {
      // foreign fd.
      // the fd comes from a different host. In case of shm, we need to create local shm and
      // transfer the contents of the remote fd. In case of pipe, we need to create a local pipe and transfer
      // the contents on-demand.
      return this._handleForeignWebFdURL(webFdURL, clientWebSocketChannel)
    }
  }

  /**
   * @param {URL}webFdURL
   * @param {WebSocketChannel}clientWebSocketChannel
   * @return {Promise<number>}
   * @private
   */
  async _handleForeignWebFdURL (webFdURL, clientWebSocketChannel) {
    /** @type {WebSocket} */
    let fdTransferWebSocket
    if (webFdURL.protocol === 'compositor:' &&
      this._compositorSessionId === webFdURL.searchParams.get('compositorSessionId')) {
      // If the fd originated from the compositor, we can reuse the existing websocket connection to transfer the fd contents
      fdTransferWebSocket = clientWebSocketChannel.webSocket
    } else if (webFdURL.protocol.startsWith('ws')) {
      // TODO currently unsupported => need this once we properly implement c/p & dnd functionality
      // fd came from another endpoint, establish a new communication channel
      fdTransferWebSocket = this._createFdTransferWebSocket(webFdURL)
    } else {
      // TODO unsupported websocket url
      this._logger.error(`Unsupported websocket URL ${webFdURL.href}.`)
    }

    let localFD = -1
    const webFdType = webFdURL.searchParams.get('type')
    if (webFdType === 'ArrayBuffer') {
      localFD = await this._handleForeignWebFDShm(fdTransferWebSocket, webFdURL)
    } else if (webFdType === 'MessagePort') {
      // because we can't distinguish between read or write end of a pipe, we always assume write-end of pipe here (as per c/p & DnD use-case in wayland protocol)
      localFD = this._handleForeignWebFDWritePipe(fdTransferWebSocket, webFdURL)
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

  /**
   *
   * @param {WebSocket}fdCommunicationChannel
   * @param {URL}webFdURL
   * @return {number}
   * @private
   */
  _handleForeignWebFDWritePipe (fdCommunicationChannel, webFdURL) {
    const resultBuffer = new Uint32Array(2)
    Endpoint.makePipe(resultBuffer)
    const fd = resultBuffer[0]

    const readStream = fs.createReadStream(null, { fd })
    readStream.pipe(new WebsocketStream(fdCommunicationChannel))

    return resultBuffer[1]
  }

  /**
   * @param {Uint8Array}payload
   */
  handleWebFDContentTransferReply (payload) {
    // payload = fdURLByteSize (4 bytes) + fdURL (aligned to 4 bytes) + contents
    const { webFdURL, bytesRead } = this.deserializeWebFdURL(payload)
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
    return new WebSocket(webFdURL)
  }

  /**
   * @param {number}fd
   * @param {number}fdType
   * @return {Uint8Array}
   */
  serializeWebFD (fd, fdType) {
    let type
    switch (fdType) {
      case 1:
        type = 'ArrayBuffer'
        break
      case 2:
        type = 'MessagePort'
        break
      default:
        type = 'unsupported'
    }

    const webFdURL = this._createLocalWebFDURL(fd, type)
    return textEncoder.encode(webFdURL.href)
  }

  /**
   *
   * @param {WebSocket}webSocket
   * @param {ParsedUrlQuery}query
   */
  incomingDataTransfer (webSocket, query) {
    const compositorSessionId = query.compositorSessionId
    if (compositorSessionId !== this._compositorSessionId) {
      // fd did not originate from here
      // TODO close with error code & message (+log?)
      webSocket.close()
      return
    }
    const fd = query.fd
    // TODO do we want to do something differently based on the type?
    // const type = query.type

    const target = fs.createWriteStream(null, { fd: Number.parseInt(fd) })
    new WebsocketStream(webSocket).pipe(target)
  }
}

module.exports = AppEndpointWebFS
