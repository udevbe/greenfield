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

/**
 *
 *      The wl_shm_pool object encapsulates a piece of memory shared
 *      between the compositor and client.  Through the wl_shm_pool
 *      object, the client can allocate shared memory wl_buffer objects.
 *      All objects created through the same pool share the same
 *      underlying mapped memory. Reusing the mapped memory avoids the
 *      setup/teardown overhead and is useful when interactively resizing
 *      a surface or for many small buffers.
 *    
 */
class WlShmPool extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlShmPool(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }
}

WlShmPool.name = 'wl_shm_pool'

WlShmPool.interface_ = Interface.create('wl_shm_pool', 1)
WlShmPool.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('create_buffer'),
    signature: fastcall.makeStringBuffer('1niiiiu'),
    types: new PointerArray([
      WlBuffer.interface_.ptr,
      NULL,
      NULL,
      NULL,
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
    name: fastcall.makeStringBuffer('resize'),
    signature: fastcall.makeStringBuffer('1i'),
    types: new PointerArray([
      NULL
    ]).buffer
  })
], [
])

namespace.WlShmPool = WlShmPool
namespace.wl_shm_pool = WlShmPool
module.exports = WlShmPool
