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
  WlDataSourceRequests,
  WlDataSourceResource,
  WlDataDeviceResource,
  WlDataSourceError,
} from 'westfield-runtime-server'
import DataOffer from './DataOffer'
import Session from './Session'

const { copy, move, ask, none } = WlDataDeviceManagerDndAction
const ALL_ACTIONS = copy | move | ask

/**
 *
 *            The wl_data_source object is the source side of a wl_data_offer.
 *            It is created by the source client in a data transfer and
 *            provides a way to describe the offered data and a way to respond
 *            to requests to transfer the data.
 */
export default class DataSource implements WlDataSourceRequests {
  mimeTypes: string[] = []
  dndActions = 0
  currentDndAction = none
  compositorAction = none
  accepted = false
  dataOffer?: DataOffer
  actionsSet = false
  setSelection = false

  constructor(public readonly session: Session, public readonly resource: WlDataSourceResource) {}

  static create(session: Session, wlDataSourceResource: WlDataSourceResource): DataSource {
    const dataSource = new DataSource(session, wlDataSourceResource)
    wlDataSourceResource.implementation = dataSource
    return dataSource
  }

  accept(mimeType: string | undefined): void {
    this.resource.target(mimeType)
  }

  send(mimeType: string, fd: WebFD): void {
    this.resource.send(mimeType, fd)
  }

  cancel(): void {
    this.resource.cancelled()
  }

  sendOffer(target: WlDataDeviceResource): DataOffer {
    const offerId = target.dataOffer()
    const offer = DataOffer.create(this.session, this, offerId, target)

    this.mimeTypes.forEach((mimeType) => offer.resource.offer(mimeType))
    this.dataOffer = offer
    this.accepted = false

    return offer
  }

  destroy(resource: WlDataSourceResource): void {
    resource.destroy()
  }

  offer(resource: WlDataSourceResource, mimeType: string): void {
    this.mimeTypes = [...this.mimeTypes, mimeType]
  }

  setActions(resource: WlDataSourceResource, dndActions: number): void {
    if (this.actionsSet) {
      this.session.logger.warn("Client protocol error. Can't set actions more than once.")
      resource.postError(
        WlDataSourceError.invalidActionMask,
        "Client protocol error. Can't set actions more than once.",
      )
      return
    }

    if (dndActions & ~ALL_ACTIONS) {
      this.session.logger.warn(`Client protocol error. Invalid action mask. ${dndActions}`)
      resource.postError(
        WlDataSourceError.invalidActionMask,
        `Client protocol error. Invalid action mask. ${dndActions}`,
      )
      return
    }

    this.dndActions = dndActions
    this.actionsSet = true
  }

  notifyFinish(): void {
    if (!this.actionsSet) {
      return
    }

    if (this.dataOffer?.inAsk && this.resource.version >= 3) {
      this.resource.action(this.currentDndAction)
    }

    if (this.resource.version >= 3) {
      this.resource.dndFinished()
    }

    this.dataOffer = undefined
  }
}
