'use strict'

const LocalRtcPeerConnectionFactory = require('./LocalRtcPeerConnectionFactory')
const LocalRtcBufferFactory = require('./LocalRtcBufferFactory')

const {Connection} = require('westfield-runtime-client')
const session = require('./protocol/session-client-protocol')
const WebSocket = require('ws')

const LocalClientSession = require('./LocalClientSession')

class LocalCompositorSession {
  /**
   * @param request http ws upgrade request
   * @param socket http socket
   * @param head http head
   * @param {ShimCompositorSession}shimCompositorSession
   * @returns {Promise<LocalCompositorSession>}
   */
  static async create (request, socket, head, shimCompositorSession) {
    console.log(`Child ${process.pid} setting up session web socket server logic.`)
    const wss = new WebSocket.Server({
      noServer: true,
      handshakeTimeout: 2000
    })
    return new LocalCompositorSession(wss, shimCompositorSession)._handleUpgrade(request, socket, head)
  }

  /**
   *
   * @param {WebSocket.Server} wss
   * @param {ShimCompositorSession}shimCompositorSession
   */
  constructor (wss, shimCompositorSession) {
    /**
     * @type {WebSocket.Server}
     * @private
     */
    this._wss = wss
    /**
     * @type {WebSocket}
     * @private
     */
    this._ws = null
    /**
     * @type {ShimCompositorSession}
     */
    this.shimCompositorSession = shimCompositorSession
    /**
     * @type {Object.<number,LocalClientSession>}
     * @private
     */
    this._localClientSessions = {}

    /**
     * @type {LocalRtcPeerConnectionFactory}
     */
    this.localRtcPeerConnectionFactory = null
    /**
     * @type {LocalRtcPeerConnection}
     */
    this.localRtcPeerConnection = null
    /**
     * @type {LocalRtcBufferFactory}
     */
    this.localRtcBufferFactory = null
    /**
     * @type {number}
     * @private
     */
    this._nextClientId = 1
    /**
     * @type {wfc.Connection}
     * @private
     */
    this._primaryConnection = null
    /**
     * @type {Array<ArrayBuffer>}
     * @private
     */
    this._wireMessages = []
  }

  /**
   * @param request
   * @param socket
   * @param head
   * @return {Promise<LocalCompositorSession>}
   * @private
   */
  _handleUpgrade (request, socket, head) {
    return new Promise((resolve) => {
      console.log(`Child ${process.pid} received session web socket upgrade request. Will establish session web socket connection.`)
      this._wss.handleUpgrade(request, socket, head, (ws) => {
        console.log(`Child ${process.pid} session web socket is open.`)
        this._ws = ws
        this._setupWebsocket()
        resolve(this)
      })
    })
  }

  onTerminate () {}

  _setupWebsocket (resolve) {
    // this._ws.isAlive = true
    // this._ws.on('pong', () => {
    //   this._ws.isAlive = true
    // })
    //
    // let interval = null
    // interval = setInterval(() => {
    //   if (this._ws.isAlive === false) {
    //     console.error(`Child ${process.pid} did not receive session web socket pong reply after 5 seconds. Will terminate connection.`)
    //     clearInterval(interval)
    //     this._ws.terminate()
    //   } else {
    //     this._ws.isAlive = false
    //     this._ws.ping(() => {})
    //   }
    // }, 5000)

    this._ws.onmessage = async (event) => {
      try {
        this._wireMessages.push(/** @types {Buffer} */event.data)

        if (this._wireMessages.length === 1) {
          while (this._wireMessages.length) {
            this.flushToBrowser()

            const buf = this._wireMessages[0]
            const sessionId = buf.readUInt32LE(0, true)
            const wireMessage = buf.buffer.slice(buf.byteOffset + 4, buf.byteOffset + 4 + buf.byteLength)

            const connection = sessionId === 0 ? this._primaryConnection : this._localClientSessions[sessionId].connection
            await connection.unmarshall(wireMessage)
            this.shimCompositorSession.flushToNative()
            this._wireMessages.shift()
            this.flushToBrowser()
          }
        }
      } catch (error) {
        console.error(`Child ${process.pid} failed to handle incoming message. \n${error}\n${error.stack}`)
        this._ws.close(4007, 'Session web socket received an illegal message')
      }
    }

    this._ws.onclose = (event) => {
      console.log(`Child ${process.pid} session web socket is closed. ${event.code}: ${event.reason}`)
      this.wlDisplay.terminate()
      this.wlDisplay.destroy()
      this.onTerminate()
    }
    this._ws.onerror = () => {
      console.error(`Child ${process.pid} session web socket is in error.`)
    }
  }

