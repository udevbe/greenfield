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

import { WebFD } from 'westfield-runtime-common'
import {
  WlDataDeviceManagerDndAction,
  WlDataDeviceResource,
  WlDataOfferRequests,
  WlDataOfferResource,
  WlDataOfferError,
  WlDataSourceResource,
} from 'westfield-runtime-server'
import DataSource from './DataSource'

const { copy, move, ask, none } = WlDataDeviceManagerDndAction
const ALL_ACTIONS = copy | move | ask

/**
 *
 *            A wl_data_offer represents a piece of data offered for transfer
 *            by another client (the source client).  It is used by the
 *            copy-and-paste and drag-and-drop mechanisms.  The offer
 *            describes the different mime types that the data can be
 *            converted to and provides the mechanism for transferring the
 *            data directly from the source client.
 */
export default class DataOffer implements WlDataOfferRequests {
  // @ts-ignore set in static create method
  resource: WlDataOfferResource
  acceptMimeType?: string
  preferredAction = 0
  dndActions: WlDataDeviceManagerDndAction = none
  wlDataSource: WlDataSourceResource
  inAsk = false
  private readonly _finished: boolean = false

  static create(source: WlDataSourceResource, offerId: number, dataDeviceResource: WlDataDeviceResource): DataOffer {
    const dataOffer = new DataOffer(source)
    const wlDataOfferResource = new WlDataOfferResource(dataDeviceResource.client, offerId, dataDeviceResource.version)
    wlDataOfferResource.implementation = dataOffer
    dataOffer.resource = wlDataOfferResource
    wlDataOfferResource.onDestroy().then(() => dataOffer._handleDestroy())

    return dataOffer
  }

  private constructor(source: WlDataSourceResource) {
    this.wlDataSource = source
    this._finished = false
    this.inAsk = false
  }

  private _handleDestroy() {
    if (!this.wlDataSource) {
      return
    }

    // TODO remove source destroy listener
    // TODO add source destroy listener
    // wl_list_remove(&offer->source_destroy_listener.link);

    const dataSoure = this.wlDataSource.implementation as DataSource | undefined
    if (dataSoure === undefined || !(dataSoure instanceof DataSource)) {
      throw new Error('BUG. data source resource must have data source implementation set.')
    }
    if (dataSoure.wlDataOffer !== this.resource) {
      return
    }

    /* If the drag destination has version < 3, wl_data_offer.finish
     * won't be called, so do this here as a safety net, because
     * we still want the version >=3 drag source to be happy.
     */
    if (this.resource.version < 3) {
      dataSoure.notifyFinish()
    } else if (this.wlDataSource && this.wlDataSource.version >= 3) {
      this.wlDataSource.cancelled()
    }

    dataSoure.wlDataOffer = undefined
  }

  accept(resource: WlDataOfferResource, serial: number, mimeType: string | undefined) {
    if (this.wlDataSource === undefined) {
      return
    }
    const dataSource = this.wlDataSource.implementation as DataSource
    if (dataSource.wlDataOffer === undefined) {
      return
    }

    if (this._finished) {
      // TODO raise protocol error
    }

    this.acceptMimeType = mimeType
    this.wlDataSource.target(mimeType)
    dataSource.accepted = mimeType !== null
  }

  receive(resource: WlDataOfferResource, mimeType: string, fd: WebFD) {
    if (this._finished) {
      // TODO raise protocol error
    }
    if (this.wlDataSource) {
      this.wlDataSource.send(mimeType, fd)
    }
  }

  destroy(resource: WlDataOfferResource) {
    resource.destroy()
  }

  finish(resource: WlDataOfferResource) {
    if (!this.wlDataSource || !this.preferredAction) {
      return
    }
    if (!this.acceptMimeType || this._finished) {
      return
    }

    /* Disallow finish while we have a grab driving drag-and-drop, or
     * if the negotiation is not at the right stage
     */
    const dataSource = this.wlDataSource.implementation as DataSource
    if (!dataSource.accepted) {
      resource.postError(WlDataOfferError.invalidFinish, 'premature finish request')
      return
    }

    switch (dataSource.currentDndAction) {
      case none:
      case ask:
        resource.postError(WlDataOfferError.invalidOffer, 'offer finished with an invalid action')
        return
      default:
        break
    }

    dataSource.notifyFinish()
  }

  private _bitCount(u: number): number {
    // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
    const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111)
    return ((uCount + (uCount >> 3)) & 0o30707070707) % 63
  }

  setActions(resource: WlDataOfferResource, dndActions: number, preferredAction: number) {
    if (!this.wlDataSource) {
      return
    }
    if (this._finished) {
      // TODO raise protocol error
    }

    if (dndActions & ~ALL_ACTIONS) {
      resource.postError(WlDataOfferError.invalidActionMask, `invalid action mask ${dndActions}`)
      console.log('[client protocol error] - invalid data offer action mask')
      return
    }

    if (preferredAction && (!(preferredAction & dndActions) || this._bitCount(preferredAction) > 1)) {
      resource.postError(WlDataOfferError.invalidAction, `invalid action ${preferredAction}`)
      console.log('[client protocol error] - invalid data offer action')
      return
    }

    this.dndActions = dndActions
    this.preferredAction = preferredAction
    this.updateAction()
  }

  updateAction() {
    if (!this.wlDataSource) {
      return
    }

    const action = this._chooseAction()

    const dataSource = this.wlDataSource.implementation as DataSource
    if (dataSource.currentDndAction === action) {
      return
    }

    dataSource.currentDndAction = action

    if (this.inAsk) {
      return
    }

    if (this.wlDataSource.version >= 3) {
      this.wlDataSource.action(action)
    }

    if (this.resource.version >= 3) {
      this.resource.action(action)
    }
  }

  private _chooseAction() {
    let offerActions = none
    let preferredAction = none
    if (this.resource.version >= 3) {
      offerActions = this.dndActions
      preferredAction = this.preferredAction
    } else {
      offerActions = copy
    }

    let sourceActions = none
    if (this.wlDataSource.version >= 3) {
      const dataSource = this.wlDataSource.implementation as DataSource
      sourceActions = dataSource.dndActions
    } else {
      sourceActions = copy
    }
    const availableActions = offerActions & sourceActions

    if (!availableActions) {
      return none
    }

    // TODO a compositor defined action could be returned here

    /* If the dest side has a preferred DnD action, use it */
    if ((preferredAction & availableActions) !== 0) {
      return preferredAction
    }

    /* Use the first found action, in bit order */
    return 1 << (Math.floor(Math.log2(availableActions)) - 1)
  }
}
