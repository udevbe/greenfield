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

'use strict'

import { Fixed } from 'westfield-runtime-common'

import WlDataDeviceRequests from './protocol/WlDataDeviceRequests'
import WlDataDeviceResource from './protocol/WlDataDeviceResource'
import WlDataDeviceManagerResource from './protocol/WlDataDeviceManagerResource'
import WlDataSourceResource from './protocol/WlDataSourceResource'

import Point from './math/Point'
import DataOffer from './DataOffer'

const DndAction = WlDataDeviceManagerResource.DndAction

/**
 *
 *            There is one wl_data_device per seat which can be obtained
 *            from the global wl_data_device_manager singleton.
 *
 *            A wl_data_device provides access to inter-client data transfer
 *            mechanisms such as copy-and-paste and drag-and-drop.
 * @implements WlDataDeviceRequests
 */
export default class DataDevice extends WlDataDeviceRequests {
  /**
   * @return {DataDevice}
   */
  static create () {
    return new DataDevice()
  }

  /**
   * Use DataDevice.create(..) instead.
   * @private
   */
  constructor () {
    super()
    /**
     * @type {Array<WlDataDeviceResource>}
     */
    this.resources = []
    /**
     * @type {Seat}
     */
    this.seat = null
    /**
     * @type {WlDataSourceResource}
     */
    this.dndSource = null
    /**
     * @type {?WlDataSourceResource}
     */
    this.selectionSource = null
    /**
     * @type {View}
     */
    this.dndFocus = null
    /**
     * @type {Client}
     */
    this.dndSourceClient = null
    /**
     * @type {Surface}
     * @private
     */
    this._selectionFocus = null
    /**
     * @type {function():void}
     * @private
     */
    this._dndSourceDestroyListener = () => { this._handleDndSourceDestroy() }
    /**
     * @type {function():void}
     * @private
     */
    this._selectionSourceDestroyListener = () => { this._handleSelectionSourceDestroy() }
  }

  /**
   * @param {Client}client
   * @return {WlDataDeviceResource | null}
   * @private
   */
  _dataDeviceForClient (client) {
    const dataDeviceResource = this.resources.find(dataDeviceResource => dataDeviceResource.client === client)
    // safeguard against undefined
    return dataDeviceResource == null ? null : dataDeviceResource
  }

  _handleDndSourceDestroy () {
    const dataDeviceResource = this._dataDeviceForClient(this.dndSourceClient)
    if (dataDeviceResource === null) {
      return
    }
    dataDeviceResource.leave()
    this.dndSourceClient = null
  }

  _handleSelectionSourceDestroy () {
    if (this._selectionFocus === null) {
      return
    }

    const surfaceResource = this._selectionFocus.resource
    const client = surfaceResource.client

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource == null) {
      return
    }

