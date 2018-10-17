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
const WlSubsurface = require('./WlSubsurface')
const WlSurface = require('./WlSurface')

/**
 *
 *      The global interface exposing sub-surface compositing capabilities.
 *      A wl_surface, that has sub-surfaces associated, is called the
 *      parent surface. Sub-surfaces can be arbitrarily nested and create
 *      a tree of sub-surfaces.
 *
 *      The root surface in a tree of sub-surfaces is the main
 *      surface. The main surface cannot be a sub-surface, because
 *      sub-surfaces must always have a parent.
 *
 *      A main surface with its sub-surfaces forms a (compound) window.
 *      For window management purposes, this set of wl_surface objects is
 *      to be considered as a single window, and it should also behave as
 *      such.
 *
 *      The aim of sub-surfaces is to offload some of the compositing work
 *      within a window from clients to the compositor. A prime example is
 *      a video player with decorations and video in separate wl_surface
 *      objects. This should allow the compositor to pass YUV video buffer
 *      processing to dedicated overlay hardware when possible.
 *    
 */
class WlSubcompositor extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlSubcompositor(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }
}

WlSubcompositor.name = 'wl_subcompositor'

WlSubcompositor.interface_ = Interface.create('wl_subcompositor', 1)
WlSubcompositor.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('destroy'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('get_subsurface'),
    signature: fastcall.makeStringBuffer('1noo'),
    types: new PointerArray([
      WlSubsurface.interface_.ptr,
      WlSurface.interface_.ptr,
      WlSurface.interface_.ptr
    ]).buffer
  })
], [
])

namespace.WlSubcompositor = WlSubcompositor
namespace.wl_subcompositor = WlSubcompositor
module.exports = WlSubcompositor
