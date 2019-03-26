// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

import WlDataDeviceManagerRequests from './protocol/WlDataDeviceManagerRequests'
import WlDataDeviceManagerResource from './protocol/WlDataDeviceManagerResource'
import WlDataSourceResource from './protocol/WlDataSourceResource'
import WlDataDeviceResource from './protocol/WlDataDeviceResource'

import DataSource from './DataSource'

/**
 *
 *            The wldata_device_manager is a singleton global object that
 *            provides access to inter-client data transfer mechanisms such as
 *            copy-and-paste and drag-and-drop.  These mechanisms are tied to
 *            a wlseat and this interface lets a client get a wldata_device
 *            corresponding to a wlseat.
 *
 *            Depending on the version bound, the objects created from the bound
 *            wldata_device_manager object will have different requirements for
 *            functioning properly. See wldata_source.set_actions,
 *            wldata_offer.accept and wldata_offer.finish for details.
 * @implements WlDataDeviceManagerRequests
 */
export default class DataDeviceManager extends WlDataDeviceManagerRequests {
  /**
   * @return {DataDeviceManager}
   */
  static create () {
    return new DataDeviceManager()
  }

  constructor () {
    super()
    /**
     * @type {Global}
     * @private
     */
    this._global = null
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlDataDeviceManagerResource.protocolName, 3, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal () {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = null
  }

  /**
   *
   * Invoked when a client binds to this global.
   *
   * @param {!Client} client
   * @param {!number} id
   * @param {!number} version
   */
  bindClient (client, id, version) {
    const wlDataDeviceManagerResource = new WlDataDeviceManagerResource(client, id, version)
    wlDataDeviceManagerResource.implementation = this
  }

  /**
   *
   *                Create a new data source.
   *
   *
   * @param {WlDataDeviceManagerResource} resource
   * @param {number} id data source to create
   *
   * @since 1
   * @override
   */
  createDataSource (resource, id) {
    const wlDataSourceResource = new WlDataSourceResource(resource.client, id, resource.version)
    DataSource.create(wlDataSourceResource)
  }

  /**
   *
   *                Create a new data device for a given seat.
   *
   *
   * @param {WlDataDeviceManagerResource} resource
   * @param {number} id data device to create
   * @param {WlSeat} seatResource seat associated with the data device
   *
   * @since 1
   * @override
   */
  getDataDevice (resource, id, seatResource) {
    const wlDataDeviceResource = new WlDataDeviceResource(resource.client, id, resource.version)
    const seat = /** @type {Seat} */seatResource.implementation
    wlDataDeviceResource.implementation = seat.dataDevice
    seat.dataDevice.resources.push(wlDataDeviceResource)
  }
}
