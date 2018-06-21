'use strict'

module.exports = class LocalPointer {
  /**
   * @return {LocalPointer}
   */
  static create () {
    return new LocalPointer()
  }

  /**
   * @private
   */
  constructor () {
    this.resource = null
  }

  /**
   *
   *                Notification that this seat's pointer is focused on a certain
   *                surface.
   *
   *                When a seat's focus enters a surface, the pointer image
   *                is undefined and a client should respond to this event by setting
   *                an appropriate pointer image with the set_cursor request.
   *
   *
   * @param {Number} serial serial number of the enter event
   * @param {*} surface surface entered by the pointer
   * @param {Fixed} surfaceX surface-local x coordinate
   * @param {Fixed} surfaceY surface-local y coordinate
   *
   * @since 1
   *
   */
  enter (serial, surface, surfaceX, surfaceY) {
    if (surface == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
    const wlSurfaceResource = surface.listener.resource
    this.resource.enter(serial, wlSurfaceResource, surfaceX, surfaceY)
  }

  /**
   *
   *                Notification that this seat's pointer is no longer focused on
   *                a certain surface.
   *
   *                The leave notification is sent before the enter notification
   *                for the new focus.
   *
   *
   * @param {Number} serial serial number of the leave event
   * @param {*} surface surface left by the pointer
   *
   * @since 1
   *
   */
  leave (serial, surface) {
    if (surface == null) {
      // object argument was destroyed by the client before the server noticed.
      return
    }
    const wlSurfaceResource = surface.listener.resource
    this.resource.leave(serial, wlSurfaceResource)
  }

  /**
   *
   *                Notification of pointer location change. The arguments
   *                surface_x and surface_y are the location relative to the
   *                focused surface.
   *
   *
   * @param {Number} time timestamp with millisecond granularity
   * @param {Fixed} surfaceX surface-local x coordinate
   * @param {Fixed} surfaceY surface-local y coordinate
   *
   * @since 1
   *
   */
  motion (time, surfaceX, surfaceY) {
    this.resource.motion(time, surfaceX, surfaceY)
  }

  /**
   *
   *                Mouse button click and release notifications.
   *
   *                The location of the click is given by the last motion or
   *                enter event.
   *                The time argument is a timestamp with millisecond
   *                granularity, with an undefined base.
   *
   *                The button is a button code as defined in the Linux kernel's
   *                linux/input-event-codes.h header file, e.g. BTN_LEFT.
   *
   *                Any 16-bit button code value is reserved for future additions to the
   *                kernel's event code list. All other button codes above 0xFFFF are
   *                currently undefined but may be used in future versions of this
   *                protocol.
   *
   *
   * @param {Number} serial serial number of the button event
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} button button that produced the event
   * @param {Number} state physical state of the button
   *
   * @since 1
   *
   */
  button (serial, time, button, state) {
    this.resource.button(serial, time, button, state)
  }

  /**
   *
   *                Scroll and other axis notifications.
   *
   *                For scroll events (vertical and horizontal scroll axes), the
   *                value parameter is the length of a vector along the specified
   *                axis in a coordinate space identical to those of motion events,
   *                representing a relative movement along the specified axis.
   *
   *                For devices that support movements non-parallel to axes multiple
   *                axis events will be emitted.
   *
   *                When applicable, for example for touch pads, the server can
   *                choose to emit scroll events where the motion vector is
   *                equivalent to a motion event vector.
   *
   *                When applicable, a client can transform its content relative to the
   *                scroll distance.
   *
   *
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} axis axis type
   * @param {Fixed} value length of vector in surface-local coordinate space
   *
   * @since 1
   *
   */
  axis (time, axis, value) {
    this.resource.axis(time, axis, value)
  }

  /**
   *
   *                Indicates the end of a set of events that logically belong together.
   *                A client is expected to accumulate the data in all events within the
   *                frame before proceeding.
   *
   *                All gr_pointer events before a gr_pointer.frame event belong
   *                logically together. For example, in a diagonal scroll motion the
   *                compositor will send an optional gr_pointer.axis_source event, two
   *                gr_pointer.axis events (horizontal and vertical) and finally a
   *                gr_pointer.frame event. The client may use this information to
   *                calculate a diagonal vector for scrolling.
   *
   *                When multiple gr_pointer.axis events occur within the same frame,
   *                the motion vector is the combined motion of all events.
   *                When a gr_pointer.axis and a gr_pointer.axis_stop event occur within
   *                the same frame, this indicates that axis movement in one axis has
   *                stopped but continues in the other axis.
   *                When multiple gr_pointer.axis_stop events occur within the same
   *                frame, this indicates that these axes stopped in the same instance.
   *
   *                A gr_pointer.frame event is sent for every logical event group,
   *                even if the group only contains a single gr_pointer event.
   *                Specifically, a client may get a sequence: motion, frame, button,
   *                frame, axis, frame, axis_stop, frame.
   *
   *                The gr_pointer.enter and gr_pointer.leave events are logical events
   *                generated by the compositor and not the hardware. These events are
   *                also grouped by a gr_pointer.frame. When a pointer moves from one
   *                surface to another, a compositor should group the
   *                gr_pointer.leave event within the same gr_pointer.frame.
   *                However, a client must not rely on gr_pointer.leave and
   *                gr_pointer.enter being in the same gr_pointer.frame.
   *                Compositor-specific policies may require the gr_pointer.leave and
   *                gr_pointer.enter event being split across multiple gr_pointer.frame
   *                groups.
   *
   * @since 5
   *
   */
  frame () {
    this.resource.frame()
  }

  /**
   *
   *                Source information for scroll and other axes.
   *
   *                This event does not occur on its own. It is sent before a
   *                gr_pointer.frame event and carries the source information for
   *                all events within that frame.
   *
   *                The source specifies how this event was generated. If the source is
   *                gr_pointer.axis_source.finger, a gr_pointer.axis_stop event will be
   *                sent when the user lifts the finger off the device.
   *
   *                If the source is gr_pointer.axis_source.wheel,
   *                gr_pointer.axis_source.wheel_tilt or
   *                gr_pointer.axis_source.continuous, a gr_pointer.axis_stop event may
   *                or may not be sent. Whether a compositor sends an axis_stop event
   *                for these sources is hardware-specific and implementation-dependent;
   *                clients must not rely on receiving an axis_stop event for these
   *                scroll sources and should treat scroll sequences from these scroll
   *                sources as unterminated by default.
   *
   *                This event is optional. If the source is unknown for a particular
   *                axis event sequence, no event is sent.
   *                Only one gr_pointer.axis_source event is permitted per frame.
   *
   *                The order of gr_pointer.axis_discrete and gr_pointer.axis_source is
   *                not guaranteed.
   *
   *
   * @param {Number} axisSource source of the axis event
   *
   * @since 5
   *
   */
  axisSource (axisSource) {
    this.resource.axisSource(axisSource)
  }

  /**
   *
   *                Stop notification for scroll and other axes.
   *
   *                For some gr_pointer.axis_source types, a gr_pointer.axis_stop event
   *                is sent to notify a client that the axis sequence has terminated.
   *                This enables the client to implement kinetic scrolling.
   *                See the gr_pointer.axis_source documentation for information on when
   *                this event may be generated.
   *
   *                Any gr_pointer.axis events with the same axis_source after this
   *                event should be considered as the start of a new axis motion.
   *
   *                The timestamp is to be interpreted identical to the timestamp in the
   *                gr_pointer.axis event. The timestamp value may be the same as a
   *                preceding gr_pointer.axis event.
   *
   *
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} axis the axis stopped with this event
   *
   * @since 5
   *
   */
  axisStop (time, axis) {
    this.resource.axisStop(time, axis)
  }

  /**
   *
   *                Discrete step information for scroll and other axes.
   *
   *                This event carries the axis value of the gr_pointer.axis event in
   *                discrete steps (e.g. mouse wheel clicks).
   *
   *                This event does not occur on its own, it is coupled with a
   *                gr_pointer.axis event that represents this axis value on a
   *                continuous scale. The protocol guarantees that each axis_discrete
   *                event is always followed by exactly one axis event with the same
   *                axis number within the same gr_pointer.frame. Note that the protocol
   *                allows for other events to occur between the axis_discrete and
   *                its coupled axis event, including other axis_discrete or axis
   *                events.
   *
   *                This event is optional; continuous scrolling devices
   *                like two-finger scrolling on touchpads do not have discrete
   *                steps and do not generate this event.
   *
   *                The discrete value carries the directional information. e.g. a value
   *                of -2 is two steps towards the negative direction of this axis.
   *
   *                The axis number is identical to the axis number in the associated
   *                axis event.
   *
   *                The order of gr_pointer.axis_discrete and gr_pointer.axis_source is
   *                not guaranteed.
   *
   *
   * @param {Number} axis axis type
   * @param {Number} discrete number of steps
   *
   * @since 5
   *
   */
  axisDiscrete (axis, discrete) {
    this.resource.axisDiscrete(axis, discrete)
  }
}
