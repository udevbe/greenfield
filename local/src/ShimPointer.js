'use strict'

const WlPointerRequests = require('./protocol/wayland/WlPointerRequests')

module.exports = class ShimPointer extends WlPointerRequests {
  static create (grPointerProxy) {
    return new WlPointerRequests(grPointerProxy)
  }

  constructor (grPointerProxy) {
    super()
    this.proxy = grPointerProxy
  }

  /**
   *
   *  Set the pointer surface, i.e., the surface that contains the
   *  pointer image (cursor). This request gives the surface the role
   *  of a cursor. If the surface already has another role, it raises
   *  a protocol error.
   *
   *  The cursor actually changes only if the pointer
   *  focus for this device is one of the requesting client's surfaces
   *  or the surface parameter is the current pointer surface. If
   *  there was a previous surface set with this request it is
   *  replaced. If surface is NULL, the pointer image is hidden.
   *
   *  The parameters hotspot_x and hotspot_y define the position of
   *  the pointer surface relative to the pointer location. Its
   *  top-left corner is always at (x, y) - (hotspot_x, hotspot_y),
   *  where (x, y) are the coordinates of the pointer location, in
   *  surface-local coordinates.
   *
   *  On surface.attach requests to the pointer surface, hotspot_x
   *  and hotspot_y are decremented by the x and y parameters
   *  passed to the request. Attach must be confirmed by
   *  wl_surface.commit as usual.
   *
   *  The hotspot can also be updated by passing the currently set
   *  pointer surface to this request with new values for hotspot_x
   *  and hotspot_y.
   *
   *  The current and pending input regions of the wl_surface are
   *  cleared, and wl_surface.set_input_region is ignored until the
   *  wl_surface is no longer used as the cursor. When the use as a
   *  cursor ends, the current and pending input regions become
   *  undefined, and the wl_surface is unmapped.
   *
   *
   * @param {WlPointer} resource
   * @param {Number} serial serial number of the enter event
   * @param {?*} surface pointer surface
   * @param {Number} hotspotX surface-local x coordinate
   * @param {Number} hotspotY surface-local y coordinate
   *
   * @since 1
   *
   */
  setCursor (resource, serial, surface, hotspotX, hotspotY) {
    const grSurfaceProxy = surface.implementation.proxy
    this.proxy.setCursor(serial, grSurfaceProxy, hotspotX, hotspotY)
  }

  /**
   *
   *  Using this request a client can tell the server that it is not going to
   *  use the pointer object anymore.
   *
   *  This request destroys the pointer proxy object, so clients must not call
   *  wl_pointer_destroy() after using this request.
   *
   *
   * @param {WlPointer} resource
   *
   * @since 3
   *
   */
  release (resource) {
    this.proxy.release()
  }
}
