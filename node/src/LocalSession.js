'use strict'

// import session so we can bind to it's proxies in 'registry.listener.global = ...'
// FIXME Force the user to import this namespace by eg. exposing the interface name as a scoped variable
const session = require('./protocol/session-client-protocol')
const westfield = require('westfield-runtime-client')
const WebSocket = require('ws')
const express = require('express')
const http = require('http')

module.exports = class LocalSession {
  static create () {
    return new Promise((resolve, reject) => {
      const app = express()
      app.use(express.static('/home/zubzub/git/greenfield/browser/public'))

      const server = http.createServer()
      server.on('request', app)
      const wss = new WebSocket.Server({
        server: server,
        path: '/greenfield'
      })

      const localSession = new LocalSession(wss, resolve)
      wss.on('connection', (ws) => {
        const connection = new westfield.Connection()

        connection.onSend = (data) => {
          ws.send(data)
        }

        ws.onmessage = (event) => {
          const b = event.data
          const arrayBuffer = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
          connection.unmarshall(arrayBuffer)
        }

        //TODO listen for disconnect
        //TODO listen for error
        //TODO tie localSession &  to primaryConnection lifecycle

        if (localSession.primaryConnection) {
          localSession.connectionPromises.shift()(connection)
        } else {
          localSession.primaryConnection = connection

          const registry = connection.createRegistry()
          registry.listener.global = (name, interface_, version) => {
            //FIXME Don't harcode the interface name, instead get it from an imported namespace
            if (interface_ === 'GrSession') {
              const grSessionProxy = registry.bind(name, interface_, version)
              grSessionProxy.listener = localSession
              localSession.grSessionProxy = grSessionProxy

              resolve(localSession)
            }
          }
        }
      })

      server.listen(8080)
    })
  }

  constructor (wss) {
    this._wss = wss
    this.primaryConnection = null
    this.connectionPromises = []
  }

  /**
   *
   * @returns {Promise<westfield.Connection>}
   */
  createConnection () {
    return new Promise((resolve, reject) => {
      this.connectionPromises.push(resolve)
      this.grSessionProxy.client()
    })
  }

  /**
   *
   * @param {WebSocket} ws
   * @private
   */
  _onWsConnection (ws) {

  }
}
