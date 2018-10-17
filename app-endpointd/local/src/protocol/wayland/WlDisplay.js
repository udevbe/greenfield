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
const WlCallback = require('./WlCallback')
const WlRegistry = require('./WlRegistry')

/**
 *
 *      The core global object.  This is a special singleton object.  It
 *      is used for internal Wayland protocol features.
 *    
 */
class WlDisplay extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlDisplay(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	The error event is sent out when a fatal (non-recoverable)
   *	error has occurred.  The object_id argument is the object
   *	where the error occurred, most often in response to a request
   *	to that object.  The code identifies the error and is defined
   *	by the object interface.  As such, each interface defines its
   *	own set of error codes.  The message is a brief description
   *	of the error, for (debugging) convenience.
   *      
   *
   * @param {*} objectId object where the error occurred
   * @param {Number} code error code
   * @param {string} message error description
   *
   * @since 1
   *
   */
  error (objectId, code, message) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._object(objectId), namespace._uint(code), namespace._string(message)])
  }

  /**
   *
   *	This event is used internally by the object ID management
   *	logic.  When a client deletes an object, the server will send
   *	this event to acknowledge that it has seen the delete request.
   *	When the client receives this event, it will know that it can
   *	safely reuse the object ID.
   *      
   *
   * @param {Number} id deleted object ID
   *
   * @since 1
   *
   */
  deleteId (id) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(id)])
  }
}

WlDisplay.name = 'wl_display'

WlDisplay.interface_ = Interface.create('wl_display', 1)
WlDisplay.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('sync'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlCallback.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('get_registry'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlRegistry.interface_.ptr
    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('error'),
    signature: fastcall.makeStringBuffer('1ous'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('delete_id'),
    signature: fastcall.makeStringBuffer('1u'),
    types: new PointerArray([
      NULL
    ]).buffer
  })])

namespace.WlDisplay = WlDisplay
namespace.wl_display = WlDisplay
module.exports = WlDisplay
