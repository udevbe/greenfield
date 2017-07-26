const LocalCompositor = require('./LocalCompositor')

module.exports = class LocalClient {
  static create (connection) {
    return new Promise((resolve, reject) => {
      const localClient = new LocalClient(connection)

      const registry = connection.createRegistry()
      // FIXME listen for global removal
      registry.listener.global = (name, interface_, version) => {
        if (interface_ === 'GrCompositor') {
          const grCompositoryProxy = registry.bind(name, interface_, version)
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