'use strict'

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
   */
  constructor (connection, wlClient) {
    this.connection = connection
    this.wlClient = wlClient
    this.localCompositor = null
  }
}
