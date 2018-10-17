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

require('./WlDataSource')
require('./WlSurface')

class WlDataDeviceRequests {
  constructor () {
    this[0] = this.startDrag
    this[1] = this.setSelection
    this[2] = this.release
  }

  /**
   *
   *	This request asks the compositor to start a drag-and-drop
   *	operation on behalf of the client.
   *
   *	The source argument is the data source that provides the data
   *	for the eventual data transfer. If source is NULL, enter, leave
   *	and motion events are sent only to the client that initiated the
   *	drag and the client is expected to handle the data passing
   *	internally.
   *
   *	The origin surface is the surface where the drag originates and
   *	the client must have an active implicit grab that matches the
   *	serial.
   *
   *	The icon surface is an optional (can be NULL) surface that
   *	provides an icon to be moved around with the cursor.  Initially,
   *	the top-left corner of the icon surface is placed at the cursor
   *	hotspot, but subsequent wl_surface.attach request can move the
   *	relative position. Attach requests must be confirmed with
   *	wl_surface.commit as usual. The icon surface is given the role of
   *	a drag-and-drop icon. If the icon surface already has another role,
   *	it raises a protocol error.
   *
   *	The current and pending input regions of the icon wl_surface are
   *	cleared, and wl_surface.set_input_region is ignored until the
   *	wl_surface is no longer used as the icon surface. When the use
   *	as an icon ends, the current and pending input regions become
   *	undefined, and the wl_surface is unmapped.
   *      
   *
   * @param {WlDataDevice} resource
   * @param {?*} source data source for the eventual transfer
   * @param {*} origin surface where the drag originates
   * @param {?*} icon drag-and-drop icon surface
   * @param {Number} serial serial number of the implicit grab on the origin
   *
   * @since 1
   *
   */
  startDrag (resource, source, origin, icon, serial) {}
  /**
   *
   *	This request asks the compositor to set the selection
   *	to the data from the source on behalf of the client.
   *
   *	To unset the selection, set the source to NULL.
   *      
   *
   * @param {WlDataDevice} resource
   * @param {?*} source data source for the selection
   * @param {Number} serial serial number of the event that triggered this request
   *
   * @since 1
   *
   */
  setSelection (resource, source, serial) {}
  /**
   *
   *	This request destroys the data device.
   *      
   *
   * @param {WlDataDevice} resource
   *
   * @since 2
   *
   */
  release (resource) {}
}

module.exports = WlDataDeviceRequests
