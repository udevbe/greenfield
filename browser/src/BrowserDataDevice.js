'use strict'

import Point from './math/Point'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserDataOffer from './BrowserDataOffer'

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
     * @type {HTMLCanvasElement}
     * @private
     */
    this._dndFocus = null
    /**
     * @type {Client}
     * @private
     */
    this._dndSourceClient = null
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._selectionFocus = null
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
    if (browserPointer.grab.view.browserSurface.resource !== origin) {
      return
    }

    this._dndSourceClient = resource.client

    if (icon !== null) {
      browserPointer.setCursorInternal(icon)
    }

    /*
     * From the specs:
     * For objects of version 2 or older, gr_data_source.cancelled will only be emitted if the data source was
     * replaced by another data source.
     */
    if (this.dndSource && source && this.dndSource.version <= 2) {
      this.dndSource.cancelled()
    }

    this.dndSource = source
  }

  onMouseMotion () {
    const surfaceResource = this._dndFocus.view.browserSurface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this._dndSourceClient) {
      return
    }

    const browserPointer = this.browserSeat.browserPointer
    const elementRect = this._dndFocus.getBoundingClientRect()
    const canvasPoint = Point.create(browserPointer.x - (elementRect.x - 1), browserPointer.y - (elementRect.y - 1))
    const surfacePoint = this._dndFocus.view.toSurfaceSpace(canvasPoint)

    this.resources.filter((dataDeviceResource) => {
      return dataDeviceResource.client === client
    }).forEach((dataDeviceResource) => {
      dataDeviceResource.motion(Date.now(), greenfield.parseFixed(surfacePoint.x), greenfield.parseFixed(surfacePoint.y))
    })
  }

  /**
   * @param {HTMLCanvasElement}canvas
   */
  onMouseEnter (canvas) {
    this._dndFocus = canvas

    const surfaceResource = canvas.view.browserSurface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this._dndSourceClient) {
      return
    }

    const browserPointer = this.browserSeat.browserPointer
    const serial = browserPointer._nextFocusSerial()

    const elementRect = canvas.getBoundingClientRect()
    const canvasPoint = Point.create(browserPointer.x - (elementRect.x - 1), browserPointer.y - (elementRect.y - 1))
    const surfacePoint = canvas.view.toSurfaceSpace(canvasPoint)

    const x = greenfield.parseFixed(surfacePoint.x)
    const y = greenfield.parseFixed(surfacePoint.y)

    this.resources.filter((dataDeviceResource) => {
      return dataDeviceResource.client === client
    }).forEach((dataDeviceResource) => {
      const grDataOffer = this._createDataOffer(this.dndSource, dataDeviceResource)
      dataDeviceResource.enter(serial, surfaceResource, x, y, grDataOffer)

      const dndActions = this.dndSource.implementation.dndActions
      this.dndSource.implementation.offers.push(grDataOffer)
      grDataOffer.sourceActions(dndActions)
    })
  }

  /**
   * @param {HTMLCanvasElement}canvas
   */
  onMouseLeave (canvas) {
    this._dndFocus = null

    const surfaceResource = canvas.view.browserSurface.resource
    const client = surfaceResource.client

    // if source is null, only transfers within the same client can take place
    if (this.dndSource === null && client !== this._dndSourceClient) {
      return
    }

    this.resources.filter((dataDeviceResource) => {
      return dataDeviceResource.client === client
    }).forEach((dataDeviceResource) => {
      dataDeviceResource.leave()
      // set offers source to null to indicate they are no longer valid
      this.dndSource.implementation.offers.forEach((grDataOffer) => {
        grDataOffer.implementation.source = null
      })
      this.dndSource.implementation.offers = []
    })
  }

  onMouseGrabLost () {
    if (this._dndFocus) {
      this.resources.forEach((resource) => {
        resource.drop()
      })
      if (this.dndSource.version >= 3) {
        this.dndSource.dndDropPerformed()
      }
    } else if (this.dndSource.version >= 3) {
      this.dndSource.cancelled()
    }
  }

  _createDataOffer (source, dataDeviceResource) {
    const offerId = dataDeviceResource.dataOffer()
    const browserDataOffer = BrowserDataOffer.create(source)
    const grDataOffer = new greenfield.GrDataOffer(dataDeviceResource.client, offerId, dataDeviceResource.version, browserDataOffer)
    source.implementation.mimeTypes.forEach((mimeType) => {
      grDataOffer.offer(mimeType)
    })
    return grDataOffer
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
    // FIXME what should the serial correspond to?
    if (source && source.implementation.dndActions) {
      // TODO raise protocol error
      return
    }

    if (this.selectionSource) {
      /*
       * From the specs:
       * For objects of version 2 or older, gr_data_source.cancelled will only be emitted if the data source was
       * replaced by another data source.
       */
      if (source && this.selectionSource.version <= 2) {
        this.selectionSource.cancelled()
      }
    }

    this.selectionSource = source
    // send out selection if there is a keyboard focus
    if (this._selectionFocus) {
      this.onKeyboardFocusGained(this._selectionFocus)
    }
  }

  /**
   * @param {HTMLCanvasElement}newSelectionFocus
   */
  onKeyboardFocusGained (newSelectionFocus) {
    this._selectionFocus = newSelectionFocus

    if (this.selectionSource === null) {
      return
    }

    const surfaceResource = this._selectionFocus.view.browserSurface.resource
    const client = surfaceResource.client

    this.resources.filter((dataDeviceResource) => {
      return dataDeviceResource.client === client
    }).forEach((dataDeviceResource) => {
      const grDataOffer = this._createDataOffer(this.selectionSource)
      dataDeviceResource.selection(grDataOffer)
      this.selectionSource.implementation.offers.push(grDataOffer)
    })
  }

  onKeyboardFocusLost () {
    const surfaceResource = this._selectionFocus.view.browserSurface.resource
    const client = surfaceResource.client

    this._selectionFocus = null

    if (this.selectionSource === null) {
      return
    }

    this.resources.filter((dataDeviceResource) => {
      return dataDeviceResource.client === client
    }).forEach((dataDeviceResource) => {
      dataDeviceResource.selection(null)
      this.selectionSource.implementation.offers = []
    })
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
    const index = this.resources.indexOf(resource)
    if (index > -1) {
      this.resources.splice(index, 1)
    }
    resource.destroy()
  }
}
