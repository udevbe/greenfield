'use strict'

const westfield = require('westfield-runtime-client')
const session = require('./protocol/session-client-protocol')
const WebSocket = require('ws')

module.exports = class LocalSession {
  /**
   * @param request http ws upgrade request
   * @param socket http socket
   * @param head http head
   * @returns {Promise<LocalSession>}
   */
  static create (request, socket, head) {
    const wss = new WebSocket.Server({
      noServer: true
      // path: '/greenfield'
    })
    return new LocalSession(wss)._handleUpgrade(request, socket, head)
  }

  _handleUpgrade (request, socket, head) {
    return new Promise((resolve) => {
      this._wss.handleUpgrade(request, socket, head, (ws) => {
        const wfcConnection = new westfield.Connection()

        wfcConnection.onSend = (data) => {
          ws.send(data)
        }

        ws.onmessage = (event) => {
          const b = event.data
          const arrayBuffer = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
          wfcConnection.unmarshall(arrayBuffer)
        }

        ws.on('close', () => wfcConnection.close())
        wfcConnection.onClose().then(() => ws.close())

        // TODO listen for error

        if (this.primaryConnection) {
          this.connectionPromises.shift()(wfcConnection)
          resolve(this)
        } else {
          this.primaryConnection = wfcConnection

          const registryProxy = wfcConnection.createRegistry()
          registryProxy.listener.global = (name, interface_, version) => {
            if (interface_ === session.GrSession.name) {
              const grSessionProxy = registryProxy.bind(name, interface_, version)
              grSessionProxy.listener = this
              this.grSessionProxy = grSessionProxy
              resolve(this)
            }
          }
        }
      })
    })
  }

  /**
   *
   * @param {WebSocket.Server} wss
   */
  constructor (wss) {
    this._wss = wss
    this.primaryConnection = null
    this.connectionPromises = []
  }

  /**
   *
   * @returns {Promise<wfc.Connection>}
   */
  createConnection () {
    return new Promise((resolve) => {
      this.connectionPromises.push(resolve)
      this.grSessionProxy.client()
    })
  }
}
