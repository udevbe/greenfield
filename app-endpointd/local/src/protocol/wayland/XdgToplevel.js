/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
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
const WlOutput = require('./WlOutput')

/**
 *
 *      This interface defines an xdg_surface role which allows a surface to,
 *      among other things, set window-like properties such as maximize,
 *      fullscreen, and minimize, set application-specific metadata like title and
 *      id, and well as trigger user interactive operations such as interactive
 *      resize and move.
 *
 *      Unmapping an xdg_toplevel means that the surface cannot be shown
 *      by the compositor until it is explicitly mapped again.
 *      All active operations (e.g., move, resize) are canceled and all
 *      attributes (e.g. title, state, stacking, ...) are discarded for
 *      an xdg_toplevel surface when it is unmapped.
 *
 *      Attaching a null buffer to a toplevel unmaps the surface.
 *    
 */
class XdgToplevel extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new XdgToplevel(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	This configure event asks the client to resize its toplevel surface or
   *	to change its state. The configured state should not be applied
   *	immediately. See xdg_surface.configure for details.
   *
   *	The width and height arguments specify a hint to the window
   *	about how its surface should be resized in window geometry
   *	coordinates. See set_window_geometry.
   *
   *	If the width or height arguments are zero, it means the client
   *	should decide its own window dimension. This may happen when the
   *	compositor needs to configure the state of the surface but doesn't
   *	have any information about any previous or expected dimension.
   *
   *	The states listed in the event specify how the width/height
   *	arguments should be interpreted, and possibly how it should be
   *	drawn.
   *
   *	Clients must send an ack_configure in response to this event. See
   *	xdg_surface.configure and xdg_surface.ack_configure for details.
   *      
   *
   * @param {Number} width undefined
   * @param {Number} height undefined
   * @param {ArrayBuffer} states undefined
   *
   * @since 1
   *
   */
  configure (width, height, states) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._int(width), namespace._int(height), namespace._array(states)])
  }

  /**
   *
   *	The close event is sent by the compositor when the user
   *	wants the surface to be closed. This should be equivalent to
   *	the user clicking the close button in client-side decorations,
   *	if your application has any.
   *
   *	This is only a request that the user intends to close the
   *	window. The client may choose to ignore this request, or show
   *	a dialog to ask the user to save their data, etc.
   *      
   * @since 1
   *
   */
  close () {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [])
  }
}

XdgToplevel.name = 'xdg_toplevel'

XdgToplevel.interface_ = Interface.create('xdg_toplevel', 1)
XdgToplevel.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('destroy'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_parent'),
    signature: fastcall.makeStringBuffer('1?o'),
    types: new PointerArray([
      XdgToplevel.interface_.ptr
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
    name: fastcall.makeStringBuffer('set_app_id'),
    signature: fastcall.makeStringBuffer('1s'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('show_window_menu'),
    signature: fastcall.makeStringBuffer('1ouii'),
    types: new PointerArray([
      WlSeat.interface_.ptr,
      NULL,
      NULL,
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
    name: fastcall.makeStringBuffer('set_max_size'),
    signature: fastcall.makeStringBuffer('1ii'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_min_size'),
    signature: fastcall.makeStringBuffer('1ii'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_maximized'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('unset_maximized'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_fullscreen'),
    signature: fastcall.makeStringBuffer('1?o'),
    types: new PointerArray([
      WlOutput.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('unset_fullscreen'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_minimized'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('configure'),
    signature: fastcall.makeStringBuffer('1iia'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('close'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  })])

namespace.XdgToplevel = XdgToplevel
namespace.xdg_toplevel = XdgToplevel
module.exports = XdgToplevel
