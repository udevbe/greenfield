'use strict'

module.exports = class LocalTouch {
  static create () {
    return new LocalTouch()
  }

  constructor () {
    this.resource = null
  }

  /**
   *
   *                A new touch point has appeared on the surface. This touch point is
   *                assigned a unique ID. Future events from this touch point reference
   *                this ID. The ID ceases to be valid after a touch up event and may be
   *                reused in the future.
   *
   *
   * @param {Number} serial serial number of the touch down event
   * @param {Number} time timestamp with millisecond granularity
   * @param {*} surface surface touched
   * @param {Number} id the unique ID of this touch point
   * @param {Fixed} x surface-local x coordinate
   * @param {Fixed} y surface-local y coordinate
   *
   * @since 1
   *
   */
  down (serial, time, surface, id, x, y) {
    if (surface == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
    const wlSurfaceResource = surface.listener.resource
    this.resource.down(serial, time, wlSurfaceResource, id, x, y)
  }

  /**
   *
   *                The touch point has disappeared. No further events will be sent for
   *                this touch point and the touch point's ID is released and may be
   *                reused in a future touch down event.
   *
   *
   * @param {Number} serial serial number of the touch up event
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} id the unique ID of this touch point
   *
   * @since 1
   *
   */
  up (serial, time, id) {
    this.resource.up(serial, time, id)
  }

  /**
   *
   *                A touch point has changed coordinates.
   *
   *
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} id the unique ID of this touch point
   * @param {Fixed} x surface-local x coordinate
   * @param {Fixed} y surface-local y coordinate
   *
   * @since 1
   *
   */
  motion (time, id, x, y) {
    this.resource.motion(time, id, x, y)
  }

  /**
   *
   *                Indicates the end of a set of events that logically belong together.
   *                A client is expected to accumulate the data in all events within the
   *                frame before proceeding.
   *
   *                A gr_touch.frame terminates at least one event but otherwise no
   *                guarantee is provided about the set of events within a frame. A client
   *                must assume that any state not updated in a frame is unchanged from the
   *                previously known state.
   *
   * @since 1
   *
   */
  frame () {
    this.resource.frame()
  }

  /**
   *
   *                Sent if the compositor decides the touch stream is a global
   *                gesture. No further events are sent to the clients from that
   *                particular gesture. Touch cancellation applies to all touch points
   *                currently active on this client's surface. The client is
   *                responsible for finalizing the touch points, future touch points on
   *                this surface may reuse the touch point ID.
   *
   * @since 1
   *
   */
  cancel () {
    this.resoure.cancel()
  }

  /**
   *
   *                Sent when a touchpoint has changed its shape.
   *
   *                This event does not occur on its own. It is sent before a
   *                gr_touch.frame event and carries the new shape information for
   *                any previously reported, or new touch points of that frame.
   *
   *                Other events describing the touch point such as gr_touch.down,
   *                gr_touch.motion or gr_touch.orientation may be sent within the
   *                same gr_touch.frame. A client should treat these events as a single
   *                logical touch point update. The order of gr_touch.shape,
   *                gr_touch.orientation and gr_touch.motion is not guaranteed.
   *                A gr_touch.down event is guaranteed to occur before the first
   *                gr_touch.shape event for this touch ID but both events may occur within
   *                the same gr_touch.frame.
   *
   *                A touchpoint shape is approximated by an ellipse through the major and
   *                minor axis length. The major axis length describes the longer diameter
   *                of the ellipse, while the minor axis length describes the shorter
   *                diameter. Major and minor are orthogonal and both are specified in
   *                surface-local coordinates. The center of the ellipse is always at the
   *                touchpoint location as reported by gr_touch.down or gr_touch.move.
   *
   *                This event is only sent by the compositor if the touch device supports
   *                shape reports. The client has to make reasonable assumptions about the
   *                shape if it did not receive this event.
   *
   *
   * @param {Number} id the unique ID of this touch point
   * @param {Fixed} major length of the major axis in surface-local coordinates
   * @param {Fixed} minor length of the minor axis in surface-local coordinates
   *
   * @since 6
   *
   */
  shape (id, major, minor) {
    this.resource.shape(id, major, minor)
  }

  /**
   *
   *                Sent when a touchpoint has changed its orientation.
   *
   *                This event does not occur on its own. It is sent before a
   *                gr_touch.frame event and carries the new shape information for
   *                any previously reported, or new touch points of that frame.
   *
   *                Other events describing the touch point such as gr_touch.down,
   *                gr_touch.motion or gr_touch.shape may be sent within the
   *                same gr_touch.frame. A client should treat these events as a single
   *                logical touch point update. The order of gr_touch.shape,
   *                gr_touch.orientation and gr_touch.motion is not guaranteed.
   *                A gr_touch.down event is guaranteed to occur before the first
   *                gr_touch.orientation event for this touch ID but both events may occur
   *                within the same gr_touch.frame.
   *
   *                The orientation describes the clockwise angle of a touchpoint's major
   *                axis to the positive surface y-axis and is normalized to the -180 to
   *                +180 degree range. The granularity of orientation depends on the touch
   *                device, some devices only support binary rotation values between 0 and
   *                90 degrees.
   *
   *                This event is only sent by the compositor if the touch device supports
   *                orientation reports.
   *
   *
   * @param {Number} id the unique ID of this touch point
   * @param {Fixed} orientation angle between major axis and positive surface y-axis in degrees
   *
   * @since 6
   *
   */
  orientation (id, orientation) {
    this.resource.orientation(id, orientation)
  }
}
