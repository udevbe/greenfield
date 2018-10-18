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
const WlDataSource = require('./WlDataSource')
const WlDataDevice = require('./WlDataDevice')
const WlSeat = require('./WlSeat')

/**
 *
 *      The wl_data_device_manager is a singleton global object that
 *      provides access to inter-client data transfer mechanisms such as
 *      copy-and-paste and drag-and-drop.  These mechanisms are tied to
 *      a wl_seat and this interface lets a client get a wl_data_device
 *      corresponding to a wl_seat.
 *
 *      Depending on the version bound, the objects created from the bound
 *      wl_data_device_manager object will have different requirements for
 *      functioning properly. See wl_data_source.set_actions,
 *      wl_data_offer.accept and wl_data_offer.finish for details.
 *    
 */
class WlDataDeviceManager extends Resource {
  static create (client, version, id, implementation, destroyFunc) {
    const resourcePtr = native.interface.wl_resource_create(client.ptr, this.interface_.ptr, version, id)
    const resource = new WlDataDeviceManager(resourcePtr)
    resource.setDispatcher(implementation, destroyFunc)
    return resource
  }

  constructor (ptr) {
    super(ptr)
  }
}

WlDataDeviceManager.name = 'wl_data_device_manager'

WlDataDeviceManager.interface_ = Interface.create('wl_data_device_manager', 3)
WlDataDeviceManager.interface_.init([
  new WlMessage({
    name: fastcall.makeStringBuffer('create_data_source'),
    signature: fastcall.makeStringBuffer('1n'),
    types: new PointerArray([
      WlDataSource.interface_.ptr
    ]).buffer
  }),
  new WlMessage({
    name: fastcall.makeStringBuffer('get_data_device'),
    signature: fastcall.makeStringBuffer('1no'),
    types: new PointerArray([
      WlDataDevice.interface_.ptr,
      WlSeat.interface_.ptr
    ]).buffer
  })
], [
])

namespace.WlDataDeviceManager = WlDataDeviceManager
namespace.wl_data_device_manager = WlDataDeviceManager
module.exports = WlDataDeviceManager
