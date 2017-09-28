'use strict'

const westfield = require('westfield-runtime-client')
const session = require('./protocol/session-client-protocol')
const WebSocket = require('ws')

const ShimGlobal = require('./ShimGlobal')
const LocalClient = require('./LocalClient')

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

  _handleUpgrade (request, socket, head) {
    return new Promise((resolve) => {
      this._wss.handleUpgrade(request, socket, head, (ws) => {
        const wfcConnection = new westfield.Connection()

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
        wfcConnection.onClose().then(() => ws.close()).catch((error) => console.log(error))

        // TODO listen for error

        if (this.primaryConnection) {
          const resolve = this.connectionPromises.shift()
          const wlClient = resolve._wlClient
          delete resolve._wlClient
          const localClient = LocalClient.create(wfcConnection, wlClient)

          const clientRegistryProxy = localClient.connection.createRegistry()
          Object.values(this.globals).forEach((global) => {
            global.announceClient(wlClient, clientRegistryProxy)
          })

          resolve(localClient)
        } else {
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
      })
    })
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
  }

  _setupShimGlobal (name, interface_, version) {
    this.globals[name] = ShimGlobal.create(this.wlDisplay, name, interface_, version)
  }

  _tearDownShimGlobal (name) {
    delete this.globals[name]
    // TODO remove native wayland global
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
}
