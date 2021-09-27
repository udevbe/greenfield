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
  inAsk = false
  dndActions = 0
  preferredDndActions = none

  static create(
    session: Session,
    source: WlDataSourceResource,
    offerId: number,
    dataDeviceResource: WlDataDeviceResource,
  ): DataOffer {
    const wlDataOfferResource = new WlDataOfferResource(dataDeviceResource.client, offerId, dataDeviceResource.version)
    const dataOffer = new DataOffer(session, wlDataOfferResource, source)
    wlDataOfferResource.implementation = dataOffer
    wlDataOfferResource.onDestroy().then(() => dataOffer.handleDestroy())

    return dataOffer
  }

  private constructor(
    private readonly session: Session,
    public readonly resource: WlDataOfferResource,
    public source: WlDataSourceResource,
  ) {}

  accept(resource: WlDataOfferResource, serial: number, mimeType: string | undefined): void {}

  destroy(resource: WlDataOfferResource): void {}

  finish(resource: WlDataOfferResource): void {}

  receive(resource: WlDataOfferResource, mimeType: string, fd: WebFD): void {}

  setActions(resource: WlDataOfferResource, dndActions: number, preferredAction: number): void {}

  private handleDestroy() {}
}
