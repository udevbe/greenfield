// Copyright 2020 Erik De Rijcke
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

import { Fixed } from 'westfield-runtime-common'

import {
  Client,
  WlDataDeviceError,
  WlDataDeviceManagerDndAction,
  WlDataDeviceRequests,
  WlDataDeviceResource,
  WlDataOfferResource,
  WlDataSourceError,
  WlDataSourceResource,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import DataOffer from './DataOffer'
import DataSource from './DataSource'

import Seat from './Seat'
import Session from './Session'
import Surface from './Surface'
import View from './View'

const DndAction = WlDataDeviceManagerDndAction

/**
 *
 *            There is one wl_data_device per seat which can be obtained
 *            from the global wl_data_device_manager singleton.
 *
 *            A wl_data_device provides access to inter-client data transfer
 *            mechanisms such as copy-and-paste and drag-and-drop.
 */
export default class DataDevice implements WlDataDeviceRequests {
  resources: WlDataDeviceResource[] = []
  // @ts-ignore set in create of Seat
  seat: Seat
  dndSource?: WlDataSourceResource
  selectionDataSource?: WlDataSourceResource
  dndFocus?: View
  dndSourceClient?: Client
  private selectionFocus?: Surface
  private readonly dndSourceDestroyListener: () => void
  private readonly selectionSourceDestroyListener: () => void

  public selectionListeners: (() => void)[] = []

  static create(session: Session): DataDevice {
    return new DataDevice(session)
  }

  private constructor(private readonly session: Session) {
    this.dndSourceDestroyListener = () => {
      this.handleDndSourceDestroy()
    }
    this.selectionSourceDestroyListener = () => {
      this.handleSelectionSourceDestroy()
    }
  }

  private dataDeviceForClient(client: Client): WlDataDeviceResource | undefined {
    return this.resources.find((dataDeviceResource) => dataDeviceResource.client === client)
  }

  private handleDndSourceDestroy() {
    if (this.dndSourceClient) {
      const dataDeviceResource = this.dataDeviceForClient(this.dndSourceClient)
      if (dataDeviceResource === undefined) {
        return
      }
      dataDeviceResource.leave()
      this.dndSourceClient = undefined
    }
  }

  private handleSelectionSourceDestroy() {
    if (this.selectionFocus === undefined) {
      return
    }

    const client = this.selectionFocus.resource.client

    const dataDeviceResource = this.dataDeviceForClient(client)
    if (dataDeviceResource === undefined) {
      return
    }

    dataDeviceResource.selection(undefined)
    this.selectionDataSource = undefined
    this.selectionListeners.forEach((listener) => listener())
  }

  startDrag(
    resource: WlDataDeviceResource,
    source: WlDataSourceResource | undefined,
    origin: WlSurfaceResource,
    icon: WlSurfaceResource | undefined,
    serial: number,
  ): void {
    if (icon && (icon.implementation as Surface).role) {
      resource.postError(WlDataDeviceError.role, 'Given surface has another role.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }

    const pointer = this.seat.pointer

    if (this.seat.serial !== serial) {
      return
    }
    if (pointer.grab?.surface.resource !== origin) {
      return
    }

    const dndFocus = pointer.focus
    // clear all previous mouse state (focus+grab)
    pointer.unsetFocus()
    if (icon !== null) {
      pointer.setCursorInternal(icon, 0, 0)
    }

    this.dndSourceClient = resource.client

    /*
     * From the specs:
     * For objects of version 2 or older, wl_data_source.cancelled will only be emitted if the data source was
     * replaced by another data source.
     */
    this.dndSource?.removeDestroyListener(this.dndSourceDestroyListener)

    this.dndSource = source
    this.dndSource?.addDestroyListener(this.dndSourceDestroyListener)

    if (dndFocus) {
      this.onFocusGained(dndFocus)
    }
  }

  onMouseMotion(focus: View | undefined): void {
    if (this.dndFocus !== focus) {
      if (this.dndFocus) {
        this.onFocusLost()
      }
      if (focus) {
        this.onFocusGained(focus)
      }
    }

    this.dndFocus = focus
    if (!this.dndFocus) {
      return
    }

    const client = this.dndFocus.surface.resource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === undefined && client !== this.dndSourceClient) {
      return
    }

    const surfacePoint = this.dndFocus.sceneToSurfaceSpace(this.seat.pointer)

    this.resources
      .filter((dataDeviceResource) => {
        return dataDeviceResource.client === client
      })
      .forEach((dataDeviceResource) => {
        dataDeviceResource.motion(Date.now(), Fixed.parse(surfacePoint.x), Fixed.parse(surfacePoint.y))
      })
  }

  private onFocusGained(view: View): void {
    this.dndFocus = view
    if (!this.dndSourceClient) {
      return
    }

    const surfaceResource = view.surface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === undefined && client !== this.dndSourceClient) {
      return
    }

    const surfacePoint = view.sceneToSurfaceSpace(this.seat.pointer)
    const serial = this.seat.nextSerial()

    const x = Fixed.parse(surfacePoint.x)
    const y = Fixed.parse(surfacePoint.y)

    const dataDeviceResource = this.dataDeviceForClient(client)
    if (dataDeviceResource === undefined) {
      // target doesn't support dnd
      return
    }

    let wlDataOffer: WlDataOfferResource | undefined = undefined
    if (this.dndSource) {
      wlDataOffer = this.createDataOffer(this.dndSource, dataDeviceResource)
      ;(wlDataOffer.implementation as DataOffer).updateAction()
      ;(this.dndSource.implementation as DataSource).accepted = false
    }
    dataDeviceResource.enter(serial, surfaceResource, x, y, wlDataOffer)

    if (wlDataOffer && this.dndSource) {
      const dataSource = this.dndSource.implementation as DataSource
      const dndActions = dataSource.dndActions
      if (wlDataOffer.version >= 3) {
        wlDataOffer.sourceActions(dndActions)
      }
    }
  }

  private onFocusLost(): void {
    if (!this.dndSourceClient || this.dndFocus === undefined) {
      return
    }

    const client = this.dndFocus.surface.resource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === undefined && client !== this.dndSourceClient) {
      return
    }

    const dataDeviceResource = this.dataDeviceForClient(client)
    if (dataDeviceResource) {
      dataDeviceResource.leave()
    }
    this.dndFocus = undefined
  }

  onMouseUp(): void {
    if (this.dndSource && this.dndFocus) {
      const client = this.dndFocus.surface.resource.client
      const dataDeviceResource = this.dataDeviceForClient(client)

      if (dataDeviceResource) {
        const dataSource = this.dndSource.implementation as DataSource
        if (dataSource.accepted && dataSource.currentDndAction) {
          dataDeviceResource.drop()

          if (this.dndSource.version >= 3) {
            this.dndSource.dndDropPerformed()
          }

          if (dataSource.wlDataOffer) {
            const dataOffer = dataSource.wlDataOffer.implementation as DataOffer
            dataOffer.inAsk = dataSource.currentDndAction === DndAction.ask
          } else {
            this.dndSource.cancelled()
          }
        } else if (this.dndSource && this.dndSource.version >= 3) {
          this.dndSource.cancelled()
        }

        dataDeviceResource.leave()
      }
    }

    this.dndSourceClient = undefined

    const pointer = this.seat.pointer
    if (this.dndFocus) {
      pointer.setFocus(this.dndFocus)
    } else {
      pointer.setDefaultCursor()
    }
  }

  // TODO handle touch events

  private createDataOffer(source: WlDataSourceResource, dataDeviceResource: WlDataDeviceResource): WlDataOfferResource {
    const offerId = /** @type {number} */ dataDeviceResource.dataOffer()
    const dataOffer = DataOffer.create(this.session, source, offerId, dataDeviceResource)
    const dataSource = source.implementation as DataSource
    dataSource.wlDataOffer = dataOffer.resource
    dataSource.mimeTypes.forEach((mimeType) => dataOffer.resource.offer(mimeType))
    return dataOffer.resource
  }

  setSelection(resource: WlDataDeviceResource, source: WlDataSourceResource | undefined, serial: number): void {
    if (!this.seat.isValidInputSerial(serial)) {
      this.session.logger.debug('Invalid selection serial. Ignoring request.')
    }

    if (source && (source.implementation as DataSource).dndActions) {
      source.postError(WlDataSourceError.invalidSource, 'Can not set selection when source has dnd actions active.')
      this.session.logger.warn('[client-protocol-error] - Can not set selection when source has dnd actions active.')
      return
    }

    if (this.selectionDataSource === source) {
      return
    }

    if (this.selectionDataSource) {
      this.selectionDataSource.removeDestroyListener(this.selectionSourceDestroyListener)
      this.selectionDataSource.cancelled()
    }

    this.selectionDataSource = source
    if (this.selectionDataSource) {
      this.selectionDataSource.addDestroyListener(this.selectionSourceDestroyListener)
    }

    // send out selection if there is a keyboard focus
    if (this.selectionFocus) {
      this.onKeyboardFocusGained(this.selectionFocus)
    }
    this.selectionListeners.forEach((listener) => listener())
  }

  onKeyboardFocusGained(newSelectionFocus: Surface): void {
    this.selectionFocus = newSelectionFocus

    const client = this.selectionFocus.resource.client

    const dataDeviceResource = this.dataDeviceForClient(client)
    if (dataDeviceResource == null) {
      return
    }

    if (this.selectionDataSource === undefined) {
      dataDeviceResource.selection(undefined)
    } else {
      const wlDataOffer = this.createDataOffer(this.selectionDataSource, dataDeviceResource)

      this.selectionDataSource.action(0)
      wlDataOffer.action(0)

      dataDeviceResource.selection(wlDataOffer)
      ;(this.selectionDataSource.implementation as DataSource).wlDataOffer = wlDataOffer
    }
  }

  release(resource: WlDataDeviceResource): void {
    if (this.dndSource) {
      this.dndSource.removeDestroyListener(this.dndSourceDestroyListener)
    }

    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
    resource.destroy()
  }
}
