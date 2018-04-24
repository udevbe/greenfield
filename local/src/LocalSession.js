'use strict'

const westfield = require('westfield-runtime-client')
const session = require('./protocol/session-client-protocol')
const WebSocket = require('ws')

const ShimGlobal = require('./ShimGlobal')
const LocalClientSession = require('./LocalClientSession')

module.exports = class LocalSession {
  /**
   * @param request http ws upgrade request
   * @param socket http socket
   * @param head http head
   * @param wlDisplay
   * @returns {Promise<LocalSession>}
   */
  static create (request, socket, head, wlDisplay) {
    console.log(`Child ${process.pid} setting up websocket server logic.`)
    const wss = new WebSocket.Server({
      noServer: true,
      handshakeTimeout: 2000
    })
    return new LocalSession(wss, wlDisplay)._handleUpgrade(request, socket, head)
  }

  /**
   *
   * @param {WebSocket.Server} wss
   * @param wlDisplay
   */
  constructor (wss, wlDisplay) {
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
    this.wlDisplay = wlDisplay
    this._connections = {}
    this.globals = {}
  }

  _handleUpgrade (request, socket, head) {
    console.log(`Child ${process.pid} received websocket upgrade request. Will establish websocket connection.`)
    return new Promise((resolve) => {
      this._wss.handleUpgrade(request, socket, head, (ws) => {
        console.log(`Child ${process.pid} websocket is open.`)
        this._ws = ws
        this._setupWebsocket()
        this._setupPrimaryConnection(resolve)
      })
    })
  }

  _setupShimGlobal (name, interface_, version) {
    this.globals[name] = ShimGlobal.create(this.wlDisplay, name, interface_, version)
  }

  _tearDownShimGlobal (name) {
    delete this.globals[name]
    // TODO remove native wayland global?
  }

  onTerminate () {}

  _setupWebsocket () {
    this._ws.isAlive = true
    this._ws.on('pong', () => {
      this._ws.isAlive = true
    })

    let interval = null
    interval = setInterval(() => {
      if (this._ws.isAlive === false) {
        console.error(`Child ${process.pid} did not receive websocket pong reply after 5 seconds. Will terminate connection.`)
        clearInterval(interval)
        this._ws.terminate()
      } else {
        this._ws.isAlive = false
        this._ws.ping(() => {})
      }
    }, 5000)

    this._ws.onmessage = (event) => {
      if (this._ws.readyState === WebSocket.OPEN) {
        try {
          const buf = event.data
          const sessionId = buf.readUInt32LE(0, true)
          const arrayBuffer = buf.buffer.slice(buf.byteOffset + 4, buf.byteOffset + 4 + buf.byteLength)

          const connection = this._connections[sessionId]
          if (connection) {
            connection.unmarshall(arrayBuffer)
          }
        } catch (error) {
          console.error(`Child ${process.pid} ${error}`)
          this._ws.close(1, 'received an illegal message')
        }
      }
    }
    this._ws.onclose = () => {
      console.log(`Child ${process.pid} websocket is closed.`)
      this.wlDisplay.terminate()
      this.wlDisplay.destroy()
      this.onTerminate()
    }
    this._ws.onerror = (error) => {
      console.error(`Child ${process.pid} websocket is in error. ${error}`)
      this._ws.terminate()
    }
  }

  _setupPrimaryConnection (resolve) {
    const wfcConnection = new westfield.Connection()
    this._connections[0] = wfcConnection
    this._setupWfcConnection(wfcConnection, 0)

    const registryProxy = wfcConnection.createRegistry()
    registryProxy.listener.global = (name, interface_, version) => {
      if (interface_ === session.GrSession.name) {
        const grSessionProxy = registryProxy.bind(name, interface_, version)
        grSessionProxy.listener = this
        this.grSessionProxy = grSessionProxy

        resolve(this)
      } else if (interface_.startsWith('Gr')) {
        this._setupShimGlobal(name, interface_, version)
      }
    }

    registryProxy.listener.globalRemove = (name) => {
      this._tearDownShimGlobal(name)
    }
  }

  _setupWfcConnection (wfcConnection, sessionId) {
    this._connections[sessionId] = wfcConnection
    wfcConnection.onClose().then(() => {
      delete this._connections[sessionId]
    })
    wfcConnection.onSend = (arrayBuffer) => {
      if (this._ws.readyState === WebSocket.OPEN) {
        try {
          const targetBuffer = Buffer.allocUnsafe(arrayBuffer.byteLength + 4)
          const sourceBuffer = Buffer.from(arrayBuffer)
          targetBuffer.fill(sourceBuffer, 4).writeUInt32LE(sessionId, 0, true)

          this._ws.send(targetBuffer.buffer.slice(targetBuffer.byteOffset, targetBuffer.byteOffset + targetBuffer.byteLength), (error) => {
            if (error !== undefined) {
              console.error(error)
              this._ws.terminate()
            }
          })
        } catch (error) {
          console.error(error)
          this._ws.terminate()
        }
      }
    }
  }

  /**
   * @param wlClient
   * @returns {Promise<LocalClient>}
   */
  createConnection (wlClient) {
    // TODO implement a timeout for the browser compositor to respond to the new client announcement
    return new Promise((resolve) => {
      const grClientSessionProxy = this.grSessionProxy.client()
      grClientSessionProxy.listener = LocalClientSession.create(this, resolve, wlClient, grClientSessionProxy)
    })
  }

  flush () {
    this.wlDisplay.flushClients()
  }
}
