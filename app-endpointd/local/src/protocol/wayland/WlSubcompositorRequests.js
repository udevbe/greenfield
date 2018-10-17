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

require('./WlSurface')

class WlSubcompositorRequests {
  constructor () {
    this[0] = this.destroy
    this[1] = this.getSubsurface
  }

  /**
   *
   *	Informs the server that the client will not be using this
   *	protocol object anymore. This does not affect any other
   *	objects, wl_subsurface objects included.
   *      
   *
   * @param {WlSubcompositor} resource
   *
   * @since 1
   *
   */
  destroy (resource) {}
  /**
   *
   *	Create a sub-surface interface for the given surface, and
   *	associate it with the given parent surface. This turns a
   *	plain wl_surface into a sub-surface.
   *
   *	The to-be sub-surface must not already have another role, and it
   *	must not have an existing wl_subsurface object. Otherwise a protocol
   *	error is raised.
   *      
   *
   * @param {WlSubcompositor} resource
   * @param {*} id the new sub-surface object ID
   * @param {*} surface the surface to be turned into a sub-surface
   * @param {*} parent the parent surface
   *
   * @since 1
   *
   */
  getSubsurface (resource, id, surface, parent) {}
}

module.exports = WlSubcompositorRequests
