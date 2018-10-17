/*
 *
 *    Copyright © 2008-2011 Kristian Høgsberg
 *    Copyright © 2010-2011 Intel Corporation
 *    Copyright © 2012-2013 Collabora, Ltd.
 *
 *    Permission is hereby granted, free of charge, to any person
 *    obtaining a copy of this software and associated documentation files
 *    (the "Software"), to deal in the Software without restriction,
 *    including without limitation the rights to use, copy, modify, merge,
 *    publish, distribute, sublicense, and/or sell copies of the Software,
 *    and to permit persons to whom the Software is furnished to do so,
 *    subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the
 *    next paragraph) shall be included in all copies or substantial
 *    portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *    NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 *    BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 *    ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 *    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *  
 */

const fastcall = require('fastcall')
const NULL = fastcall.ref.NULL_POINTER
const PointerArray = fastcall.ArrayType('pointer')
const wsb = require('wayland-server-bindings-runtime')
const namespace = wsb.namespace
const native = wsb.native
const WlMessage = native.structs.wl_message.type
const Resource = wsb.Resource
const Interface = wsb.Interface
const WlSurface = require('./WlSurface')

/**
 *
 *      The wl_pointer interface represents one or more input devices,
 *      such as mice, which control the pointer location and pointer_focus
 *      of a seat.
 *
 *      The wl_pointer interface generates motion, enter and leave
 *      events for the surfaces that the pointer is located over,
 *      and button and axis events for button presses, button releases
 *      and scrolling.
 *    
 */
