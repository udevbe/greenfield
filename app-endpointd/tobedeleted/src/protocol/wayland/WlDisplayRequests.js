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


class WlDisplayRequests {
  constructor () {
    this[0] = this.sync
    this[1] = this.getRegistry
  }

  /**
   *
   *	The sync request asks the server to emit the 'done' event
   *	on the returned wl_callback object.  Since requests are
   *	handled in-order and events are delivered in-order, this can
   *	be used as a barrier to ensure all previous requests and the
   *	resulting events have been handled.
   *
   *	The object returned by this request will be destroyed by the
   *	compositor after the callback is fired and as such the client must not
   *	attempt to use it after that point.
   *
   *	The callback_data passed in the callback is the event serial.
   *      
   *
   * @param {WlDisplay} resource
   * @param {*} callback callback object for the sync request
   *
   * @since 1
   *
   */
  sync (resource, callback) {}
  /**
   *
   *	This request creates a registry object that allows the client
   *	to list and bind the global objects available from the
   *	compositor.
   *      
   *
   * @param {WlDisplay} resource
   * @param {*} registry global registry object
   *
   * @since 1
   *
   */
  getRegistry (resource, registry) {}
}

module.exports = WlDisplayRequests
