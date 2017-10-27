'use strict'

const westfield = require('westfield-runtime-client')
const session = require('./protocol/session-client-protocol')
const WebSocket = require('ws')

const ShimGlobal = require('./ShimGlobal')
const LocalClient = require('./LocalClient')
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
    this.primaryConnection = null
    this.connectionPromises = []
    this.globals = {}
    this._clientSessions = []
  }

  _handleUpgrade (request, socket, head) {
    return new Promise((resolve) => {
      this._wss.handleUpgrade(request, socket, head, (ws) => {
        const wfcConnection = new westfield.Connection()
        this._setupWebsocket(wfcConnection, ws)
        if (this.primaryConnection) {
          this._setupClientConnection(wfcConnection)
        } else {
          this._setupPrimaryConnection(wfcConnection, resolve)
        }
      })
    })
  }

  _setupShimGlobal (name, interface_, version) {
    this.globals[name] = ShimGlobal.create(this.wlDisplay, name, interface_, version)
  }

  _tearDownShimGlobal (name) {
    delete this.globals[name]
    // TODO remove native wayland global
  }

  _setupWebsocket (wfcConnection, ws) {
    wfcConnection.onSend = (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(data, (error) => {
            if (error !== undefined) {
              console.error(error)
              ws.close()
            }
          })
        } catch (error) {
          console.error(error)
          ws.close()
        }
      }
    }

    ws.onmessage = (event) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          const b = event.data
          const arrayBuffer = b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)
          wfcConnection.unmarshall(arrayBuffer)
        } catch (error) {
          console.error(error)
          ws.close()
        }
      }
    }

    ws.on('close', () => wfcConnection.close())
    wfcConnection.onClose().then(() => {
      ws.close()
    }).catch((error) => console.log(error))

    // TODO listen for error
  }

  _setupPrimaryConnection (wfcConnection, resolve) {
    this.primaryConnection = wfcConnection

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

  _setupClientConnection (wfcConnection) {
    const resolve = this.connectionPromises.shift()
    const wlClient = resolve._wlClient
    delete resolve._wlClient
    const localClient = LocalClient.create(wfcConnection, wlClient)

    // TODO destroy proxies once wayland or greenfield client is destroyed
    // create a 'public' registry for use with public protocol globals
    wlClient._clientRegistryProxy = localClient.connection.createRegistry()
    resolve(localClient)
  }

  /**
   * @param wlClient
   * @returns {Promise<wfc.Connection>}
   */
  createConnection (wlClient) {
    return new Promise((resolve) => {
      resolve._wlClient = wlClient
      this.connectionPromises.push(resolve)

      const grClientSessionProxy = this.grSessionProxy.client()
      const localClientSession = LocalClientSession.create(this._clientSessions, this.wlDisplay)
      grClientSessionProxy.listener = localClientSession
      this._clientSessions.push(localClientSession)

      // TODO listen for client destruction & notify browser compositor
      // localClient.connection.onClose().then(() => {
      //   const index = this._clientSessions.indexOf(localClientSession)
      //   if (index > -1) {
      //     this._clientSessions.splice(index, 1)
      //   }
      // }).catch((error) => console.log(error))
    })
  }
}
