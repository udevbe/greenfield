'use strict'

export default class BrowserDataDevice {
  /**
   * @param {GrDataDevice} grDataDeviceResource
   * @param {GrSeat} grSeatResource
   * @return {BrowserDataDevice}
   */
  static create (grDataDeviceResource, grSeatResource) {
    const browserDataDevice = new BrowserDataDevice(grDataDeviceResource)
    grDataDeviceResource.implementation = browserDataDevice
    return browserDataDevice
  }

  /**
   *
   * @param {GrDataDevice} grDataDeviceResource
   * @param {GrSeat} grSeatResource
   */
  constructor (grDataDeviceResource, grSeatResource) {
    this.resource = grDataDeviceResource
    this.seat = grSeatResource
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
   * @param {?*} source data source for the eventual transfer
   * @param {*} origin surface where the drag originates
   * @param {?*} icon drag-and-drop icon surface
   * @param {Number} serial serial number of the implicit grab on the origin
   *
   * @since 1
   *
   */
  startDrag (resource, source, origin, icon, serial) {}

  /**
   *
   *                This request asks the compositor to set the selection
   *                to the data from the source on behalf of the client.
   *
   *                To unset the selection, set the source to NULL.
   *
   *
   * @param {GrDataDevice} resource
   * @param {?*} source data source for the selection
   * @param {Number} serial serial number of the event that triggered this request
   *
   * @since 1
   *
   */
  setSelection (resource, source, serial) {}

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
    resource.destroy()
  }
}
