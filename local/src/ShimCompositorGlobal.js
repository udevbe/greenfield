'use strict'

const {Global, Client} = require('wayland-server-bindings-runtime')
const wl_compositor = require('./protocol/wayland/wl_compositor')
const ShimCompositor = require('./ShimCompositor')

module.exports = class ShimCompositorGlobal extends Global {
  static create (wlDisplay, localClients) {
    return new ShimCompositorGlobal(wlDisplay, localClients)
  }

  constructor (wlDisplay, localClients) {
    super(wlDisplay, wl_compositor.interface_, 4, null, (client, data, version, id) => { this.bind(client, data, version, id) })
    this._localClients = localClients
  }

  bind (wlClient, data, version, id) {
    // find matching local client based on wayland wlClient & use it to get the matching global proxy
    const localClient = this._localClients.find((localClient) => {
      return localClient.wlClient.address() === wlClient.address()
    })

    const localCompositor = localClient.localCompositor
    const grCompositorProxy = localCompositor.grCompositorProxy
    const shimCompositor = ShimCompositor.create(grCompositorProxy)

    localCompositor.resource = wl_compositor.create(new Client(wlClient), version, id, shimCompositor, null)
  }
}
