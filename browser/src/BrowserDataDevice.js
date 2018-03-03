'use strict'

import Point from './math/Point'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserDataOffer from './BrowserDataOffer'

const DndAction = greenfield.GrDataDeviceManager.DndAction

export default class BrowserDataDevice {
  /**
   * @return {BrowserDataDevice}
   */
  static create () {
    return new BrowserDataDevice()
  }

  /**
   * Use BrowserDataDevice.create(..) instead.
   * @private
   */
  constructor () {
    this.resources = []
    /**
     * @type {BrowserSeat}
     */
    this.browserSeat = null
    /**
     * @type {GrDataSource}
     */
    this.dndSource = null
    /**
     * @type {GrDataSource}
     */
    this.selectionSource = null
    /**
     * @type {BrowserSurfaceView}
     */
    this.dndFocus = null
    /**
     * @type {Client}
     * @private
     */
    this.dndSourceClient = null
    /**
     * @type {BrowserSurfaceView}
     * @private
     */
    this._selectionFocus = null
    /**
     * @type {Function}
     * @private
     */
    this._dndSourceDestroyListener = () => {
      this._handleDndSourceDestroy()
    }
    /**
     * @type {Function}
     * @private
     */
    this._selectionSourceDestroyListener = () => {
      this._handleSelectionSourceDestroy()
    }
  }

  /**
   * @param {Client}client
   * @return {GrDataDevice | null}
   * @private
   */
  _dataDeviceForClient (client) {
    const dataDeviceResource = this.resources.find((dataDeviceResource) => {
      return dataDeviceResource.client === client
    })
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

    const surfaceResource = this._selectionFocus.browserSurface.resource
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
   *                the client must have an active implicit grab that matches the
   *                serial.
   *
   *                The icon surface is an optional (can be NULL) surface that
   *                provides an icon to be moved around with the cursor.  Initially,
   *                the top-left corner of the icon surface is placed at the cursor
   *                hotspot, but subsequent gr_surface.attach request can move the
   *                relative position. Attach requests must be confirmed with
   *                gr_surface.commit as usual. The icon surface is given the role of
   *                a drag-and-drop icon. If the icon surface already has another role,
   *                it raises a protocol error.
   *
   *                The current and pending input regions of the icon gr_surface are
   *                cleared, and gr_surface.set_input_region is ignored until the
   *                gr_surface is no longer used as the icon surface. When the use
   *                as an icon ends, the current and pending input regions become
   *                undefined, and the gr_surface is unmapped.
   *
   *
   * @param {GrDataDevice} resource
   * @param {GrDataSource|null} source data source for the eventual transfer
   * @param {GrSurface} origin surface where the drag originates
   * @param {GrSurface|null} icon drag-and-drop icon surface
   * @param {Number} serial serial number of the implicit grab on the origin
   *
   * @since 1
   *
   */
  startDrag (resource, source, origin, icon, serial) {
    const browserPointer = this.browserSeat.browserPointer

    if (browserPointer.buttonSerial !== serial) {
      return
    }
    if (browserPointer.grab.browserSurface.resource !== origin) {
      return
    }

    const dndFocus = browserPointer.focus
    // clear all previous mouse state (focus+grab)
    browserPointer.unsetFocus()
    if (icon !== null) {
      browserPointer.setCursorInternal(icon, 0, 0)
    }

    this.dndSourceClient = resource.client

    /*
     * From the specs:
     * For objects of version 2 or older, gr_data_source.cancelled will only be emitted if the data source was
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
   * @param {BrowserSurfaceView}focus
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

    const surfaceResource = this.dndFocus.browserSurface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this.dndSourceClient) {
      return
    }

    const browserPointer = this.browserSeat.browserPointer
    const mousePoint = Point.create(browserPointer.x, browserPointer.y)
    const surfacePoint = this.dndFocus.toSurfaceSpace(mousePoint)

    this.resources.filter((dataDeviceResource) => {
      return dataDeviceResource.client === client
    }).forEach((dataDeviceResource) => {
      dataDeviceResource.motion(Date.now(), greenfield.parseFixed(surfacePoint.x), greenfield.parseFixed(surfacePoint.y))
    })
  }

  /**
   * @param {BrowserSurfaceView}browserSurfaceView
   * @private
   */
  _onFocusGained (browserSurfaceView) {
    this.dndFocus = browserSurfaceView
    if (!this.dndSourceClient) {
      return
    }

    const surfaceResource = browserSurfaceView.browserSurface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this.dndSourceClient) {
      return
    }

    const browserPointer = this.browserSeat.browserPointer
    const mousePoint = Point.create(browserPointer.x, browserPointer.y)
    const surfacePoint = browserSurfaceView.toSurfaceSpace(mousePoint)
    const serial = browserPointer._nextFocusSerial()

    const x = greenfield.parseFixed(surfacePoint.x)
    const y = greenfield.parseFixed(surfacePoint.y)

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource === null) {
      // target doesn't support dnd
      return
    }

    let grDataOffer = null
    if (this.dndSource) {
      grDataOffer = this._createDataOffer(this.dndSource, dataDeviceResource)
      grDataOffer.implementation.updateAction()
      this.dndSource.accepted = false
    }
    dataDeviceResource.enter(serial, surfaceResource, x, y, grDataOffer)

    if (grDataOffer) {
      const dndActions = this.dndSource.implementation.dndActions
      if (grDataOffer.version >= 3) {
        grDataOffer.sourceActions(dndActions)
      }
    }
  }

