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
import Session from './Session'

function bitCount(u: number): number {
  // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111)
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63
}

const { copy, move, ask, none } = WlDataDeviceManagerDndAction
const ALL_ACTIONS = copy | move | ask

export default class DataOffer implements WlDataOfferRequests {
  // @ts-ignore set in static create method
  resource: WlDataOfferResource
  acceptMimeType?: string
  preferredAction = 0
  dndActions: WlDataDeviceManagerDndAction = none
  inAsk = false
  private finished = false

  static create(
    session: Session,
    source: WlDataSourceResource,
    offerId: number,
    dataDeviceResource: WlDataDeviceResource,
  ): DataOffer {
    const dataOffer = new DataOffer(session, source)
    const wlDataOfferResource = new WlDataOfferResource(dataDeviceResource.client, offerId, dataDeviceResource.version)
    wlDataOfferResource.implementation = dataOffer
    dataOffer.resource = wlDataOfferResource
    wlDataOfferResource.onDestroy().then(() => dataOffer._handleDestroy())

    return dataOffer
  }

  private constructor(private readonly session: Session, public wlDataSource: WlDataSourceResource) {}

  private _handleDestroy() {
    if (!this.wlDataSource) {
      return
    }

    // TODO remove source destroy listener
    // TODO add source destroy listener
    // wl_list_remove(&offer->source_destroy_listener.link);

    const dataSoure = this.wlDataSource.implementation as DataSource | undefined
    if (dataSoure === undefined) {
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

  accept(resource: WlDataOfferResource, serial: number, mimeType: string | undefined): void {
    if (this.wlDataSource === undefined) {
      return
    }
    const dataSource = this.wlDataSource.implementation as DataSource
    if (dataSource.wlDataOffer === undefined) {
      return
    }

    if (this.finished) {
      // TODO raise protocol error
    }

    this.acceptMimeType = mimeType
    this.wlDataSource.target(mimeType)
    dataSource.accepted = mimeType !== null
  }

  receive(resource: WlDataOfferResource, mimeType: string, fd: WebFD): void {
    if (this.finished) {
      // TODO raise protocol error
    }
    if (this.wlDataSource) {
      this.wlDataSource.send(mimeType, fd)
    }
  }

  destroy(resource: WlDataOfferResource): void {
    resource.destroy()
  }

  finish(resource: WlDataOfferResource): void {
    if (!this.wlDataSource || !this.preferredAction) {
      return
    }
    if (!this.acceptMimeType || this.finished) {
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

  setActions(resource: WlDataOfferResource, dndActions: number, preferredAction: number): void {
    if (!this.wlDataSource) {
      return
    }
    if (this.finished) {
      // TODO raise protocol error
    }

    if (dndActions & ~ALL_ACTIONS) {
      resource.postError(WlDataOfferError.invalidActionMask, `invalid action mask ${dndActions}`)
      this.session.logger.warn('[client protocol error] - invalid data offer action mask')
      return
    }

    if (preferredAction && (!(preferredAction & dndActions) || bitCount(preferredAction) > 1)) {
      resource.postError(WlDataOfferError.invalidAction, `invalid action ${preferredAction}`)
      this.session.logger.warn('[client protocol error] - invalid data offer action')
      return
    }

    this.dndActions = dndActions
    this.preferredAction = preferredAction
    this.updateAction()
  }

  updateAction(): void {
    if (!this.wlDataSource) {
      return
    }

    const action = this.chooseAction()

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

  private chooseAction() {
    let offerActions: WlDataDeviceManagerDndAction
    let preferredAction = none
    if (this.resource.version >= 3) {
      offerActions = this.dndActions
      preferredAction = this.preferredAction
    } else {
      offerActions = copy
    }

    let sourceActions: WlDataDeviceManagerDndAction
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
