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
const WlDataSource = require('./WlDataSource')
const WlSurface = require('./WlSurface')
const WlDataOffer = require('./WlDataOffer')

/**
 *
 *      There is one wl_data_device per seat which can be obtained
 *      from the global wl_data_device_manager singleton.
 *
 *      A wl_data_device provides access to inter-client data transfer
 *      mechanisms such as copy-and-paste and drag-and-drop.
 *    
 */
class WlDataDevice extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlDataDevice(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	The data_offer event introduces a new wl_data_offer object,
   *	which will subsequently be used in either the
   *	data_device.enter event (for drag-and-drop) or the
   *	data_device.selection event (for selections).  Immediately
   *	following the data_device_data_offer event, the new data_offer
   *	object will send out data_offer.offer events to describe the
   *	mime types it offers.
   *      
   *
   * @param {*} id the new data_offer object
   *
   * @since 1
   *
   */
  dataOffer (id) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._object(id)])
  }

  /**
   *
   *	This event is sent when an active drag-and-drop pointer enters
   *	a surface owned by the client.  The position of the pointer at
   *	enter time is provided by the x and y arguments, in surface-local
   *	coordinates.
   *      
   *
   * @param {Number} serial serial number of the enter event
   * @param {*} surface client surface entered
   * @param {Fixed} x surface-local x coordinate
   * @param {Fixed} y surface-local y coordinate
   * @param {?*} id source data_offer object
   *
   * @since 1
   *
   */
  enter (serial, surface, x, y, id) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(serial), namespace._object(surface), namespace._fixed(x), namespace._fixed(y), namespace._objectOptional(id)])
  }

  /**
   *
   *	This event is sent when the drag-and-drop pointer leaves the
   *	surface and the session ends.  The client must destroy the
   *	wl_data_offer introduced at enter time at this point.
   *      
   * @since 1
   *
   */
  leave () {
    native.interface.wl_resource_post_event_array(this.ptr, 2, [])
  }

  /**
   *
   *	This event is sent when the drag-and-drop pointer moves within
   *	the currently focused surface. The new position of the pointer
   *	is provided by the x and y arguments, in surface-local
   *	coordinates.
   *      
   *
   * @param {Number} time timestamp with millisecond granularity
   * @param {Fixed} x surface-local x coordinate
   * @param {Fixed} y surface-local y coordinate
   *
   * @since 1
   *
   */
  motion (time, x, y) {
    native.interface.wl_resource_post_event_array(this.ptr, 3, [namespace._uint(time), namespace._fixed(x), namespace._fixed(y)])
  }

  /**
   *
   *	The event is sent when a drag-and-drop operation is ended
   *	because the implicit grab is removed.
   *
   *	The drag-and-drop destination is expected to honor the last action
   *	received through wl_data_offer.action, if the resulting action is
   *	"copy" or "move", the destination can still perform
   *	wl_data_offer.receive requests, and is expected to end all
   *	transfers with a wl_data_offer.finish request.
   *
   *	If the resulting action is "ask", the action will not be considered
   *	final. The drag-and-drop destination is expected to perform one last
   *	wl_data_offer.set_actions request, or wl_data_offer.destroy in order
   *	to cancel the operation.
   *      
   * @since 1
   *
   */
  drop () {
    native.interface.wl_resource_post_event_array(this.ptr, 4, [])
  }

  /**
   *
   *	The selection event is sent out to notify the client of a new
   *	wl_data_offer for the selection for this device.  The
   *	data_device.data_offer and the data_offer.offer events are
   *	sent out immediately before this event to introduce the data
   *	offer object.  The selection event is sent to a client
   *	immediately before receiving keyboard focus and when a new
   *	selection is set while the client has keyboard focus.  The
   *	data_offer is valid until a new data_offer or NULL is received
   *	or until the client loses keyboard focus.  The client must
   *	destroy the previous selection data_offer, if any, upon receiving
   *	this event.
   *      
   *
   * @param {?*} id selection data_offer object
   *
   * @since 1
   *
   */
  selection (id) {
    native.interface.wl_resource_post_event_array(this.ptr, 5, [namespace._objectOptional(id)])
  }
}

WlDataDevice.name = 'wl_data_device'

WlDataDevice.interface_ = Interface.create('wl_data_device', 3)
WlDataDevice.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('start_drag'),
    signature: fastcall.makeStringBuffer('1?oo?ou'),
    types: new PointerArray([
      WlDataSource.interface_.ptr,
      WlSurface.interface_.ptr,
      WlSurface.interface_.ptr,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_selection'),
    signature: fastcall.makeStringBuffer('1?ou'),
    types: new PointerArray([
      WlDataSource.interface_.ptr,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('release'),
    signature: fastcall.makeStringBuffer('2'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('data_offer'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlDataOffer.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('enter'),
    signature: fastcall.makeStringBuffer('1uoff?o'),
    types: new PointerArray([
      NULL,
      WlSurface.interface_.ptr,
      NULL,
      NULL,
      WlDataOffer.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('leave'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

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
    name: fastcall.makeStringBuffer('drop'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('selection'),
    signature: fastcall.makeStringBuffer('1?o'),
    types: new PointerArray([
      WlDataOffer.interface_.ptr
    ]).buffer
  })])

namespace.WlDataDevice = WlDataDevice
namespace.wl_data_device = WlDataDevice
module.exports = WlDataDevice
