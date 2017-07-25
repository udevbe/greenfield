'use strict'

const scp = require('./protocol/session-client-protocol')
const wfc = require('./protocol/greenfield-client-protocol')
const WebSocket = require('ws')
const express = require('express')
const http = require('http')

export default class LocalSession {
  static create () {
    return new Promise((resolve, reject) => {
      const app = express()
      app.use(express.static('public'))

      const server = http.createServer()
      server.on('request', app)
      const wss = new WebSocket.Server({
        server: server,
        path: '/westfield'
      })

      const serverSession = new LocalSession(resolve)
      wss.on('connection', serverSession._onWsConnection)

      server.listen(8080)
    })
  }

  constructor (resolve) {
    this._resolve = resolve
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

  /**
   *
   * @param {WebSocket} ws
   * @private
   */
  _onWsConnection (ws) {
    const connection = new wfc.Connection()

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

    if (this.primaryConnection) {
      this.connectionPromises.shift()(connection)
    } else {
      this.primaryConnection = connection

      const registry = connection.createRegistry()
      registry.listener.global = (name, interface_, version) => {
        if (interface_ === 'GrSession') {
          const grSessionProxy = registry.bind(name, interface_, version)
          grSessionProxy.listener = this
          this.grSessionProxy = grSessionProxy

          this._resolve(this)
          delete this._resolve
        }
      }
    }
  }
}