    dataDeviceResource.selection(null)
    this.selectionSource = null
  }

  /**
   *
   *                This request asks the compositor to start a drag-and-drop
   *                operation on behalf of the client.
   *
   *                The source argument is the data source that provides the data
   *                for the eventual data transfer. If source is NULL, enter, leave
   *                and motion events are sent only to the client that initiated the
   *                drag and the client is expected to handle the data passing
   *                internally.
   *
   *                The origin surface is the surface where the drag originates and
   *                the client must have an active implicit wlab that matches the
   *                serial.
   *
   *                The icon surface is an optional (can be NULL) surface that
   *                provides an icon to be moved around with the cursor.  Initially,
   *                the top-left corner of the icon surface is placed at the cursor
   *                hotspot, but subsequent wl_surface.attach request can move the
   *                relative position. Attach requests must be confirmed with
   *                wl_surface.commit as usual. The icon surface is given the role of
   *                a drag-and-drop icon. If the icon surface already has another role,
   *                it raises a protocol error.
   *
   *                The current and pending input regions of the icon wl_surface are
   *                cleared, and wl_surface.set_input_region is ignored until the
   *                wl_surface is no longer used as the icon surface. When the use
   *                as an icon ends, the current and pending input regions become
   *                undefined, and the wl_surface is unmapped.
   *
   *
   * @param {WlDataDeviceResource} resource
   * @param {WlDataSourceResource|null} source data source for the eventual transfer
   * @param {WlSurfaceResource} origin surface where the drag originates
   * @param {WlSurfaceResource|null} icon drag-and-drop icon surface
   * @param {number} serial serial number of the implicit grab on the origin
   *
   * @since 1
   * @override
   */
  startDrag (resource, source, origin, icon, serial) {
    if (icon && (/** @type {Surface} */ icon.implementation).role) {
      resource.postError(WlDataDeviceResource.Error.role, 'Given surface has another role.')
      DEBUG && console.log('[client-protocol-error] - Given surface has another role.')
      return
    }

    const pointer = this.seat.pointer

    if (this.seat.serial !== serial) {
      return
    }
    if (pointer.grab.surface.resource !== origin) {
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
    if (this.dndSource) {
      this.dndSource.removeDestroyListener(this._dndSourceDestroyListener)
    }

    this.dndSource = source
    if (this.dndSource) {
      this.dndSource.addDestroyListener(this._dndSourceDestroyListener)
    }

    if (dndFocus) {
      this._onFocusGained(dndFocus)
    }
  }

  /**
   * @param {View}focus
   */
  onMouseMotion (focus) {
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

  /**
   * @param {View}view
   * @private
   */
  _onFocusGained (view) {
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
    if (dataDeviceResource === null) {
      // target doesn't support dnd
      return
    }

    let wlDataOffer = null
    if (this.dndSource) {
      wlDataOffer = this._createDataOffer(this.dndSource, dataDeviceResource)
      wlDataOffer.implementation.updateAction()
      this.dndSource.accepted = false
    }
    dataDeviceResource.enter(serial, surfaceResource, x, y, wlDataOffer)

    if (wlDataOffer) {
      const dataSource = /** @type {DataSource} */ this.dndSource.implementation
      const dndActions = dataSource.dndActions
      if (wlDataOffer.version >= 3) {
        wlDataOffer.sourceActions(dndActions)
      }
    }
  }

  _onFocusLost () {
    if (!this.dndSourceClient) {
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
    this.dndFocus = null
  }

  onMouseUp () {
    if (this.dndSource && this.dndFocus) {
      const surfaceResource = this.dndFocus.surface.resource
      const client = surfaceResource.client
      const dataDeviceResource = this._dataDeviceForClient(client)

      if (dataDeviceResource) {
        const dataSource = /** @type {DataSource} */ this.dndSource.implementation
        if (dataSource.accepted && dataSource.currentDndAction) {
          dataDeviceResource.drop()

          if (this.dndSource.version >= 3) {
            this.dndSource.dndDropPerformed()
          }

          const dataOffer = /** @type{DataOffer} */dataSource.wlDataOffer.implementation
          dataOffer.inAsk = this.dndSource.currentDndAction === DndAction.ask
        } else if (this.dndSource && this.dndSource.version >= 3) {
          this.dndSource.cancelled()
        }

        dataDeviceResource.leave()
      }
    }

    this.dndSourceClient = null

    const pointer = this.seat.pointer
    if (this.dndFocus) {
      pointer.setFocus(this.dndFocus)
    } else {
      pointer.setDefaultCursor()
    }
  }

  // TODO handle touch events

  /**
   * @param {WlDataSourceResource}source
   * @param {WlDataDeviceResource}dataDeviceResource
   * @return {WlDataOfferResource}
   * @private
   */
  _createDataOffer (source, dataDeviceResource) {
    const offerId = /** @type {number} */dataDeviceResource.dataOffer()
    const dataOffer = DataOffer.create(source, offerId, dataDeviceResource)
    source.implementation.wlDataOffer = dataOffer.resource
    source.implementation.mimeTypes.forEach(mimeType => dataOffer.resource.offer(mimeType))
    return dataOffer.resource
  }

  /**
   *
   *                This request asks the compositor to set the selection
   *                to the data from the source on behalf of the client.
   *
   *                To unset the selection, set the source to NULL.
   *
   *
   * @param {WlDataDeviceResource} resource
   * @param {WlDataSourceResource|null} source data source for the selection
   * @param {Number} serial serial number of the event that triggered this request
   *
   * @since 1
   *
   */
  setSelection (resource, source, serial) {
    if (!this.seat.isValidInputSerial(serial)) {
      DEBUG && console.log('Invalid selection serial. Ignoring request.')
      return
    }

    if (source && (/** @type {DataSource} */source.implementation).dndActions) {
      source.postError(WlDataSourceResource.Error.invalidSource, 'Can not set selection when source has dnd actions active.')
      DEBUG && console.log('[client-protocol-error] - Can not set selection when source has dnd actions active.')
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

  /**
   * @param {Surface}newSelectionFocus
   */
  onKeyboardFocusGained (newSelectionFocus) {
    this._selectionFocus = newSelectionFocus

    const surfaceResource = this._selectionFocus.resource
    const client = surfaceResource.client

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource == null) {
      return
    }

    if (this.selectionSource === null) {
      dataDeviceResource.selection(null)
    } else {
      const wlDataOffer = this._createDataOffer(this.selectionSource, dataDeviceResource)

      this.selectionSource.action(0)
      wlDataOffer.action(0)

      dataDeviceResource.selection(wlDataOffer)
      this.selectionSource.implementation.wlDataOffer = wlDataOffer
    }
  }

  /**
   *
   *                This request destroys the data device.
   *
   *
   * @param {WlDataDeviceResource} resource
   *
   * @since 2
   *
   */
  release (resource) {
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
