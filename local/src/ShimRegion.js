'use strict'

const WlRegionRequests = require('./protocol/wayland/WlRegionRequests')

module.exports = class ShimRegion extends WlRegionRequests {
  static create (grRegionProxy) {
    return new ShimRegion(grRegionProxy)
  }

  constructor (grRegionProxy) {
    super()
    this.proxy = grRegionProxy
  }

  destroy (resource) {
    resource.destroy()
    this.proxy.destroy()
  }

  add (resource, x, y, width, height) {
    this.proxy.add(x, y, width, height)
  }

  subtract (resource, x, y, width, height) {
    this.proxy.substract(x, y, width, height)
  }
}
