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
const WlSeat = require('./WlSeat')
const WlSurface = require('./WlSurface')
const WlOutput = require('./WlOutput')

/**
 *
 *      An interface that may be implemented by a wl_surface, for
 *      implementations that provide a desktop-style user interface.
 *
 *      It provides requests to treat surfaces like toplevel, fullscreen
 *      or popup windows, move, resize or maximize them, associate
 *      metadata like title and class, etc.
 *
 *      On the server side the object is automatically destroyed when
 *      the related wl_surface is destroyed. On the client side,
 *      wl_shell_surface_destroy() must be called before destroying
 *      the wl_surface object.
 *    
 */
class WlShellSurface extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlShellSurface(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	Ping a client to check if it is receiving events and sending
   *	requests. A client is expected to reply with a pong request.
   *      
   *
   * @param {Number} serial serial number of the ping
   *
   * @since 1
   *
   */
  ping (serial) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._uint(serial)])
  }

  /**
   *
   *	The configure event asks the client to resize its surface.
   *
   *	The size is a hint, in the sense that the client is free to
   *	ignore it if it doesn't resize, pick a smaller size (to
   *	satisfy aspect ratio or resize in steps of NxM pixels).
   *
   *	The edges parameter provides a hint about how the surface
   *	was resized. The client may use this information to decide
   *	how to adjust its content to the new size (e.g. a scrolling
   *	area might adjust its content position to leave the viewable
   *	content unmoved).
   *
   *	The client is free to dismiss all but the last configure
   *	event it received.
   *
   *	The width and height arguments specify the size of the window
   *	in surface-local coordinates.
   *      
   *
   * @param {Number} edges how the surface was resized
   * @param {Number} width new width of the surface
   * @param {Number} height new height of the surface
   *
   * @since 1
   *
   */
  configure (edges, width, height) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(edges), namespace._int(width), namespace._int(height)])
  }

  /**
   *
   *	The popup_done event is sent out when a popup grab is broken,
   *	that is, when the user clicks a surface that doesn't belong
   *	to the client owning the popup surface.
   *      
   * @since 1
   *
   */
  popupDone () {
    native.interface.wl_resource_post_event_array(this.ptr, 2, [])
  }
}

WlShellSurface.name = 'wl_shell_surface'

WlShellSurface.interface_ = Interface.create('wl_shell_surface', 1)
WlShellSurface.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('pong'),
    signature: fastcall.makeStringBuffer('1u'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('move'),
    signature: fastcall.makeStringBuffer('1ou'),
    types: new PointerArray([
      WlSeat.interface_.ptr,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('resize'),
    signature: fastcall.makeStringBuffer('1ouu'),
    types: new PointerArray([
      WlSeat.interface_.ptr,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_toplevel'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_transient'),
    signature: fastcall.makeStringBuffer('1oiiu'),
    types: new PointerArray([
      WlSurface.interface_.ptr,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_fullscreen'),
    signature: fastcall.makeStringBuffer('1uu?o'),
    types: new PointerArray([
      NULL,
      NULL,
      WlOutput.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_popup'),
    signature: fastcall.makeStringBuffer('1ouoiiu'),
    types: new PointerArray([
      WlSeat.interface_.ptr,
      NULL,
      WlSurface.interface_.ptr,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_maximized'),
    signature: fastcall.makeStringBuffer('1?o'),
    types: new PointerArray([
      WlOutput.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_title'),
    signature: fastcall.makeStringBuffer('1s'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_class'),
    signature: fastcall.makeStringBuffer('1s'),
    types: new PointerArray([
      NULL
    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('ping'),
    signature: fastcall.makeStringBuffer('1u'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('configure'),
    signature: fastcall.makeStringBuffer('1uii'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('popup_done'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  })])

namespace.WlShellSurface = WlShellSurface
namespace.wl_shell_surface = WlShellSurface
module.exports = WlShellSurface