class WlPointer extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlPointer(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	Notification that this seat's pointer is focused on a certain
   *	surface.
   *
   *	When a seat's focus enters a surface, the pointer image
   *	is undefined and a client should respond to this event by setting
   *	an appropriate pointer image with the set_cursor request.
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
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._uint(serial), namespace._object(surface), namespace._fixed(surfaceX), namespace._fixed(surfaceY)])
  }

  /**
   *
   *	Notification that this seat's pointer is no longer focused on
   *	a certain surface.
   *
   *	The leave notification is sent before the enter notification
   *	for the new focus.
   *      
   *
   * @param {Number} serial serial number of the leave event
   * @param {*} surface surface left by the pointer
   *
   * @since 1
   *
   */
  leave (serial, surface) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(serial), namespace._object(surface)])
  }

  /**
   *
   *	Notification of pointer location change. The arguments
   *	surface_x and surface_y are the location relative to the
   *	focused surface.
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
    native.interface.wl_resource_post_event_array(this.ptr, 2, [namespace._uint(time), namespace._fixed(surfaceX), namespace._fixed(surfaceY)])
  }

  /**
   *
   *	Mouse button click and release notifications.
   *
   *	The location of the click is given by the last motion or
   *	enter event.
   *	The time argument is a timestamp with millisecond
   *	granularity, with an undefined base.
   *
   *	The button is a button code as defined in the Linux kernel's
   *	linux/input-event-codes.h header file, e.g. BTN_LEFT.
   *
   *	Any 16-bit button code value is reserved for future additions to the
   *	kernel's event code list. All other button codes above 0xFFFF are
   *	currently undefined but may be used in future versions of this
   *	protocol.
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
    native.interface.wl_resource_post_event_array(this.ptr, 3, [namespace._uint(serial), namespace._uint(time), namespace._uint(button), namespace._uint(state)])
  }

  /**
   *
   *	Scroll and other axis notifications.
   *
   *	For scroll events (vertical and horizontal scroll axes), the
   *	value parameter is the length of a vector along the specified
   *	axis in a coordinate space identical to those of motion events,
   *	representing a relative movement along the specified axis.
   *
   *	For devices that support movements non-parallel to axes multiple
   *	axis events will be emitted.
   *
   *	When applicable, for example for touch pads, the server can
   *	choose to emit scroll events where the motion vector is
   *	equivalent to a motion event vector.
   *
   *	When applicable, a client can transform its content relative to the
   *	scroll distance.
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
    native.interface.wl_resource_post_event_array(this.ptr, 4, [namespace._uint(time), namespace._uint(axis), namespace._fixed(value)])
  }

  /**
   *
   *	Indicates the end of a set of events that logically belong together.
   *	A client is expected to accumulate the data in all events within the
   *	frame before proceeding.
   *
   *	All wl_pointer events before a wl_pointer.frame event belong
   *	logically together. For example, in a diagonal scroll motion the
   *	compositor will send an optional wl_pointer.axis_source event, two
   *	wl_pointer.axis events (horizontal and vertical) and finally a
   *	wl_pointer.frame event. The client may use this information to
   *	calculate a diagonal vector for scrolling.
   *
   *	When multiple wl_pointer.axis events occur within the same frame,
   *	the motion vector is the combined motion of all events.
   *	When a wl_pointer.axis and a wl_pointer.axis_stop event occur within
   *	the same frame, this indicates that axis movement in one axis has
   *	stopped but continues in the other axis.
   *	When multiple wl_pointer.axis_stop events occur within the same
   *	frame, this indicates that these axes stopped in the same instance.
   *
   *	A wl_pointer.frame event is sent for every logical event group,
   *	even if the group only contains a single wl_pointer event.
   *	Specifically, a client may get a sequence: motion, frame, button,
   *	frame, axis, frame, axis_stop, frame.
   *
   *	The wl_pointer.enter and wl_pointer.leave events are logical events
   *	generated by the compositor and not the hardware. These events are
   *	also grouped by a wl_pointer.frame. When a pointer moves from one
   *	surface to another, a compositor should group the
   *	wl_pointer.leave event within the same wl_pointer.frame.
   *	However, a client must not rely on wl_pointer.leave and
   *	wl_pointer.enter being in the same wl_pointer.frame.
   *	Compositor-specific policies may require the wl_pointer.leave and
   *	wl_pointer.enter event being split across multiple wl_pointer.frame
   *	groups.
   *      
   * @since 5
   *
   */
  frame () {
    native.interface.wl_resource_post_event_array(this.ptr, 5, [])
  }

  /**
   *
   *	Source information for scroll and other axes.
   *
   *	This event does not occur on its own. It is sent before a
   *	wl_pointer.frame event and carries the source information for
   *	all events within that frame.
   *
   *	The source specifies how this event was generated. If the source is
   *	wl_pointer.axis_source.finger, a wl_pointer.axis_stop event will be
   *	sent when the user lifts the finger off the device.
   *
   *	If the source is wl_pointer.axis_source.wheel,
   *	wl_pointer.axis_source.wheel_tilt or
   *	wl_pointer.axis_source.continuous, a wl_pointer.axis_stop event may
   *	or may not be sent. Whether a compositor sends an axis_stop event
   *	for these sources is hardware-specific and implementation-dependent;
   *	clients must not rely on receiving an axis_stop event for these
   *	scroll sources and should treat scroll sequences from these scroll
   *	sources as unterminated by default.
   *
   *	This event is optional. If the source is unknown for a particular
   *	axis event sequence, no event is sent.
   *	Only one wl_pointer.axis_source event is permitted per frame.
   *
   *	The order of wl_pointer.axis_discrete and wl_pointer.axis_source is
   *	not guaranteed.
   *      
   *
   * @param {Number} axisSource source of the axis event
   *
   * @since 5
   *
   */
  axisSource (axisSource) {
    native.interface.wl_resource_post_event_array(this.ptr, 6, [namespace._uint(axisSource)])
  }

  /**
   *
   *	Stop notification for scroll and other axes.
   *
   *	For some wl_pointer.axis_source types, a wl_pointer.axis_stop event
   *	is sent to notify a client that the axis sequence has terminated.
   *	This enables the client to implement kinetic scrolling.
   *	See the wl_pointer.axis_source documentation for information on when
   *	this event may be generated.
   *
   *	Any wl_pointer.axis events with the same axis_source after this
   *	event should be considered as the start of a new axis motion.
   *
   *	The timestamp is to be interpreted identical to the timestamp in the
   *	wl_pointer.axis event. The timestamp value may be the same as a
   *	preceding wl_pointer.axis event.
   *      
   *
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} axis the axis stopped with this event
   *
   * @since 5
   *
   */
  axisStop (time, axis) {
    native.interface.wl_resource_post_event_array(this.ptr, 7, [namespace._uint(time), namespace._uint(axis)])
  }

  /**
   *
   *	Discrete step information for scroll and other axes.
   *
   *	This event carries the axis value of the wl_pointer.axis event in
   *	discrete steps (e.g. mouse wheel clicks).
   *
   *	This event does not occur on its own, it is coupled with a
   *	wl_pointer.axis event that represents this axis value on a
   *	continuous scale. The protocol guarantees that each axis_discrete
   *	event is always followed by exactly one axis event with the same
   *	axis number within the same wl_pointer.frame. Note that the protocol
   *	allows for other events to occur between the axis_discrete and
   *	its coupled axis event, including other axis_discrete or axis
   *	events.
   *
   *	This event is optional; continuous scrolling devices
   *	like two-finger scrolling on touchpads do not have discrete
   *	steps and do not generate this event.
   *
   *	The discrete value carries the directional information. e.g. a value
   *	of -2 is two steps towards the negative direction of this axis.
   *
   *	The axis number is identical to the axis number in the associated
   *	axis event.
   *
   *	The order of wl_pointer.axis_discrete and wl_pointer.axis_source is
   *	not guaranteed.
   *      
   *
   * @param {Number} axis axis type
   * @param {Number} discrete number of steps
   *
   * @since 5
   *
   */
  axisDiscrete (axis, discrete) {
    native.interface.wl_resource_post_event_array(this.ptr, 8, [namespace._uint(axis), namespace._int(discrete)])
  }
}

WlPointer.name = 'wl_pointer'

WlPointer.interface_ = Interface.create('wl_pointer', 6)
WlPointer.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('set_cursor'),
    signature: fastcall.makeStringBuffer('1u?oii'),
    types: new PointerArray([
      NULL,
      WlSurface.interface_.ptr,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('release'),
    signature: fastcall.makeStringBuffer('3'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('enter'),
    signature: fastcall.makeStringBuffer('1uoff'),
    types: new PointerArray([
      NULL,
      WlSurface.interface_.ptr,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('leave'),
    signature: fastcall.makeStringBuffer('1uo'),
    types: new PointerArray([
      NULL,
      WlSurface.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('motion'),
    signature: fastcall.makeStringBuffer('1uff'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('button'),
    signature: fastcall.makeStringBuffer('1uuuu'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('axis'),
    signature: fastcall.makeStringBuffer('1uuf'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('frame'),
    signature: fastcall.makeStringBuffer('5'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('axis_source'),
    signature: fastcall.makeStringBuffer('5u'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('axis_stop'),
    signature: fastcall.makeStringBuffer('5uu'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('axis_discrete'),
    signature: fastcall.makeStringBuffer('5ui'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  })])

namespace.WlPointer = WlPointer
namespace.wl_pointer = WlPointer
module.exports = WlPointer
