'use strict'

const WlDataOfferRequests = require('./protocol/wayland/WlDataOfferRequests')

module.exports = class ShimDataOffer extends WlDataOfferRequests {
  /**
   * @param {GrDataOffer}grDataOfferProxy
   * @return {module.ShimDataOffer}
   */
  static create (grDataOfferProxy) {
    return new ShimDataOffer(grDataOfferProxy)
  }

  constructor (grDataOfferProxy) {
    super()
    this.proxy = grDataOfferProxy
  }

  accept (resource, serial, mimeType) {
    this.proxy.accept(serial, mimeType)
  }

  receive (resource, mimeType, fd) {
    this.proxy.receive(mimeType, fd)
  }

  destroy (resource) {
    this.proxy.destroy()
    resource.destroy()
  }

  finish (resource) {
    this.proxy.finish()
  }

  setActions (resource, dndActions, preferredAction) {
    this.proxy.setActions(dndActions, preferredAction)
  }
}
