'use strict'

const wsb = require('wayland-server-bindings-runtime')
const Listener = wsb.Listener

const greenfield = require('./protocol/greenfield-client-protocol')
const LocalCompositor = require('./LocalCompositor')

module.exports = class LocalClient {
  /**
   *
   * @param {wfc.Connection} wfcConnection westfield client connection
   * @param {wsb.Client} wlClient A native wayland client
   * @returns {Promise<LocalClient>}
   */
  static create (wfcConnection, wlClient) {
    return new Promise((resolve, reject) => {
      const localClient = new LocalClient(wfcConnection, wlClient)

      const listener = Listener.create(localClient._handleDestroy.bind(localClient))
      wlClient.addDestroyListener(listener)

      const registryProxy = wfcConnection.createRegistry()
      // FIXME listen for global removal
      registryProxy.listener.global = (name, interface_, version) => {
        if (interface_ === greenfield.GrCompositorName) {
          const grCompositoryProxy = registryProxy.bind(name, interface_, version)
          const localCompositor = LocalCompositor.create(grCompositoryProxy)
          grCompositoryProxy.listener = localCompositor

          localClient.localCompositor = localCompositor
        }

        // only resolve if we have all minimum required globals
        if (localClient.localCompositor) {
          resolve(localClient)
        }
      }
    })
  }

  /**
   *
   * @param {wfc.Connection} connection
   * @param {wsb.Client} wlClient A native wayland client
   */
  constructor (connection, wlClient) {
    this.connection = connection
    this.wlClient = wlClient
    this.localCompositor = null

    this._wlClientDetroyedPromise = [new Promise((resolve, reject) => {
      this._destroyedResolver = resolve
    })]
  }

  /**
   *
   * @returns {Promise.<LocalClient>}
   */
  onDestroy () {
    return Promise.race(this._wlClientDetroyedPromise)
  }

  _handleDestroy () {
    this._destroyedResolver(this)
    this.connection.close()
  }
}
