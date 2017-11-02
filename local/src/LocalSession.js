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
    const wss = new WebSocket.Server({
      noServer: true
      // path: '/greenfield'
    })
    return new LocalSession(wss, wlDisplay)._handleUpgrade(request, socket, head)
  }

  /**
   *
   * @param {WebSocket.Server} wss
   * @param wlDisplay
   */
  constructor (wss, wlDisplay) {
    this._wss = wss
    this.wlDisplay = wlDisplay
    this._connections = {}
    this.globals = {}
  }

  _handleUpgrade (request, socket, head) {
    return new Promise((resolve) => {
      this._wss.handleUpgrade(request, socket, head, (ws) => {
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

  _setupWebsocket () {
    this._ws.onmessage = (event) => {
      if (this._ws.readyState === WebSocket.OPEN) {
        try {
          const buf = event.data
          const sessionId = buf.readUInt32LE(0, true)
          const arrayBuffer = buf.buffer.slice(buf.byteOffset + 4, buf.byteOffset + 4 + buf.byteLength)

          this._connections[sessionId].unmarshall(arrayBuffer)
        } catch (error) {
          console.error(error)
          this._ws.close()
        }
      }
    }
    // TODO listen for error
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
    wfcConnection.onSend = (arrayBuffer) => {
      if (this._ws.readyState === WebSocket.OPEN) {
        try {
          const targetBuffer = Buffer.allocUnsafe(arrayBuffer.byteLength + 4)
          const sourceBuffer = Buffer.from(arrayBuffer)
          targetBuffer.fill(sourceBuffer, 4).writeUInt32LE(sessionId, 0, true)

          this._ws.send(targetBuffer.buffer.slice(targetBuffer.byteOffset, targetBuffer.byteOffset + targetBuffer.byteLength), (error) => {
            if (error !== undefined) {
              console.error(error)
              this._ws.close()
            }
          })
        } catch (error) {
          console.error(error)
          this._ws.close()
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
