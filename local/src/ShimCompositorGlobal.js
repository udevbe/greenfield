'use strict'

const wsb = require('wayland-server-bindings-runtime')
const Global = wsb.Global
const Client = wsb.Client

const wl_compositorV4 = require('./protocol/wayland/wl_compositorV4')

const ShimCompositor = require('./ShimCompositor')

module.exports = class ShimCompositorGlobal extends Global {
  static create (wlDisplay, localClients) {
    return new ShimCompositorGlobal(wlDisplay, localClients)
  }

  constructor (wlDisplay, localClients) {
    super(wlDisplay, wl_compositorV4.interface, 4, null, (client, data, version, id) => { this.bind(client, data, version, id) })
    this._localClients = localClients
  }

  bind (wlClient, data, version, id) {
    // find matching local client based on wayland wlClient & use it to get the matching global proxy
    const localClient = this._localClients.find((localClient) => {
      return localClient.wlClient.address() === wlClient.address()
    })

    // FIXME there's a race here where the client can bind to a shim global before we have a local client with a matching
    // global proxy

    const localCompositor = localClient.localCompositor
    const grCompositorProxy = localCompositor.grCompositorProxy
    const shimCompositor = ShimCompositor.create(grCompositorProxy)

    const wlCompositorResource = wl_compositorV4.create(new Client(wlClient), version, id, shimCompositor, null)
    localCompositor.wlCompositorResource = wlCompositorResource
  }
}
