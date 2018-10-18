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
 *      A buffer provides the content for a wl_surface. Buffers are
 *      created through factory interfaces such as wl_drm, wl_shm or
 *      similar. It has a width and a height and can be attached to a
 *      wl_surface, but the mechanism by which a client provides and
 *      updates the contents is defined by the buffer factory interface.
 *    
 */
class WlBuffer extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlBuffer(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	Sent when this wl_buffer is no longer used by the compositor.
   *	The client is now free to reuse or destroy this buffer and its
   *	backing storage.
   *
   *	If a client receives a release event before the frame callback
   *	requested in the same wl_surface.commit that attaches this
   *	wl_buffer to a surface, then the client is immediately free to
   *	reuse the buffer and its backing storage, and does not need a
   *	second buffer for the next surface content update. Typically
   *	this is possible, when the compositor maintains a copy of the
   *	wl_surface contents, e.g. as a GL texture. This is an important
   *	optimization for GL(ES) compositors with wl_shm clients.
   *      
   * @since 1
   *
   */
  release () {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [])
  }
}

WlBuffer.name = 'wl_buffer'

WlBuffer.interface_ = Interface.create('wl_buffer', 1)
WlBuffer.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('destroy'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('release'),
    signature: fastcall.makeStringBuffer('1'),
    types: new PointerArray([

    ]).buffer
  })])

namespace.WlBuffer = WlBuffer
namespace.wl_buffer = WlBuffer
module.exports = WlBuffer
