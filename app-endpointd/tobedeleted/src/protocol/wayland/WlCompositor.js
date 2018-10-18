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
const WlRegion = require('./WlRegion')

/**
 *
 *      A compositor.  This object is a singleton global.  The
 *      compositor is in charge of combining the contents of multiple
 *      surfaces into one displayable output.
 *    
 */
class WlCompositor extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlCompositor(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }
}

WlCompositor.name = 'wl_compositor'

WlCompositor.interface_ = Interface.create('wl_compositor', 4)
WlCompositor.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('create_surface'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlSurface.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('create_region'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlRegion.interface_.ptr
    ]).buffer
  })
], [
])

namespace.WlCompositor = WlCompositor
namespace.wl_compositor = WlCompositor
module.exports = WlCompositor
