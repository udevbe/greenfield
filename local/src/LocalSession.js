'use strict'

const westfield = require('westfield-runtime-client')
const session = require('./protocol/session-client-protocol')
const WebSocket = require('ws')

module.exports = class LocalSession {
  /**
   * @param request http ws upgrade request
   * @param socket http socket
   * @returns {Promise<LocalSession>}
   */
  static create (request, socket) {
    const wss = new WebSocket.Server({
      noServer: true
      // path: '/greenfield'
    })
    return new LocalSession(wss)._handleUpgrade(request, socket)
  }

  _handleUpgrade (request, socket) {
    return new Promise((resolve, reject) => {
      this._wss.handleUpgrade(request, socket, undefined, (ws) => {
        const wfcConnection = new westfield.Connection()

        wfcConnection.onSend = (data) => {
          ws.send(data)
        }

        ws.onmessage = (event) => {
          const b = event.data
          const arrayBuffer = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
          wfcConnection.unmarshall(arrayBuffer)
        }

        // TODO listen for disconnect
        // TODO listen for error
        // TODO tie localSession to primaryConnection lifecycle, wayland apps should be tied to their own connection

        if (this.primaryConnection) {
          this.connectionPromises.shift()(wfcConnection)
          resolve(this)
        } else {
          this.primaryConnection = wfcConnection

          const registryProxy = wfcConnection.createRegistry()
          registryProxy.listener.global = (name, interface_, version) => {
            if (interface_ === session.GrSessionName) {
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
    return new Promise((resolve, reject) => {
      this.connectionPromises.push(resolve)
      this.grSessionProxy.client()
    })
  }
}
