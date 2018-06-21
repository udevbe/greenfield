'use strict'

import { Global } from 'westfield-runtime-server'
import { GrDataDeviceManager, GrDataSource, GrDataDevice } from './protocol/greenfield-browser-protocol'
import BrowserDataSource from './BrowserDataSource'

/**
 *
 *            The gr_data_device_manager is a singleton global object that
 *            provides access to inter-client data transfer mechanisms such as
 *            copy-and-paste and drag-and-drop.  These mechanisms are tied to
 *            a gr_seat and this interface lets a client get a gr_data_device
 *            corresponding to a gr_seat.
 *
 *            Depending on the version bound, the objects created from the bound
 *            gr_data_device_manager object will have different requirements for
 *            functioning properly. See gr_data_source.set_actions,
 *            gr_data_offer.accept and gr_data_offer.finish for details.
 *
 */
export default class BrowserDataDeviceManager extends Global {
  static create () {
    return new BrowserDataDeviceManager()
  }

  constructor () {
    super(GrDataDeviceManager.name, 3)
  }

  bindClient (client, id, version) {
    const grDataDeviceManagerResource = new GrDataDeviceManager(client, id, version)
    grDataDeviceManagerResource.implementation = this
  }

  /**
   *
   *                Create a new data source.
   *
   *
   * @param {GrDataDeviceManager} resource
   * @param {number} id data source to create
   *
   * @since 1
   *
   */
  createDataSource (resource, id) {
    const grDataSourceResource = new GrDataSource(resource.client, id, resource.version)
    BrowserDataSource.create(grDataSourceResource)
  }

  /**
   *
   *                Create a new data device for a given seat.
   *
   *
   * @param {GrDataDeviceManager} resource
   * @param {number} id data device to create
   * @param {GrSeat} seat seat associated with the data device
   *
   * @since 1
   *
   */
  getDataDevice (resource, id, seat) {
    const grDataDeviceResource = new GrDataDevice(resource.client, id, resource.version)
    grDataDeviceResource.implementation = seat.implementation.browserDataDevice
    seat.implementation.browserDataDevice.resources.push(grDataDeviceResource)
  }
}
