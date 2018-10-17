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
 *      The singleton global registry object.  The server has a number of
 *      global objects that are available to all clients.  These objects
 *      typically represent an actual object in the server (for example,
 *      an input device) or they are singleton objects that provide
 *      extension functionality.
 *
 *      When a client creates a registry object, the registry object
 *      will emit a global event for each global currently in the
 *      registry.  Globals come and go as a result of device or
 *      monitor hotplugs, reconfiguration or other events, and the
 *      registry will send out global and global_remove events to
 *      keep the client up to date with the changes.  To mark the end
 *      of the initial burst of events, the client can use the
 *      wl_display.sync request immediately after calling
 *      wl_display.get_registry.
 *
 *      A client can bind to a global object by using the bind
 *      request.  This creates a client-side handle that lets the object
 *      emit events to the client and lets the client invoke requests on
 *      the object.
 *    
 */
class WlRegistry extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlRegistry(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }

  /**
   *
   *	Notify the client of global objects.
   *
   *	The event notifies the client that a global object with
   *	the given name is now available, and it implements the
   *	given version of the given interface.
   *      
   *
   * @param {Number} name numeric name of the global object
   * @param {string} interface interface implemented by the object
   * @param {Number} version interface version
   *
   * @since 1
   *
   */
  global (name, interface, version) {
    native.interface.wl_resource_post_event_array(this.ptr, 0, [namespace._uint(name), namespace._string(interface), namespace._uint(version)])
  }

  /**
   *
   *	Notify the client of removed global objects.
   *
   *	This event notifies the client that the global identified
   *	by name is no longer available.  If the client bound to
   *	the global using the bind request, the client should now
   *	destroy that object.
   *
   *	The object remains valid and requests to the object will be
   *	ignored until the client destroys it, to avoid races between
   *	the global going away and a client sending a request to it.
   *      
   *
   * @param {Number} name numeric name of the global object
   *
   * @since 1
   *
   */
  globalRemove (name) {
    native.interface.wl_resource_post_event_array(this.ptr, 1, [namespace._uint(name)])
  }
}

WlRegistry.name = 'wl_registry'

WlRegistry.interface_ = Interface.create('wl_registry', 1)
WlRegistry.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('bind'),
    signature: fastcall.makeStringBuffer('1un'),
    types: new PointerArray([
      NULL,
      NULL
    ]).buffer
  })
], [
  new WlMessage({
    name: fastcall.makeStringBuffer('global'),
    signature: fastcall.makeStringBuffer('1usu'),
    types: new PointerArray([
      NULL,
      NULL,
      NULL
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('global_remove'),
    signature: fastcall.makeStringBuffer('1u'),
    types: new PointerArray([
      NULL
    ]).buffer
  })])

namespace.WlRegistry = WlRegistry
namespace.wl_registry = WlRegistry
module.exports = WlRegistry
