'use strict'

const WlDataSourceRequests = require('./protocol/wayland/WlDataSourceRequests')

module.exports = class ShimDataSource extends WlDataSourceRequests {
  static create (grDataSourceProxy) {
    return new ShimDataSource(grDataSourceProxy)
  }

  constructor (grDataSourceProxy) {
    super()
    this.proxy = grDataSourceProxy
  }

  offer (resource, mimeType) {
    this.proxy.offer(mimeType)
  }

  destroy (resource) {
    this.proxy.destroy()
    resource.destroy()
  }

  setActions (resource, dndActions) {
    this.proxy.setActions(dndActions)
  }
}
