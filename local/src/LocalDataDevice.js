'use strict'

const WlDataOffer = require('./protocol/wayland/WlDataOffer')
const greenfield = require('./protocol/greenfield-client-protocol')
const LocalDataOffer = require('./LocalDataOffer')
const ShimDataOffer = require('./ShimDataOffer')

module.exports = class LocalDataDevice {
  static create (connection) {
    return new LocalDataDevice(connection)
  }

  constructor (connection) {
    this.resource = null
    this._connection = connection
  }

  dataOffer (grDataOfferProxy) {
    /*
     * This is a bit of a mess.
     *
     * The wayland protocol always makes the client initiate object creation...except for this case.
     *
     * We need to create a listener for this proxy.
     * This listener must delegate it's events to the shim resource. Which we have to create first. By assigning
     * it an id '0', libwayland will know it's a server side create object. We then send the assigned id to the
     * client.
     */
    const localDataOffer = LocalDataOffer.create()
    grDataOfferProxy.listener = localDataOffer

    const shimDataOffer = ShimDataOffer.create(grDataOfferProxy)
    const wlDataOfferResource = WlDataOffer.create(this.resource.client, this.resource.version, 0, shimDataOffer, null)
    localDataOffer.resource = wlDataOfferResource

    this.resource.dataOffer(wlDataOfferResource)
  }

  enter (serial, surface, x, y, id) {
    this.resource.enter(serial, surface.listener.resource, x, y, id.listener.resource)
  }

  leave () {
    this.resource.leave()
  }

  motion (time, x, y) {
    this.resource.motion(time, x, y)
  }

  drop () {
    this.resource.drop()
  }

  selection (id) {
    this.resource.selection(id.listener.resource)
  }
}
