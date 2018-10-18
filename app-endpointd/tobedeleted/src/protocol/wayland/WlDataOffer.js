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
 *      A wl_data_offer represents a piece of data offered for transfer
 *      by another client (the source client).  It is used by the
 *      copy-and-paste and drag-and-drop mechanisms.  The offer
 *      describes the different mime types that the data can be
 *      converted to and provides the mechanism for transferring the
 *      data directly from the source client.
 *    
 */
class WlDataOffer extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlDataOffer(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	Sent immediately after creating the wl_data_offer object.  One
   *	event per offered mime type.
   *      
   *
   * @param {string} mimeType offered mime type
   *
   * @since 1
   *
   */
  offer (mimeType) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._string(mimeType)])
  }

  /**
   *
   *	This event indicates the actions offered by the data source. It
   *	will be sent right after wl_data_device.enter, or anytime the source
   *	side changes its offered actions through wl_data_source.set_actions.
   *      
   *
   * @param {Number} sourceActions actions offered by the data source
   *
   * @since 3
   *
   */
  sourceActions (sourceActions) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(sourceActions)])
  }

  /**
   *
   *	This event indicates the action selected by the compositor after
   *	matching the source/destination side actions. Only one action (or
   *	none) will be offered here.
   *
   *	This event can be emitted multiple times during the drag-and-drop
   *	operation in response to destination side action changes through
   *	wl_data_offer.set_actions.
   *
   *	This event will no longer be emitted after wl_data_device.drop
   *	happened on the drag-and-drop destination, the client must
   *	honor the last action received, or the last preferred one set
   *	through wl_data_offer.set_actions when handling an "ask" action.
   *
   *	Compositors may also change the selected action on the fly, mainly
   *	in response to keyboard modifier changes during the drag-and-drop
   *	operation.
   *
   *	The most recent action received is always the valid one. Prior to
   *	receiving wl_data_device.drop, the chosen action may change (e.g.
   *	due to keyboard modifiers being pressed). At the time of receiving
   *	wl_data_device.drop the drag-and-drop destination must honor the
   *	last action received.
   *
   *	Action changes may still happen after wl_data_device.drop,
   *	especially on "ask" actions, where the drag-and-drop destination
   *	may choose another action afterwards. Action changes happening
   *	at this stage are always the result of inter-client negotiation, the
   *	compositor shall no longer be able to induce a different action.
   *
   *	Upon "ask" actions, it is expected that the drag-and-drop destination
   *	may potentially choose a different action and/or mime type,
   *	based on wl_data_offer.source_actions and finally chosen by the
   *	user (e.g. popping up a menu with the available options). The
   *	final wl_data_offer.set_actions and wl_data_offer.accept requests
   *	must happen before the call to wl_data_offer.finish.
   *      
   *
   * @param {Number} dndAction action selected by the compositor
   *
   * @since 3
   *
   */
  action (dndAction) {
    native.interface.wl_resource_post_event_array(this.ptr, 2, [namespace._uint(dndAction)])
  }
}

WlDataOffer.name = 'wl_data_offer'

WlDataOffer.interface_ = Interface.create('wl_data_offer', 3)
WlDataOffer.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('accept'),
    signature: fastcall.makeStringBuffer('1u?s'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('receive'),
    signature: fastcall.makeStringBuffer('1sh'),
    types: new PointerArray([
      NULL,
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
    name: fastcall.makeStringBuffer('finish'),
    signature: fastcall.makeStringBuffer('3'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_actions'),
    signature: fastcall.makeStringBuffer('3uu'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('offer'),
    signature: fastcall.makeStringBuffer('1s'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('source_actions'),
    signature: fastcall.makeStringBuffer('3u'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('action'),
    signature: fastcall.makeStringBuffer('3u'),
    types: new PointerArray([
      NULL
    ]).buffer
  })])

namespace.WlDataOffer = WlDataOffer
namespace.wl_data_offer = WlDataOffer
module.exports = WlDataOffer
