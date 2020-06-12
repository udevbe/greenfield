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

import {
  Client,
  Global,
  Registry,
  WlDataDeviceManagerRequests,
  WlDataDeviceManagerResource,
  WlDataDeviceResource,
  WlDataSourceResource, WlSeatResource
} from 'westfield-runtime-server'

import DataSource from './DataSource'
import Seat from './Seat'

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
 */
export default class DataDeviceManager implements WlDataDeviceManagerRequests {
  private _global?: Global

  static create(): DataDeviceManager {
    return new DataDeviceManager()
  }

  private constructor() {
  }

  registerGlobal(registry: Registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlDataDeviceManagerResource.protocolName, 3, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal() {
    if (this._global === undefined) {
      return
    }
    this._global.destroy()
    this._global = undefined
  }

  bindClient(client: Client, id: number, version: number) {
    const wlDataDeviceManagerResource = new WlDataDeviceManagerResource(client, id, version)
    wlDataDeviceManagerResource.implementation = this
  }

  createDataSource(resource: WlDataDeviceManagerResource, id: number) {
    const wlDataSourceResource = new WlDataSourceResource(resource.client, id, resource.version)
    DataSource.create(wlDataSourceResource)
  }

  getDataDevice(resource: WlDataDeviceManagerResource, id: number, seatResource: WlSeatResource) {
    const wlDataDeviceResource = new WlDataDeviceResource(resource.client, id, resource.version)
    const seat = seatResource.implementation as Seat
    wlDataDeviceResource.implementation = seat.dataDevice
    seat.dataDevice.resources.push(wlDataDeviceResource)
  }
}
