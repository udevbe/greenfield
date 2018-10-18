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
const WlPointer = require('./WlPointer')
const WlKeyboard = require('./WlKeyboard')
const WlTouch = require('./WlTouch')

/**
 *
 *      A seat is a group of keyboards, pointer and touch devices. This
 *      object is published as a global during start up, or when such a
 *      device is hot plugged.  A seat typically has a pointer and
 *      maintains a keyboard focus and a pointer focus.
 *    
 */
class WlSeat extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlSeat(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	This is emitted whenever a seat gains or loses the pointer,
   *	keyboard or touch capabilities.  The argument is a capability
   *	enum containing the complete set of capabilities this seat has.
   *
   *	When the pointer capability is added, a client may create a
   *	wl_pointer object using the wl_seat.get_pointer request. This object
   *	will receive pointer events until the capability is removed in the
   *	future.
   *
   *	When the pointer capability is removed, a client should destroy the
   *	wl_pointer objects associated with the seat where the capability was
   *	removed, using the wl_pointer.release request. No further pointer
   *	events will be received on these objects.
   *
   *	In some compositors, if a seat regains the pointer capability and a
   *	client has a previously obtained wl_pointer object of version 4 or
   *	less, that object may start sending pointer events again. This
   *	behavior is considered a misinterpretation of the intended behavior
   *	and must not be relied upon by the client. wl_pointer objects of
   *	version 5 or later must not send events if created before the most
   *	recent event notifying the client of an added pointer capability.
   *
   *	The above behavior also applies to wl_keyboard and wl_touch with the
   *	keyboard and touch capabilities, respectively.
   *      
   *
   * @param {Number} capabilities capabilities of the seat
   *
   * @since 1
   *
   */
  capabilities (capabilities) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._uint(capabilities)])
  }

  /**
   *
   *	In a multiseat configuration this can be used by the client to help
   *	identify which physical devices the seat represents. Based on
   *	the seat configuration used by the compositor.
   *      
   *
   * @param {string} name seat identifier
   *
   * @since 2
   *
   */
  name (name) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._string(name)])
  }
}

WlSeat.name = 'wl_seat'

WlSeat.interface_ = Interface.create('wl_seat', 6)
WlSeat.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('get_pointer'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlPointer.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('get_keyboard'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlKeyboard.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('get_touch'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlTouch.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('release'),
    signature: fastcall.makeStringBuffer('5'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('capabilities'),
    signature: fastcall.makeStringBuffer('1u'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('name'),
    signature: fastcall.makeStringBuffer('2s'),
    types: new PointerArray([
      NULL
    ]).buffer
  })])

namespace.WlSeat = WlSeat
namespace.wl_seat = WlSeat
module.exports = WlSeat
