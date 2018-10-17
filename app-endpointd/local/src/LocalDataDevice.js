'use strict'

const WlDataOffer = require('./protocol/wayland/WlDataOffer')
const LocalDataOffer = require('./LocalDataOffer')
const ShimDataOffer = require('./ShimDataOffer')

class LocalDataDevice {
  /**
   * @param {wfc.Connection}connection
   * @return {LocalDataDevice}
   */
  static create (connection) {
    return new LocalDataDevice(connection)
  }

  /**
   * @param {wfc.Connection}connection
   * @private
   */
  constructor (connection) {
    /**
     * @type {WlDataDevice|null}
     */
    this.resource = null
    /**
     * @type {wfc.Connection}
     * @private
     */
    this._connection = connection
  }

  /**
   * @param {wfc.GrDataOffer}grDataOfferProxy
   */
  dataOffer (grDataOfferProxy) {
    if (grDataOfferProxy == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
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

    grDataOfferProxy.onError = (code, message) => {
      localDataOffer.resource.postError(code, message)
    }

    this.resource.dataOffer(wlDataOfferResource)
  }

  /**
   * @param {number}serial
   * @param {wfc.GrSurface}surface
   * @param {number}x
   * @param {number}y
   * @param {wfc.GrDataOffer}id
   */
  enter (serial, surface, x, y, id) {
    if (surface == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
    this.resource.enter(serial, surface.listener.resource, x, y, id.listener.resource)
  }

  leave () {
    this.resource.leave()
  }

  /**
   * @param {number}time
   * @param {number}x
   * @param {number}y
   */
  motion (time, x, y) {
    this.resource.motion(time, x, y)
  }

  drop () {
    this.resource.drop()
  }

  /**
   * @param {wfc.GrDataOffer}id
   */
  selection (id) {
    this.resource.selection(id === null ? null : id.listener.resource)
  }
}

module.exports = LocalDataDevice
