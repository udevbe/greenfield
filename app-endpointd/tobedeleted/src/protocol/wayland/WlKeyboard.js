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
 *      The wl_keyboard interface represents one or more keyboards
 *      associated with a seat.
 *    
 */
class WlKeyboard extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlKeyboard(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	This event provides a file descriptor to the client which can be
   *	memory-mapped to provide a keyboard mapping description.
   *      
   *
   * @param {Number} format keymap format
   * @param {Number} fd keymap file descriptor
   * @param {Number} size keymap size, in bytes
   *
   * @since 1
   *
   */
  keymap (format, fd, size) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._uint(format), namespace._fd(fd), namespace._uint(size)])
  }

  /**
   *
   *	Notification that this seat's keyboard focus is on a certain
   *	surface.
   *      
   *
   * @param {Number} serial serial number of the enter event
   * @param {*} surface surface gaining keyboard focus
   * @param {ArrayBuffer} keys the currently pressed keys
   *
   * @since 1
   *
   */
  enter (serial, surface, keys) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(serial), namespace._object(surface), namespace._array(keys)])
  }

  /**
   *
   *	Notification that this seat's keyboard focus is no longer on
   *	a certain surface.
   *
   *	The leave notification is sent before the enter notification
   *	for the new focus.
   *      
   *
   * @param {Number} serial serial number of the leave event
   * @param {*} surface surface that lost keyboard focus
   *
   * @since 1
   *
   */
  leave (serial, surface) {
    native.interface.wl_resource_post_event_array(this.ptr, 2, [namespace._uint(serial), namespace._object(surface)])
  }

  /**
   *
   *	A key was pressed or released.
   *	The time argument is a timestamp with millisecond
   *	granularity, with an undefined base.
   *      
   *
   * @param {Number} serial serial number of the key event
   * @param {Number} time timestamp with millisecond granularity
   * @param {Number} key key that produced the event
   * @param {Number} state physical state of the key
   *
   * @since 1
   *
   */
  key (serial, time, key, state) {
    native.interface.wl_resource_post_event_array(this.ptr, 3, [namespace._uint(serial), namespace._uint(time), namespace._uint(key), namespace._uint(state)])
  }

  /**
   *
   *	Notifies clients that the modifier and/or group state has
   *	changed, and it should update its local state.
   *      
   *
   * @param {Number} serial serial number of the modifiers event
   * @param {Number} modsDepressed depressed modifiers
   * @param {Number} modsLatched latched modifiers
   * @param {Number} modsLocked locked modifiers
   * @param {Number} group keyboard layout
   *
   * @since 1
   *
   */
  modifiers (serial, modsDepressed, modsLatched, modsLocked, group) {
    native.interface.wl_resource_post_event_array(this.ptr, 4, [namespace._uint(serial), namespace._uint(modsDepressed), namespace._uint(modsLatched), namespace._uint(modsLocked), namespace._uint(group)])
  }

  /**
   *
   *	Informs the client about the keyboard's repeat rate and delay.
   *
   *	This event is sent as soon as the wl_keyboard object has been created,
   *	and is guaranteed to be received by the client before any key press
   *	event.
   *
   *	Negative values for either rate or delay are illegal. A rate of zero
   *	will disable any repeating (regardless of the value of delay).
   *
   *	This event can be sent later on as well with a new value if necessary,
   *	so clients should continue listening for the event past the creation
   *	of wl_keyboard.
   *      
   *
   * @param {Number} rate the rate of repeating keys in characters per second
   * @param {Number} delay delay in milliseconds since key down until repeating starts
   *
   * @since 4
   *
   */
  repeatInfo (rate, delay) {
    native.interface.wl_resource_post_event_array(this.ptr, 5, [namespace._int(rate), namespace._int(delay)])
  }
}

WlKeyboard.name = 'wl_keyboard'

WlKeyboard.interface_ = Interface.create('wl_keyboard', 6)
WlKeyboard.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('release'),
    signature: fastcall.makeStringBuffer('3'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('keymap'),
    signature: fastcall.makeStringBuffer('1uhu'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('enter'),
    signature: fastcall.makeStringBuffer('1uoa'),
    types: new PointerArray([
      NULL,
      WlSurface.interface_.ptr,
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
    name: fastcall.makeStringBuffer('key'),
    signature: fastcall.makeStringBuffer('1uuuu'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('modifiers'),
    signature: fastcall.makeStringBuffer('1uuuuu'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('repeat_info'),
    signature: fastcall.makeStringBuffer('4ii'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  })])

namespace.WlKeyboard = WlKeyboard
namespace.wl_keyboard = WlKeyboard
module.exports = WlKeyboard
