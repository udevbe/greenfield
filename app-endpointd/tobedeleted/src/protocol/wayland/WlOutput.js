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
 *      An output describes part of the compositor geometry.  The
 *      compositor works in the 'compositor coordinate system' and an
 *      output corresponds to a rectangular area in that space that is
 *      actually visible.  This typically corresponds to a monitor that
 *      displays part of the compositor space.  This object is published
 *      as global during start up, or when a monitor is hotplugged.
 *    
 */
class WlOutput extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlOutput(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	The geometry event describes geometric properties of the output.
   *	The event is sent when binding to the output object and whenever
   *	any of the properties change.
   *      
   *
   * @param {Number} x x position within the global compositor space
   * @param {Number} y y position within the global compositor space
   * @param {Number} physicalWidth width in millimeters of the output
   * @param {Number} physicalHeight height in millimeters of the output
   * @param {Number} subpixel subpixel orientation of the output
   * @param {string} make textual description of the manufacturer
   * @param {string} model textual description of the model
   * @param {Number} transform transform that maps framebuffer to output
   *
   * @since 1
   *
   */
  geometry (x, y, physicalWidth, physicalHeight, subpixel, make, model, transform) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._int(x), namespace._int(y), namespace._int(physicalWidth), namespace._int(physicalHeight), namespace._int(subpixel), namespace._string(make), namespace._string(model), namespace._int(transform)])
  }

  /**
   *
   *	The mode event describes an available mode for the output.
   *
   *	The event is sent when binding to the output object and there
   *	will always be one mode, the current mode.  The event is sent
   *	again if an output changes mode, for the mode that is now
   *	current.  In other words, the current mode is always the last
   *	mode that was received with the current flag set.
   *
   *	The size of a mode is given in physical hardware units of
   *	the output device. This is not necessarily the same as
   *	the output size in the global compositor space. For instance,
   *	the output may be scaled, as described in wl_output.scale,
   *	or transformed, as described in wl_output.transform.
   *      
   *
   * @param {Number} flags bitfield of mode flags
   * @param {Number} width width of the mode in hardware units
   * @param {Number} height height of the mode in hardware units
   * @param {Number} refresh vertical refresh rate in mHz
   *
   * @since 1
   *
   */
  mode (flags, width, height, refresh) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(flags), namespace._int(width), namespace._int(height), namespace._int(refresh)])
  }

  /**
   *
   *	This event is sent after all other properties have been
   *	sent after binding to the output object and after any
   *	other property changes done after that. This allows
   *	changes to the output properties to be seen as
   *	atomic, even if they happen via multiple events.
   *      
   * @since 2
   *
   */
  done () {
    native.interface.wl_resource_post_event_array(this.ptr, 2, [])
  }

  /**
   *
   *	This event contains scaling geometry information
   *	that is not in the geometry event. It may be sent after
   *	binding the output object or if the output scale changes
   *	later. If it is not sent, the client should assume a
   *	scale of 1.
   *
   *	A scale larger than 1 means that the compositor will
   *	automatically scale surface buffers by this amount
   *	when rendering. This is used for very high resolution
   *	displays where applications rendering at the native
   *	resolution would be too small to be legible.
   *
   *	It is intended that scaling aware clients track the
   *	current output of a surface, and if it is on a scaled
   *	output it should use wl_surface.set_buffer_scale with
   *	the scale of the output. That way the compositor can
   *	avoid scaling the surface, and the client can supply
   *	a higher detail image.
   *      
   *
   * @param {Number} factor scaling factor of output
   *
   * @since 2
   *
   */
  scale (factor) {
    native.interface.wl_resource_post_event_array(this.ptr, 3, [namespace._int(factor)])
  }
}

WlOutput.name = 'wl_output'

WlOutput.interface_ = Interface.create('wl_output', 3)
WlOutput.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('release'),
    signature: fastcall.makeStringBuffer('3'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('geometry'),
    signature: fastcall.makeStringBuffer('1iiiiissi'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('mode'),
    signature: fastcall.makeStringBuffer('1uiii'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('done'),
    signature: fastcall.makeStringBuffer('2'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('scale'),
    signature: fastcall.makeStringBuffer('2i'),
    types: new PointerArray([
      NULL
    ]).buffer
  })])

namespace.WlOutput = WlOutput
namespace.wl_output = WlOutput
module.exports = WlOutput
