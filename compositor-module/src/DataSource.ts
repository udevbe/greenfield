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
  WlDataDeviceManagerResourceDndAction,
  WlDataOfferResource,
  WlDataSourceRequests,
  WlDataSourceResource,
  WlDataSourceResourceError
} from 'westfield-runtime-server'

const { copy, move, ask, none } = WlDataDeviceManagerResourceDndAction
const ALL_ACTIONS = (copy | move | ask)

/**
 *
 *            The wl_data_source object is the source side of a wl_data_offer.
 *            It is created by the source client in a data transfer and
 *            provides a way to describe the offered data and a way to respond
 *            to requests to transfer the data.
 */
export default class DataSource implements WlDataSourceRequests {
  readonly resource: WlDataSourceResource
  mimeTypes: string[] = []
  dndActions: number = 0
  currentDndAction: WlDataDeviceManagerResourceDndAction = none
  accepted: boolean = false
  wlDataOffer?: WlDataOfferResource
  private _actionsSet: boolean = false

  static create(wlDataSourceResource: WlDataSourceResource): DataSource {
    const dataSource = new DataSource(wlDataSourceResource)
    wlDataSourceResource.implementation = dataSource
    return dataSource
  }

  private constructor(wlDataSourceResource: WlDataSourceResource) {
    this.resource = wlDataSourceResource
  }

  offer(resource: WlDataSourceResource, mimeType: string) {
    this.mimeTypes.push(mimeType)
    if (this.wlDataOffer) {
      this.wlDataOffer.offer(mimeType)
    }
  }

  destroy(resource: WlDataSourceResource) {
    resource.destroy()
  }

  setActions(resource: WlDataSourceResource, dndActions: number) {
    if (this._actionsSet) {
      resource.postError(WlDataSourceResourceError.invalidActionMask, 'cannot set actions more than once')
      return
    }

    if (this.dndActions & ~ALL_ACTIONS) {
      resource.postError(WlDataSourceResourceError.invalidActionMask, `invalid action mask ${dndActions}`)
      return
    }

    // TODO
    // if (source->seat) {
    //   wl_resource_post_error(source->resource,
    //     WL_DATA_SOURCE_ERROR_INVALID_ACTION_MASK,
    //     "invalid action change after "
    //   "wl_data_device.start_drag");
    //   return;
    // }

    this.dndActions = dndActions
    this._actionsSet = true
  }

  notifyFinish() {
    if (!this.dndActions) {
      return
    }

    if (this.wlDataOffer.implementation.inAsk && this.resource.version >= 3) {
      this.resource.action(this.currentDndAction)
    }

    if (this.resource >= 3) {
      this.resource.dndFinished()
    }

    this.wlDataOffer = undefined
  }
}
