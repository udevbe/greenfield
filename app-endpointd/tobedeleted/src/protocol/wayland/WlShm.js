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
const WlShmPool = require('./WlShmPool')

/**
 *
 *      A singleton global object that provides support for shared
 *      memory.
 *
 *      Clients can create wl_shm_pool objects using the create_pool
 *      request.
 *
 *      At connection setup time, the wl_shm object emits one or more
 *      format events to inform clients about the valid pixel formats
 *      that can be used for buffers.
 *    
 */
class WlShm extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlShm(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	Informs the client about a valid pixel format that
   *	can be used for buffers. Known formats include
   *	argb8888 and xrgb8888.
   *      
   *
   * @param {Number} format buffer pixel format
   *
   * @since 1
   *
   */
  format (format) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._uint(format)])
  }
}

WlShm.name = 'wl_shm'

WlShm.interface_ = Interface.create('wl_shm', 1)
WlShm.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('create_pool'),
    signature: fastcall.makeStringBuffer('1nhi'),
    types: new PointerArray([
      WlShmPool.interface_.ptr,
      NULL,
      NULL
    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('format'),
    signature: fastcall.makeStringBuffer('1u'),
    types: new PointerArray([
      NULL
    ]).buffer
  })])

namespace.WlShm = WlShm
namespace.wl_shm = WlShm
module.exports = WlShm
