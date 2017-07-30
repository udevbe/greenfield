const greenfield = require('./protocol/greenfield-client-protocol')
const LocalCompositor = require('./LocalCompositor')

module.exports = class LocalClient {
  /**
   *
   * @param {wfs.Connection} wfsConnection
   * @returns {Promise<LocalClient>}
   */
  static create (wfsConnection) {
    return new Promise((resolve, reject) => {
      const localClient = new LocalClient(wfsConnection)

      const registryProxy = wfsConnection.createRegistry()
      // FIXME listen for global removal
      registryProxy.listener.global = (name, interface_, version) => {
        // FIXME Don't harcode the interface name, instead get it from an imported namespace
        if (interface_ === 'GrCompositor') {
          const grCompositoryProxy = registryProxy.bind(name, interface_, version)
          const localCompositor = LocalCompositor.create(grCompositoryProxy)
          grCompositoryProxy.listener = localCompositor

          localClient.compositor = localCompositor
        }

        // only resolve if we have all minimum required globals
        if (localClient.compositor) {
          resolve(localClient)
        }
      }
    })
  }

  constructor (connection) {
    this.connection = connection
    this.compositor = null
  }
}