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
    this.source = null
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

    if (icon !== null) {
      browserPointer.setCursorInternal(icon)
    }

    this.source = source

    browserPointer.addMouseEnterListener((canvas) => {
      const serial = browserPointer._nextFocusSerial()
      const surfaceResource = canvas.view.browserSurface.resource

      const elementRect = canvas.getBoundingClientRect()
      const canvasPoint = Point.create(browserPointer.x - (elementRect.x - 1), browserPointer.y - (elementRect.y - 1))
      const surfacePoint = canvas.view.toSurfaceSpace(canvasPoint)

      const x = greenfield.parseFixed(surfacePoint.x)
      const y = greenfield.parseFixed(surfacePoint.y)

      const client = surfaceResource.client

      this.resources.filter((dataDeviceResource) => {
        return dataDeviceResource.client === client
      }).forEach((dataDeviceResource) => {
        const offer = this._createDataOffer(dataDeviceResource)
        dataDeviceResource.userData.offer = offer
        dataDeviceResource.enter(serial, surfaceResource, x, y, offer)
        const dndActions = this.source.implementation.dndActions
        this.source.implementation.offers.push(offer)
        offer.implementation.source = this.source
        offer.sourceActions(dndActions)
      })
    })
  }

  _createDataOffer (dataDeviceResource) {
    const offerId = dataDeviceResource.dataOffer()
    const browserDataOffer = BrowserDataOffer.create()
    const offer = new greenfield.GrDataOffer(dataDeviceResource.client, offerId, dataDeviceResource.version, browserDataOffer)
    this.source.implementation.mimeTypes.forEach((mimeType) => {
      offer.offer(mimeType)
    })
    return offer
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
    if (source.implementation.dndActions) {
      // TODO raise protocol error
      return
    }
    this.source = source

    const browserKeyboard = this.browserSeat.browserKeyboard

    // TODO
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
