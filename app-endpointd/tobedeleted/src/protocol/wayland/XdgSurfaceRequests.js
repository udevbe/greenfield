/*
 *
 *    Copyright © 2008-2013 Kristian Høgsberg
 *    Copyright © 2013      Rafael Antognolli
 *    Copyright © 2013      Jasper St. Pierre
 *    Copyright © 2010-2013 Intel Corporation
 *    Copyright © 2015-2017 Samsung Electronics Co., Ltd
 *    Copyright © 2015-2017 Red Hat Inc.
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice (including the next
 *    paragraph) shall be included in all copies or substantial portions of the
 *    Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 *  
 */

require('./XdgPositioner')

class XdgSurfaceRequests {
  constructor () {
    this[0] = this.destroy
    this[1] = this.getToplevel
    this[2] = this.getPopup
    this[3] = this.setWindowGeometry
    this[4] = this.ackConfigure
  }

  /**
   *
   *	Destroy the xdg_surface object. An xdg_surface must only be destroyed
   *	after its role object has been destroyed.
   *      
   *
   * @param {XdgSurface} resource
   *
   * @since 1
   *
   */
  destroy (resource) {}
  /**
   *
   *	This creates an xdg_toplevel object for the given xdg_surface and gives
   *	the associated wl_surface the xdg_toplevel role.
   *
   *	See the documentation of xdg_toplevel for more details about what an
   *	xdg_toplevel is and how it is used.
   *      
   *
   * @param {XdgSurface} resource
   * @param {*} id undefined
   *
   * @since 1
   *
   */
  getToplevel (resource, id) {}
  /**
   *
   *	This creates an xdg_popup object for the given xdg_surface and gives
   *	the associated wl_surface the xdg_popup role.
   *
   *	If null is passed as a parent, a parent surface must be specified using
   *	some other protocol, before committing the initial state.
   *
   *	See the documentation of xdg_popup for more details about what an
   *	xdg_popup is and how it is used.
   *      
   *
   * @param {XdgSurface} resource
   * @param {*} id undefined
   * @param {?*} parent undefined
   * @param {*} positioner undefined
   *
   * @since 1
   *
   */
  getPopup (resource, id, parent, positioner) {}
  /**
   *
   *	The window geometry of a surface is its "visible bounds" from the
   *	user's perspective. Client-side decorations often have invisible
   *	portions like drop-shadows which should be ignored for the
   *	purposes of aligning, placing and constraining windows.
   *
   *	The window geometry is double buffered, and will be applied at the
   *	time wl_surface.commit of the corresponding wl_surface is called.
   *
   *	When maintaining a position, the compositor should treat the (x, y)
   *	coordinate of the window geometry as the top left corner of the window.
   *	A client changing the (x, y) window geometry coordinate should in
   *	general not alter the position of the window.
   *
   *	Once the window geometry of the surface is set, it is not possible to
   *	unset it, and it will remain the same until set_window_geometry is
   *	called again, even if a new subsurface or buffer is attached.
   *
   *	If never set, the value is the full bounds of the surface,
   *	including any subsurfaces. This updates dynamically on every
   *	commit. This unset is meant for extremely simple clients.
   *
   *	The arguments are given in the surface-local coordinate space of
   *	the wl_surface associated with this xdg_surface.
   *
   *	The width and height must be greater than zero. Setting an invalid size
   *	will raise an error. When applied, the effective window geometry will be
   *	the set window geometry clamped to the bounding rectangle of the
   *	combined geometry of the surface of the xdg_surface and the associated
   *	subsurfaces.
   *      
   *
   * @param {XdgSurface} resource
   * @param {Number} x undefined
   * @param {Number} y undefined
   * @param {Number} width undefined
   * @param {Number} height undefined
   *
   * @since 1
   *
   */
  setWindowGeometry (resource, x, y, width, height) {}
  /**
   *
   *	When a configure event is received, if a client commits the
   *	surface in response to the configure event, then the client
   *	must make an ack_configure request sometime before the commit
   *	request, passing along the serial of the configure event.
   *
   *	For instance, for toplevel surfaces the compositor might use this
   *	information to move a surface to the top left only when the client has
   *	drawn itself for the maximized or fullscreen state.
   *
   *	If the client receives multiple configure events before it
   *	can respond to one, it only has to ack the last configure event.
   *
   *	A client is not required to commit immediately after sending
   *	an ack_configure request - it may even ack_configure several times
   *	before its next surface commit.
   *
   *	A client may send multiple ack_configure requests before committing, but
   *	only the last request sent before a commit indicates which configure
   *	event the client really is responding to.
   *      
   *
   * @param {XdgSurface} resource
   * @param {Number} serial the serial from the configure event
   *
   * @since 1
   *
   */
  ackConfigure (resource, serial) {}
}

module.exports = XdgSurfaceRequests