  _onFocusLost () {
    if (!this.dndSourceClient) {
      return
    }

    const surfaceResource = this.dndFocus.browserSurface.resource
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
      const surfaceResource = this.dndFocus.browserSurface.resource
      const client = surfaceResource.client
      const dataDeviceResource = this._dataDeviceForClient(client)

      if (dataDeviceResource) {
        if (this.dndSource.implementation.accepted &&
          this.dndSource.implementation.currentDndAction) {
          dataDeviceResource.drop()

          if (this.dndSource.version >= 3) {
            this.dndSource.dndDropPerformed()
          }

          this.dndSource.implementation.grDataOffer.implementation.inAsk = this.dndSource.currentDndAction === DndAction.ask
        } else if (this.dndSource && this.dndSource.version >= 3) {
          this.dndSource.cancelled()
        }

        dataDeviceResource.leave()
      }
    }

    this.dndSourceClient = null

    const browserPointer = this.browserSeat.browserPointer
    if (this.dndFocus) {
      browserPointer.setFocus(this.dndFocus)
    } else {
      browserPointer.setDefaultCursor()
    }
  }

  // TODO handle touch events

  /**
   * @param {GrDataSource}source
   * @param {GrDataDevice}dataDeviceResource
   * @return {GrDataOffer}
   * @private
   */
  _createDataOffer (source, dataDeviceResource) {
    const offerId = dataDeviceResource.dataOffer()
    const browserDataOffer = BrowserDataOffer.create(source, offerId, dataDeviceResource)
    source.implementation.grDataOffer = browserDataOffer.resource
    source.implementation.mimeTypes.forEach((mimeType) => {
      browserDataOffer.resource.offer(mimeType)
    })
    return browserDataOffer.resource
  }

  /**
   *
   *                This request asks the compositor to set the selection
   *                to the data from the source on behalf of the client.
   *
   *                To unset the selection, set the source to NULL.
   *
   *
   * @param {GrDataDevice} resource
   * @param {GrDataSource|null} source data source for the selection
   * @param {Number} serial serial number of the event that triggered this request
   *
   * @since 1
   *
   */
  setSelection (resource, source, serial) {
    // FIXME what should the serial correspond to? Looking at weston, the serial is quite useless...
    if (source && source.implementation.dndActions) {
      // TODO raise protocol error
      return
    }

    if (this.selectionSource) {
      this.selectionSource.removeDestroyListener(this._selectionSourceDestroyListener)
      /*
       * From the specs:
       * For objects of version 2 or older, gr_data_source.cancelled will only be emitted if the data source was
       * replaced by another data source.
       */
      this.selectionSource.cancelled()
    }

    this.selectionSource = source
    this.selectionSource.addDestroyListener(this._selectionSourceDestroyListener)
    // send out selection if there is a keyboard focus
    if (this._selectionFocus) {
      this.onKeyboardFocusGained(this._selectionFocus)
    }
  }

  /**
   * @param {BrowserSurfaceView}newSelectionFocus
   */
  onKeyboardFocusGained (newSelectionFocus) {
    this._selectionFocus = newSelectionFocus

    const surfaceResource = this._selectionFocus.browserSurface.resource
    const client = surfaceResource.client

    const dataDeviceResource = this._dataDeviceForClient(client)
    if (dataDeviceResource == null) {
      return
    }

    if (this.selectionSource === null) {
      dataDeviceResource.selection(null)
    } else {
      const grDataOffer = this._createDataOffer(this.selectionSource, dataDeviceResource)
      dataDeviceResource.selection(grDataOffer)
      this.selectionSource.implementation.grDataOffer = grDataOffer
    }
  }

  /**
   *
   *                This request destroys the data device.
   *
   *
   * @param {GrDataDevice} resource
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
