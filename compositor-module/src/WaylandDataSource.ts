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
import { DataSource } from './DataSource'

const { copy, move, ask, none } = WlDataDeviceManagerDndAction
const ALL_ACTIONS = copy | move | ask

export function createWaylandDataSource(
  session: Session,
  wlDataSourceResource: WlDataSourceResource,
): WaylandDataSource {
  const dataSource = new WaylandDataSource(session, wlDataSourceResource)
  wlDataSourceResource.implementation = dataSource
  return dataSource
}

export function sendOffer(session: Session, dataSource: DataSource, target: WlDataDeviceResource): DataOffer {
  const offerId = target.dataOffer()
  const offer = DataOffer.create(session, dataSource, offerId, target)

  dataSource.mimeTypes.forEach((mimeType) => offer.resource.offer(mimeType))
  dataSource.dataOffer = offer
  dataSource.accepted = false

  return offer
}

/**
 *
 *            The wl_data_source object is the source side of a wl_data_offer.
 *            It is created by the source client in a data transfer and
 *            provides a way to describe the offered data and a way to respond
 *            to requests to transfer the data.
 */
export class WaylandDataSource implements WlDataSourceRequests, DataSource {
  mimeTypes: string[] = []
  dndActions = 0
  currentDndAction = none
  compositorAction = none
  accepted = false
  dataOffer?: DataOffer
  actionsSet = false
  setSelection = false
  version: number

  constructor(readonly session: Session, readonly resource: WlDataSourceResource, readonly client = resource.client) {
    this.version = this.resource.version
  }

  addDestroyListener(destroyListener: () => void): void {
    this.resource.addDestroyListener(destroyListener)
  }
  removeDestroyListener(destroyListener: () => void): void {
    this.resource.removeDestroyListener(destroyListener)
  }
  destroyDataSource(): void {
    this.resource.destroy()
  }
  onDestroy(): Promise<void> {
    return this.resource.onDestroy()
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

    if (this.dataOffer?.inAsk && this.version >= 3) {
      this.action(this.currentDndAction)
    }

    if (this.version >= 3) {
      this.resource.dndFinished()
    }

    this.dataOffer = undefined
  }

  action(action: WlDataDeviceManagerDndAction): void {
    this.resource.action(action)
  }

  dndDropPerformed(): void {
    this.resource.dndDropPerformed()
  }
}
