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

require('./WlSurface')

class XdgWmBaseRequests {
  constructor () {
    this[0] = this.destroy
    this[1] = this.createPositioner
    this[2] = this.getXdgSurface
    this[3] = this.pong
  }

  /**
   *
   *	Destroy this xdg_wm_base object.
   *
   *	Destroying a bound xdg_wm_base object while there are surfaces
   *	still alive created by this xdg_wm_base object instance is illegal
   *	and will result in a protocol error.
   *      
   *
   * @param {XdgWmBase} resource
   *
   * @since 1
   *
   */
  destroy (resource) {}
  /**
   *
   *	Create a positioner object. A positioner object is used to position
   *	surfaces relative to some parent surface. See the interface description
   *	and xdg_surface.get_popup for details.
   *      
   *
   * @param {XdgWmBase} resource
   * @param {*} id undefined
   *
   * @since 1
   *
   */
  createPositioner (resource, id) {}
  /**
   *
   *	This creates an xdg_surface for the given surface. While xdg_surface
   *	itself is not a role, the corresponding surface may only be assigned
   *	a role extending xdg_surface, such as xdg_toplevel or xdg_popup.
   *
   *	This creates an xdg_surface for the given surface. An xdg_surface is
   *	used as basis to define a role to a given surface, such as xdg_toplevel
   *	or xdg_popup. It also manages functionality shared between xdg_surface
   *	based surface roles.
   *
   *	See the documentation of xdg_surface for more details about what an
   *	xdg_surface is and how it is used.
   *      
   *
   * @param {XdgWmBase} resource
   * @param {*} id undefined
   * @param {*} surface undefined
   *
   * @since 1
   *
   */
  getXdgSurface (resource, id, surface) {}
  /**
   *
   *	A client must respond to a ping event with a pong request or
   *	the client may be deemed unresponsive. See xdg_wm_base.ping.
   *      
   *
   * @param {XdgWmBase} resource
   * @param {Number} serial serial of the ping event
   *
   * @since 1
   *
   */
  pong (resource, serial) {}
}

module.exports = XdgWmBaseRequests
