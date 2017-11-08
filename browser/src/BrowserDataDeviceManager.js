'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'

export default class BrowserDataDeviceManager extends westfield.Global {
  static create (browserSession) {
    const browserDataDeviceManager = new BrowserDataDeviceManager()
    browserSession.wfsServer.registry.register(browserDataDeviceManager)
    return browserDataDeviceManager
  }

  constructor () {
    super(greenfield.GrDataDeviceManager.name, 1)
  }

  bindClient (client, id, version) {
    const grDataDeviceManagerResource = new greenfield.GrDataDeviceManager(client, id, version)
    grDataDeviceManagerResource.implementation = this
  }

  /**
   *
   *                Create a new data source.
   *
   *
   * @param {GrDataDeviceManager} resource
   * @param {*} id data source to create
   *
   * @since 1
   *
   */
  createDataSource (resource, id) {}

  /**
   *
   *                Create a new data device for a given seat.
   *
   *
   * @param {GrDataDeviceManager} resource
   * @param {*} id data device to create
   * @param {*} seat seat associated with the data device
   *
   * @since 1
   *
   */
  getDataDevice (resource, id, seat) {}
}
