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

/**
 *
 *      The wl_data_source object is the source side of a wl_data_offer.
 *      It is created by the source client in a data transfer and
 *      provides a way to describe the offered data and a way to respond
 *      to requests to transfer the data.
 *    
 */
class WlDataSource extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlDataSource(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	Sent when a target accepts pointer_focus or motion events.  If
   *	a target does not accept any of the offered types, type is NULL.
   *
   *	Used for feedback during drag-and-drop.
   *      
   *
   * @param {?string} mimeType mime type accepted by the target
   *
   * @since 1
   *
   */
  target (mimeType) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._stringOptional(mimeType)])
  }

  /**
   *
   *	Request for data from the client.  Send the data as the
   *	specified mime type over the passed file descriptor, then
   *	close it.
   *      
   *
   * @param {string} mimeType mime type for the data
   * @param {Number} fd file descriptor for the data
   *
   * @since 1
   *
   */
  send (mimeType, fd) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._string(mimeType), namespace._fd(fd)])
  }

  /**
   *
   *	This data source is no longer valid. There are several reasons why
   *	this could happen:
   *
   *	- The data source has been replaced by another data source.
   *	- The drag-and-drop operation was performed, but the drop destination
   *	  did not accept any of the mime types offered through
   *	  wl_data_source.target.
   *	- The drag-and-drop operation was performed, but the drop destination
   *	  did not select any of the actions present in the mask offered through
   *	  wl_data_source.action.
   *	- The drag-and-drop operation was performed but didn't happen over a
   *	  surface.
   *	- The compositor cancelled the drag-and-drop operation (e.g. compositor
   *	  dependent timeouts to avoid stale drag-and-drop transfers).
   *
   *	The client should clean up and destroy this data source.
   *
   *	For objects of version 2 or older, wl_data_source.cancelled will
   *	only be emitted if the data source was replaced by another data
   *	source.
   *      
   * @since 1
   *
   */
  cancelled () {
    native.interface.wl_resource_post_event_array(this.ptr, 2, [])
  }

  /**
   *
   *	The user performed the drop action. This event does not indicate
   *	acceptance, wl_data_source.cancelled may still be emitted afterwards
   *	if the drop destination does not accept any mime type.
   *
   *	However, this event might however not be received if the compositor
   *	cancelled the drag-and-drop operation before this event could happen.
   *
   *	Note that the data_source may still be used in the future and should
   *	not be destroyed here.
   *      
   * @since 3
   *
   */
  dndDropPerformed () {
    native.interface.wl_resource_post_event_array(this.ptr, 3, [])
  }

  /**
   *
   *	The drop destination finished interoperating with this data
   *	source, so the client is now free to destroy this data source and
   *	free all associated data.
   *
   *	If the action used to perform the operation was "move", the
   *	source can now delete the transferred data.
   *      
   * @since 3
   *
   */
  dndFinished () {
    native.interface.wl_resource_post_event_array(this.ptr, 4, [])
  }

  /**
   *
   *	This event indicates the action selected by the compositor after
   *	matching the source/destination side actions. Only one action (or
   *	none) will be offered here.
   *
   *	This event can be emitted multiple times during the drag-and-drop
   *	operation, mainly in response to destination side changes through
   *	wl_data_offer.set_actions, and as the data device enters/leaves
   *	surfaces.
   *
   *	It is only possible to receive this event after
   *	wl_data_source.dnd_drop_performed if the drag-and-drop operation
   *	ended in an "ask" action, in which case the final wl_data_source.action
   *	event will happen immediately before wl_data_source.dnd_finished.
   *
   *	Compositors may also change the selected action on the fly, mainly
   *	in response to keyboard modifier changes during the drag-and-drop
   *	operation.
   *
   *	The most recent action received is always the valid one. The chosen
   *	action may change alongside negotiation (e.g. an "ask" action can turn
   *	into a "move" operation), so the effects of the final action must
   *	always be applied in wl_data_offer.dnd_finished.
   *
   *	Clients can trigger cursor surface changes from this point, so
   *	they reflect the current action.
   *      
   *
   * @param {Number} dndAction action selected by the compositor
   *
   * @since 3
   *
   */
  action (dndAction) {
    native.interface.wl_resource_post_event_array(this.ptr, 5, [namespace._uint(dndAction)])
  }
}

WlDataSource.name = 'wl_data_source'

WlDataSource.interface_ = Interface.create('wl_data_source', 3)
WlDataSource.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('offer'),
    signature: fastcall.makeStringBuffer('1s'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('destroy'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_actions'),
    signature: fastcall.makeStringBuffer('3u'),
    types: new PointerArray([
      NULL
    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('target'),
    signature: fastcall.makeStringBuffer('1?s'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('send'),
    signature: fastcall.makeStringBuffer('1sh'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('cancelled'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('dnd_drop_performed'),
    signature: fastcall.makeStringBuffer('3'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('dnd_finished'),
    signature: fastcall.makeStringBuffer('3'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('action'),
    signature: fastcall.makeStringBuffer('3u'),
    types: new PointerArray([
      NULL
    ]).buffer
  })])

namespace.WlDataSource = WlDataSource
namespace.wl_data_source = WlDataSource
module.exports = WlDataSource
