'use strict'
import GrDataDeviceManagerRequests from './protocol/GrDataDeviceManagerRequests'
import GrDataDeviceManagerResource from './protocol/GrDataDeviceManagerResource'
import GrDataSourceResource from './protocol/GrDataSourceResource'
import GrDataDeviceResource from './protocol/GrDataDeviceResource'

import DataSource from './DataSource'

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
 * @implements GrDataDeviceManagerRequests
 */
export default class DataDeviceManager extends GrDataDeviceManagerRequests {
  /**
   * @return {DataDeviceManager}
   */
  static create () {
    return new DataDeviceManager()
  }

  constructor () {
    super()
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    registry.createGlobal(this, GrDataDeviceManagerResource.name, 3, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  bindClient (client, id, version) {
    const grDataDeviceManagerResource = new GrDataDeviceManagerResource(client, id, version)
    grDataDeviceManagerResource.implementation = this
  }

  /**
   *
   *                Create a new data source.
   *
   *
   * @param {GrDataDeviceManagerResource} resource
   * @param {number} id data source to create
   *
   * @since 1
   * @override
   */
  createDataSource (resource, id) {
    const grDataSourceResource = new GrDataSourceResource(resource.client, id, resource.version)
    DataSource.create(grDataSourceResource)
  }

  /**
   *
   *                Create a new data device for a given seat.
   *
   *
   * @param {GrDataDeviceManagerResource} resource
   * @param {number} id data device to create
   * @param {GrSeat} seatResource seat associated with the data device
   *
   * @since 1
   * @override
   */
  getDataDevice (resource, id, seatResource) {
    const grDataDeviceResource = new GrDataDeviceResource(resource.client, id, resource.version)
    const seat = /** @type {Seat} */seatResource.implementation
    grDataDeviceResource.implementation = seat.dataDevice
    seat.dataDevice.resources.push(grDataDeviceResource)
  }
}
