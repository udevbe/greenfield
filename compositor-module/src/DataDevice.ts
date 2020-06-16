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
  WlDataDeviceManagerDndAction,
  WlDataDeviceRequests,
  WlDataDeviceResource,
  WlDataDeviceError,
  WlDataOfferResource,
  WlDataSourceResource,
  WlDataSourceError,
  WlSurfaceResource
} from 'westfield-runtime-server'
import DataOffer from './DataOffer'
import DataSource from './DataSource'

import Point from './math/Point'
import Seat from './Seat'
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
  selectionSource?: WlDataSourceResource
  dndFocus?: View
  dndSourceClient?: Client
  private _selectionFocus?: Surface
  private readonly _dndSourceDestroyListener: () => void
  private readonly _selectionSourceDestroyListener: () => void

  static create(): DataDevice {
    return new DataDevice()
  }

  private constructor() {
    this._dndSourceDestroyListener = () => {
      this._handleDndSourceDestroy()
    }
    this._selectionSourceDestroyListener = () => {
      this._handleSelectionSourceDestroy()
    }
  }

  private _dataDeviceForClient(client: Client): WlDataDeviceResource | undefined {
    return this.resources.find(dataDeviceResource => dataDeviceResource.client === client)
  }

  private _handleDndSourceDestroy() {
    if (this.dndSourceClient) {
      const dataDeviceResource = this._dataDeviceForClient(this.dndSourceClient)
      if (dataDeviceResource === undefined) {
        return
      }
      dataDeviceResource.leave()
      this.dndSourceClient = undefined
    }
  }

  private _handleSelectionSourceDestroy() {
    if (this._selectionFocus === undefined) {
      return
    }

    const surfaceResource = this._selectionFocus.resource
    const client = surfaceResource.client

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource === undefined) {
      return
    }

    dataDeviceResource.selection(undefined)
    this.selectionSource = undefined
  }

  startDrag(resource: WlDataDeviceResource, source: WlDataSourceResource | undefined, origin: WlSurfaceResource, icon: WlSurfaceResource | undefined, serial: number) {
    if (icon && (icon.implementation as Surface).role) {
      resource.postError(WlDataDeviceError.role, 'Given surface has another role.')
      console.log('[client-protocol-error] - Given surface has another role.')
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
    this.dndSource?.removeDestroyListener(this._dndSourceDestroyListener)

    this.dndSource = source
    this.dndSource?.addDestroyListener(this._dndSourceDestroyListener)

    if (dndFocus) {
      this._onFocusGained(dndFocus)
    }
  }

  onMouseMotion(focus: View | undefined) {
    if (this.dndFocus !== focus) {
      if (this.dndFocus) {
        this._onFocusLost()
      }
      if (focus) {
        this._onFocusGained(focus)
      }
    }

    this.dndFocus = focus
    if (!this.dndFocus) {
      return
    }

    const surfaceResource = this.dndFocus.surface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this.dndSourceClient) {
      return
    }

    const pointer = this.seat.pointer
    const mousePoint = Point.create(pointer.x, pointer.y)
    const surfacePoint = this.dndFocus.toSurfaceSpace(mousePoint)

    this.resources.filter((dataDeviceResource) => {
      return dataDeviceResource.client === client
    }).forEach((dataDeviceResource) => {
      dataDeviceResource.motion(Date.now(), Fixed.parse(surfacePoint.x), Fixed.parse(surfacePoint.y))
    })
  }

  private _onFocusGained(view: View) {
    this.dndFocus = view
    if (!this.dndSourceClient) {
      return
    }

    const surfaceResource = view.surface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this.dndSourceClient) {
      return
    }

    const pointer = this.seat.pointer
    const mousePoint = Point.create(pointer.x, pointer.y)
    const surfacePoint = view.toSurfaceSpace(mousePoint)
    const serial = this.seat.nextSerial()

    const x = Fixed.parse(surfacePoint.x)
    const y = Fixed.parse(surfacePoint.y)

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource === undefined) {
      // target doesn't support dnd
      return
    }

    let wlDataOffer: WlDataOfferResource | undefined = undefined
    if (this.dndSource) {
      wlDataOffer = this._createDataOffer(this.dndSource, dataDeviceResource);
      (wlDataOffer.implementation as DataOffer).updateAction();
      (this.dndSource.implementation as DataSource).accepted = false
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

  private _onFocusLost() {
    if (!this.dndSourceClient || this.dndFocus === undefined) {
      return
    }

    const surfaceResource = this.dndFocus.surface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this.dndSourceClient) {
      return
    }

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource) {
      dataDeviceResource.leave()
    }
    this.dndFocus = undefined
  }

  onMouseUp() {
    if (this.dndSource && this.dndFocus) {
      const surfaceResource = this.dndFocus.surface.resource
      const client = surfaceResource.client
      const dataDeviceResource = this._dataDeviceForClient(client)

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

  private _createDataOffer(source: WlDataSourceResource, dataDeviceResource: WlDataDeviceResource): WlDataOfferResource {
    const offerId = /** @type {number} */dataDeviceResource.dataOffer()
    const dataOffer = DataOffer.create(source, offerId, dataDeviceResource)
    const dataSource = source.implementation as DataSource
    dataSource.wlDataOffer = dataOffer.resource
    dataSource.mimeTypes.forEach(mimeType => dataOffer.resource.offer(mimeType))
    return dataOffer.resource
  }

  setSelection(resource: WlDataDeviceResource, source: WlDataSourceResource | undefined, serial: number) {
    // if (!this.seat.isValidInputSerial(serial)) {
    //   console.log('Invalid selection serial. Ignoring request.')
    //   return
    // }

    if (source && (source.implementation as DataSource).dndActions) {
      source.postError(WlDataSourceError.invalidSource, 'Can not set selection when source has dnd actions active.')
      console.log('[client-protocol-error] - Can not set selection when source has dnd actions active.')
      return
    }

    if (this.selectionSource === source) {
      return
    }

    if (this.selectionSource) {
      this.selectionSource.removeDestroyListener(this._selectionSourceDestroyListener)
      if (this.selectionSource.client !== resource.client) {
        this.selectionSource.cancelled()
      }
    }

    this.selectionSource = source
    if (this.selectionSource) {
      this.selectionSource.addDestroyListener(this._selectionSourceDestroyListener)
    }

    // send out selection if there is a keyboard focus
    if (this._selectionFocus) {
      this.onKeyboardFocusGained(this._selectionFocus)
    }
  }

  onKeyboardFocusGained(newSelectionFocus: Surface) {
    this._selectionFocus = newSelectionFocus

    const surfaceResource = this._selectionFocus.resource
    const client = surfaceResource.client

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource == null) {
      return
    }

    if (this.selectionSource === undefined) {
      dataDeviceResource.selection(undefined)
    } else {
      const wlDataOffer = this._createDataOffer(this.selectionSource, dataDeviceResource)

      this.selectionSource.action(0)
      wlDataOffer.action(0)

      dataDeviceResource.selection(wlDataOffer);
      (this.selectionSource.implementation as DataSource).wlDataOffer = wlDataOffer
    }
  }

  release(resource: WlDataDeviceResource) {
    if (this.dndSource) {
      this.dndSource.removeDestroyListener(this._dndSourceDestroyListener)
    }

    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
    resource.destroy()
  }
}
