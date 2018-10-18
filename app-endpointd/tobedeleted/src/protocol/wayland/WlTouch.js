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
 *      The wl_touch interface represents a touchscreen
 *      associated with a seat.
 *
 *      Touch interactions can consist of one or more contacts.
 *      For each contact, a series of events is generated, starting
 *      with a down event, followed by zero or more motion events,
 *      and ending with an up event. Events relating to the same
 *      contact point can be identified by the ID of the sequence.
 *    
 */
class WlTouch extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlTouch(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	A new touch point has appeared on the surface. This touch point is
   *	assigned a unique ID. Future events from this touch point reference
   *	this ID. The ID ceases to be valid after a touch up event and may be
   *	reused in the future.
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
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._uint(serial), namespace._uint(time), namespace._object(surface), namespace._int(id), namespace._fixed(x), namespace._fixed(y)])
  }

  /**
   *
   *	The touch point has disappeared. No further events will be sent for
   *	this touch point and the touch point's ID is released and may be
   *	reused in a future touch down event.
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
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(serial), namespace._uint(time), namespace._int(id)])
  }

  /**
   *
   *	A touch point has changed coordinates.
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
    native.interface.wl_resource_post_event_array(this.ptr, 2, [namespace._uint(time), namespace._int(id), namespace._fixed(x), namespace._fixed(y)])
  }

  /**
   *
   *	Indicates the end of a set of events that logically belong together.
   *	A client is expected to accumulate the data in all events within the
   *	frame before proceeding.
   *
   *	A wl_touch.frame terminates at least one event but otherwise no
   *	guarantee is provided about the set of events within a frame. A client
   *	must assume that any state not updated in a frame is unchanged from the
   *	previously known state.
   *      
   * @since 1
   *
   */
  frame () {
    native.interface.wl_resource_post_event_array(this.ptr, 3, [])
  }

  /**
   *
   *	Sent if the compositor decides the touch stream is a global
   *	gesture. No further events are sent to the clients from that
   *	particular gesture. Touch cancellation applies to all touch points
   *	currently active on this client's surface. The client is
   *	responsible for finalizing the touch points, future touch points on
   *	this surface may reuse the touch point ID.
   *      
   * @since 1
   *
   */
  cancel () {
    native.interface.wl_resource_post_event_array(this.ptr, 4, [])
  }

  /**
   *
   *	Sent when a touchpoint has changed its shape.
   *
   *	This event does not occur on its own. It is sent before a
   *	wl_touch.frame event and carries the new shape information for
   *	any previously reported, or new touch points of that frame.
   *
   *	Other events describing the touch point such as wl_touch.down,
   *	wl_touch.motion or wl_touch.orientation may be sent within the
   *	same wl_touch.frame. A client should treat these events as a single
   *	logical touch point update. The order of wl_touch.shape,
   *	wl_touch.orientation and wl_touch.motion is not guaranteed.
   *	A wl_touch.down event is guaranteed to occur before the first
   *	wl_touch.shape event for this touch ID but both events may occur within
   *	the same wl_touch.frame.
   *
   *	A touchpoint shape is approximated by an ellipse through the major and
   *	minor axis length. The major axis length describes the longer diameter
   *	of the ellipse, while the minor axis length describes the shorter
   *	diameter. Major and minor are orthogonal and both are specified in
   *	surface-local coordinates. The center of the ellipse is always at the
   *	touchpoint location as reported by wl_touch.down or wl_touch.move.
   *
   *	This event is only sent by the compositor if the touch device supports
   *	shape reports. The client has to make reasonable assumptions about the
   *	shape if it did not receive this event.
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
    native.interface.wl_resource_post_event_array(this.ptr, 5, [namespace._int(id), namespace._fixed(major), namespace._fixed(minor)])
  }

  /**
   *
   *	Sent when a touchpoint has changed its orientation.
   *
   *	This event does not occur on its own. It is sent before a
   *	wl_touch.frame event and carries the new shape information for
   *	any previously reported, or new touch points of that frame.
   *
   *	Other events describing the touch point such as wl_touch.down,
   *	wl_touch.motion or wl_touch.shape may be sent within the
   *	same wl_touch.frame. A client should treat these events as a single
   *	logical touch point update. The order of wl_touch.shape,
   *	wl_touch.orientation and wl_touch.motion is not guaranteed.
   *	A wl_touch.down event is guaranteed to occur before the first
   *	wl_touch.orientation event for this touch ID but both events may occur
   *	within the same wl_touch.frame.
   *
   *	The orientation describes the clockwise angle of a touchpoint's major
   *	axis to the positive surface y-axis and is normalized to the -180 to
   *	+180 degree range. The granularity of orientation depends on the touch
   *	device, some devices only support binary rotation values between 0 and
   *	90 degrees.
   *
   *	This event is only sent by the compositor if the touch device supports
   *	orientation reports.
   *      
   *
   * @param {Number} id the unique ID of this touch point
   * @param {Fixed} orientation angle between major axis and positive surface y-axis in degrees
   *
   * @since 6
   *
   */
  orientation (id, orientation) {
    native.interface.wl_resource_post_event_array(this.ptr, 6, [namespace._int(id), namespace._fixed(orientation)])
  }
}

WlTouch.name = 'wl_touch'

WlTouch.interface_ = Interface.create('wl_touch', 6)
WlTouch.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('release'),
    signature: fastcall.makeStringBuffer('3'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('down'),
    signature: fastcall.makeStringBuffer('1uuoiff'),
    types: new PointerArray([
      NULL,
      NULL,
      WlSurface.interface_.ptr,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('up'),
    signature: fastcall.makeStringBuffer('1uui'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('motion'),
    signature: fastcall.makeStringBuffer('1uiff'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('frame'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('cancel'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('shape'),
    signature: fastcall.makeStringBuffer('6iff'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('orientation'),
    signature: fastcall.makeStringBuffer('6if'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  })])

namespace.WlTouch = WlTouch
namespace.wl_touch = WlTouch
module.exports = WlTouch
