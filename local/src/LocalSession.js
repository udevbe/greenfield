'use strict'

// import session so we can bind to it's proxies in 'registry.listener.global = ...'
// FIXME Force the user to import this namespace by eg. exposing the interface name as a scoped variable
const westfield = require('westfield-runtime-client')
const session = require('./protocol/session-client-protocol')
const WebSocket = require('ws')
const express = require('express')
const http = require('http')

module.exports = class LocalSession {
  /**
   *
   * @returns {Promise<LocalSession>}
   */
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
        // TODO tie localSession &  to primaryConnection lifecycle

        if (localSession.primaryConnection) {
          localSession.connectionPromises.shift()(wfcConnection)
        } else {
          localSession.primaryConnection = wfcConnection

          const registryProxy = wfcConnection.createRegistry()
          registryProxy.listener.global = (name, interface_, version) => {
            if (interface_ === session.GrSessionName) {
              const grSessionProxy = registryProxy.bind(name, interface_, version)
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