  /**
   * @param {wfc.Connection}connection
   * @return {Promise<void>}
   */
  setupPrimaryConnection (connection) {
    return new Promise((resolve) => {
      this._primaryConnection = connection
      this._setupConnection(connection, 0)
      const registryProxy = connection.createRegistry()
      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === session.GrSession.name) {
          const grSessionProxy = registryProxy.bind(name, interface_, version)
          grSessionProxy.listener = this
          this.grSessionProxy = grSessionProxy

          resolve()
        } else if (interface_.startsWith('Gr') || interface_.startsWith('Xdg')) {
          this.shimCompositorSession.setupShimGlobal(name, interface_, version)
        }
      }

      registryProxy.listener.globalRemove = (name) => {
        this.shimCompositorSession.tearDownShimGlobal(name)
      }
    })
  }

  /**
   * @param {wfc.Connection}connection
   * @param {number}clientSessionId
   * @private
   */
  _setupConnection (connection, clientSessionId) {
    /**
     * @param {ArrayBuffer}wireMessages
     */
    connection.onFlush = (wireMessages) => {
      if (this._ws.readyState === WebSocket.OPEN) {
        try {
          const targetBuffer = Buffer.allocUnsafe(wireMessages.byteLength + 4)
          const sourceBuffer = Buffer.from(wireMessages)
          targetBuffer.fill(sourceBuffer, 4).writeUInt32LE(clientSessionId, 0, true)

          this._ws.send(targetBuffer.buffer.slice(targetBuffer.byteOffset, targetBuffer.byteOffset + targetBuffer.byteLength), (error) => {
            if (error !== undefined) {
              console.error(error, error.stack)
              this._ws.terminate()
            }
          })
        } catch (error) {
          console.error(error, error.stack)
          this._ws.terminate()
        }
      }
    }
  }

  /**
   * @param {WlClient}wlClient
   * @returns {LocalClientSession}
   */
  async createClientSession (wlClient) {
    const clientSessionId = this._generateClientSessionId()
    const connection = new Connection()
    this._setupConnection(connection, clientSessionId)
    const grClientSessionProxy = this.grSessionProxy.client(clientSessionId)
    this.grSessionProxy.connection.flush()

    const localClientSession = LocalClientSession.create(grClientSessionProxy, connection)
    grClientSessionProxy.listener = localClientSession
    this._localClientSessions[clientSessionId] = localClientSession
    wlClient._localClientSession = localClientSession

    const localRtcPeerConnectionFactoryPromise = LocalRtcPeerConnectionFactory.create(connection)
    connection.flush()
    const localRtcPeerConnectionFactory = await localRtcPeerConnectionFactoryPromise
    const localRtcPeerConnection = localRtcPeerConnectionFactory.createRtcPeerConnection()
    const localRtcBufferFactoryPromise = LocalRtcBufferFactory.create(connection, localRtcPeerConnection)
    connection.flush()
    const localRtcBufferFactory = await localRtcBufferFactoryPromise

    localClientSession.localRtcPeerConnection = localRtcPeerConnection
    localClientSession.localRtcBufferFactory = localRtcBufferFactory

    // TODO manage client session lifecycle & cleanup

    return localClientSession
  }

  flushToBrowser () {
    // flush outbound messages to browser
    Object.values(this._localClientSessions).forEach((localClient) => {
      localClient.connection.flush()
    })
  }

  /**
   * @return {number}
   * @private
   */
  _generateClientSessionId () {
    return this._nextClientId++
  }
}

module.exports = LocalCompositorSession
