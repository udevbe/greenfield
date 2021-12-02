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
  WlDataOfferError,
  WlDataOfferRequests,
  WlDataOfferResource,
} from 'westfield-runtime-server'
import DataSource from './DataSource'
import Session from './Session'

const { ask, none, copy, move } = WlDataDeviceManagerDndAction

function popCount(u: number): number {
  // https://blogs.msdn.microsoft.com/jeuge/2005/06/08/bit-fiddling-3/
  const uCount = u - ((u >> 1) & 0o33333333333) - ((u >> 2) & 0o11111111111)
  return ((uCount + (uCount >> 3)) & 0o30707070707) % 63
}

const ALL_ACTIONS = copy | move | ask

export default class DataOffer implements WlDataOfferRequests {
  inAsk = false
  dndActions = 0
  preferredDndAction = none

  private constructor(
    private readonly session: Session,
    public readonly resource: WlDataOfferResource,
    public source?: DataSource,
  ) {}

  static create(
    session: Session,
    source: DataSource,
    offerId: number,
    dataDeviceResource: WlDataDeviceResource,
  ): DataOffer {
    const wlDataOfferResource = new WlDataOfferResource(dataDeviceResource.client, offerId, dataDeviceResource.version)
    const dataOffer = new DataOffer(session, wlDataOfferResource, source)
    wlDataOfferResource.implementation = dataOffer
    source.resource.addDestroyListener(dataOffer.sourceDestroyListener)
    wlDataOfferResource.onDestroy().then(() => dataOffer.handleDestroy())

    return dataOffer
  }

  readonly sourceDestroyListener = (): void => {
    this.source = undefined
  }

  accept(resource: WlDataOfferResource, serial: number, mimeType: string | undefined): void {
    /* Protect against untimely calls from older data offers */
    if (this.source === undefined || this !== this.source.dataOffer) {
      return
    }

    /* FIXME: Check that client is currently focused by the input
     * device that is currently dragging this data source.  Should
     * this be a wl_data_device request? */

    this.source.accept(mimeType)
    this.source.accepted = mimeType !== undefined
  }

  destroy(resource: WlDataOfferResource): void {
    resource.destroy()
  }

  finish(resource: WlDataOfferResource): void {
    if (this.source === undefined || this.source.dataOffer !== this) {
      return
    }

    if (this.source.setSelection) {
      this.session.logger.warn('Client protocol error. Finish only valid for drag and drop.')
      resource.postError(WlDataOfferError.invalidFinish, 'Client protocol error. Finish only valid for drag and drop.')
      return
    }

    if (!this.source.accepted) {
      this.session.logger.warn('Client protocol error. Premature finish request.')
      resource.postError(WlDataOfferError.invalidFinish, 'Client protocol error. Premature finish request.')
      return
    }

    if (this.source.currentDndAction === none || this.source.currentDndAction === ask) {
      resource.postError(WlDataOfferError.invalidOffer, 'Client protocol error. Offer finished with an invalid action.')
      return
    }

    this.source.notifyFinish()
  }

  receive(resource: WlDataOfferResource, mimeType: string, fd: WebFD): void {
    if (this.source && this === this.source.dataOffer) {
      this.source.send(mimeType, fd)
    } else {
      fd.close()
    }
  }

  setActions(resource: WlDataOfferResource, dndActions: number, preferredAction: number): void {
    if (dndActions & ~ALL_ACTIONS) {
      this.session.logger.warn(`Client protocol error. Invalid action mask ${dndActions}`)
      resource.postError(WlDataOfferError.invalidActionMask, `Client protocol error. Invalid action mask ${dndActions}`)
      return
    }

    if (preferredAction && (!(preferredAction & dndActions) || popCount(preferredAction) > 1)) {
      this.session.logger.warn(`Client protocol error. Invalid action ${preferredAction}`)
      resource.postError(WlDataOfferError.invalidAction, `Client protocol error. Invalid action ${preferredAction}`)
      return
    }

    this.dndActions = dndActions
    this.preferredDndAction = preferredAction
    this.updateAction()
  }

  updateAction(): void {
    if (this.source === undefined) {
      return
    }

    const action = this.chooseAction()
    if (this.source.currentDndAction === action) {
      return
    }

    this.source.currentDndAction = action

    if (this.inAsk) {
      return
    }

    if (this.source.resource.version >= 3) {
      this.source.resource.action(action)
    }

    if (this.resource.version >= 3) {
      this.resource.action(action)
    }
  }

  private handleDestroy() {
    if (this.source === undefined) {
      return
    }

    this.source.resource.removeDestroyListener(this.sourceDestroyListener)
    if (this.source.dataOffer !== this) {
      return
    }

    if (this.resource.version < 3) {
      this.source.notifyFinish()
    } else if (this.source.resource.version >= 3) {
      this.source.resource.cancelled()
    }

    this.source.dataOffer = undefined
  }

  private chooseAction(): WlDataDeviceManagerDndAction {
    let preferredAction = WlDataDeviceManagerDndAction.none

    let offerActions: WlDataDeviceManagerDndAction

    if (this.resource.version >= 3) {
      offerActions = this.dndActions
      preferredAction = this.preferredDndAction
    } else {
      offerActions = WlDataDeviceManagerDndAction.copy
    }

    const sourceActions =
      this.source && this.source.resource.version >= 3 ? this.source.dndActions : WlDataDeviceManagerDndAction.copy

    const availableActions = offerActions & sourceActions

    if (availableActions === WlDataDeviceManagerDndAction.none) {
      return WlDataDeviceManagerDndAction.none
    }

    if (this.source && (this.source.compositorAction & availableActions) !== 0) {
      return this.source.compositorAction
    }

    /* If the dest side has a preferred DnD action, use it */
    if ((preferredAction & availableActions) !== 0) {
      return preferredAction
    }

    /* Use the first found action, in bit order */
    return 1 << (Math.floor(Math.log2(availableActions)) - 1)
  }
}
