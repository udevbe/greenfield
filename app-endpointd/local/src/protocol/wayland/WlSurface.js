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
const WlBuffer = require('./WlBuffer')
const WlCallback = require('./WlCallback')
const WlRegion = require('./WlRegion')
const WlOutput = require('./WlOutput')

/**
 *
 *      A surface is a rectangular area that is displayed on the screen.
 *      It has a location, size and pixel contents.
 *
 *      The size of a surface (and relative positions on it) is described
 *      in surface-local coordinates, which may differ from the buffer
 *      coordinates of the pixel content, in case a buffer_transform
 *      or a buffer_scale is used.
 *
 *      A surface without a "role" is fairly useless: a compositor does
 *      not know where, when or how to present it. The role is the
 *      purpose of a wl_surface. Examples of roles are a cursor for a
 *      pointer (as set by wl_pointer.set_cursor), a drag icon
 *      (wl_data_device.start_drag), a sub-surface
 *      (wl_subcompositor.get_subsurface), and a window as defined by a
 *      shell protocol (e.g. wl_shell.get_shell_surface).
 *
 *      A surface can have only one role at a time. Initially a
 *      wl_surface does not have a role. Once a wl_surface is given a
 *      role, it is set permanently for the whole lifetime of the
 *      wl_surface object. Giving the current role again is allowed,
 *      unless explicitly forbidden by the relevant interface
 *      specification.
 *
 *      Surface roles are given by requests in other interfaces such as
 *      wl_pointer.set_cursor. The request should explicitly mention
 *      that this request gives a role to a wl_surface. Often, this
 *      request also creates a new protocol object that represents the
 *      role and adds additional functionality to wl_surface. When a
 *      client wants to destroy a wl_surface, they must destroy this 'role
 *      object' before the wl_surface.
 *
 *      Destroying the role object does not remove the role from the
 *      wl_surface, but it may stop the wl_surface from "playing the role".
 *      For instance, if a wl_subsurface object is destroyed, the wl_surface
 *      it was created for will be unmapped and forget its position and
 *      z-order. It is allowed to create a wl_subsurface for the same
 *      wl_surface again, but it is not allowed to use the wl_surface as
 *      a cursor (cursor is a different role than sub-surface, and role
 *      switching is not allowed).
 *    
 */
class WlSurface extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlSurface(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	This is emitted whenever a surface's creation, movement, or resizing
   *	results in some part of it being within the scanout region of an
   *	output.
   *
   *	Note that a surface may be overlapping with zero or more outputs.
   *      
   *
   * @param {*} output output entered by the surface
   *
   * @since 1
   *
   */
  enter (output) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._object(output)])
  }

  /**
   *
   *	This is emitted whenever a surface's creation, movement, or resizing
   *	results in it no longer having any part of it within the scanout region
   *	of an output.
   *      
   *
   * @param {*} output output left by the surface
   *
   * @since 1
   *
   */
  leave (output) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._object(output)])
  }
}

WlSurface.name = 'wl_surface'

WlSurface.interface_ = Interface.create('wl_surface', 4)
WlSurface.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('destroy'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('attach'),
    signature: fastcall.makeStringBuffer('1?oii'),
    types: new PointerArray([
      WlBuffer.interface_.ptr,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('damage'),
    signature: fastcall.makeStringBuffer('1iiii'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('frame'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlCallback.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_opaque_region'),
    signature: fastcall.makeStringBuffer('1?o'),
    types: new PointerArray([
      WlRegion.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_input_region'),
    signature: fastcall.makeStringBuffer('1?o'),
    types: new PointerArray([
      WlRegion.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('commit'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_buffer_transform'),
    signature: fastcall.makeStringBuffer('2i'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('set_buffer_scale'),
    signature: fastcall.makeStringBuffer('3i'),
    types: new PointerArray([
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('damage_buffer'),
    signature: fastcall.makeStringBuffer('4iiii'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL,
      NULL
    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('enter'),
    signature: fastcall.makeStringBuffer('1o'),
    types: new PointerArray([
      WlOutput.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('leave'),
    signature: fastcall.makeStringBuffer('1o'),
    types: new PointerArray([
      WlOutput.interface_.ptr
    ]).buffer
  })])

namespace.WlSurface = WlSurface
namespace.wl_surface = WlSurface
module.exports = WlSurface
