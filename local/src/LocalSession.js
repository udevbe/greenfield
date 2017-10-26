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
    this._setupLocalClientSession(localClient)
    // create a 'public' registry for use with public protocol globals
    wlClient._clientRegistryProxy = localClient.connection.createRegistry()
    resolve(localClient)
  }

  _setupLocalClientSession (localClient) {
    // create 'private' registry proxy to bind to private protocol globals
    const privateClientRegistryProxy = localClient.connection.createRegistry()
    privateClientRegistryProxy.listener.global = (name, interface_, version) => {
      if (interface_ === session.GrClientSession.name) {
        const grClientSessionProxy = privateClientRegistryProxy.bind(name, interface_, version)
        const localClientSession = LocalClientSession.create()
        grClientSessionProxy.listener = localClientSession
        this._clientSessions.push(localClientSession)

        // remove client session object if client disconnects
        localClient.connection.onClose().then(() => {
          const index = this._clientSessions.indexOf(localClientSession)
          if (index > -1) {
            this._clientSessions.splice(index, 1)
          }
        }).catch((error) => console.log(error))
      }
    }
  }

  /**
   *@param wlClient
   * @returns {Promise<wfc.Connection>}
   */
  createConnection (wlClient) {
    return new Promise((resolve) => {
      resolve._wlClient = wlClient
      this.connectionPromises.push(resolve)
      this.grSessionProxy.client()
    })
  }

  /**
   * @since 1
   *
   */
  flush () {
    // console.log('flushing')
    setTimeout(() => {
      // if we encounter a client session who's flush mark is net yet set, reschedule and return
      for (const clientSession of this._clientSessions) {
        if (clientSession.flush === false) {
          this.flush()
          return
        }
      }

      // all client sessions flush marks have been set, perform the flush and set back the marks
      this.wlDisplay.flushClients()
      this._clientSessions.forEach((clientSession) => {
        clientSession.flush = false
      })
    }, 0)
  }
}
