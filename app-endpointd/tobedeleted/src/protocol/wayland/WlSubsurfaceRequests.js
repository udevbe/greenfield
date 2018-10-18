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

class WlSubsurfaceRequests {
  constructor () {
    this[0] = this.destroy
    this[1] = this.setPosition
    this[2] = this.placeAbove
    this[3] = this.placeBelow
    this[4] = this.setSync
    this[5] = this.setDesync
  }

  /**
   *
   *	The sub-surface interface is removed from the wl_surface object
   *	that was turned into a sub-surface with a
   *	wl_subcompositor.get_subsurface request. The wl_surface's association
   *	to the parent is deleted, and the wl_surface loses its role as
   *	a sub-surface. The wl_surface is unmapped.
   *      
   *
   * @param {WlSubsurface} resource
   *
   * @since 1
   *
   */
  destroy (resource) {}
  /**
   *
   *	This schedules a sub-surface position change.
   *	The sub-surface will be moved so that its origin (top left
   *	corner pixel) will be at the location x, y of the parent surface
   *	coordinate system. The coordinates are not restricted to the parent
   *	surface area. Negative values are allowed.
   *
   *	The scheduled coordinates will take effect whenever the state of the
   *	parent surface is applied. When this happens depends on whether the
   *	parent surface is in synchronized mode or not. See
   *	wl_subsurface.set_sync and wl_subsurface.set_desync for details.
   *
   *	If more than one set_position request is invoked by the client before
   *	the commit of the parent surface, the position of a new request always
   *	replaces the scheduled position from any previous request.
   *
   *	The initial position is 0, 0.
   *      
   *
   * @param {WlSubsurface} resource
   * @param {Number} x x coordinate in the parent surface
   * @param {Number} y y coordinate in the parent surface
   *
   * @since 1
   *
   */
  setPosition (resource, x, y) {}
  /**
   *
   *	This sub-surface is taken from the stack, and put back just
   *	above the reference surface, changing the z-order of the sub-surfaces.
   *	The reference surface must be one of the sibling surfaces, or the
   *	parent surface. Using any other surface, including this sub-surface,
   *	will cause a protocol error.
   *
   *	The z-order is double-buffered. Requests are handled in order and
   *	applied immediately to a pending state. The final pending state is
   *	copied to the active state the next time the state of the parent
   *	surface is applied. When this happens depends on whether the parent
   *	surface is in synchronized mode or not. See wl_subsurface.set_sync and
   *	wl_subsurface.set_desync for details.
   *
   *	A new sub-surface is initially added as the top-most in the stack
   *	of its siblings and parent.
   *      
   *
   * @param {WlSubsurface} resource
   * @param {*} sibling the reference surface
   *
   * @since 1
   *
   */
  placeAbove (resource, sibling) {}
  /**
   *
   *	The sub-surface is placed just below the reference surface.
   *	See wl_subsurface.place_above.
   *      
   *
   * @param {WlSubsurface} resource
   * @param {*} sibling the reference surface
   *
   * @since 1
   *
   */
  placeBelow (resource, sibling) {}
  /**
   *
   *	Change the commit behaviour of the sub-surface to synchronized
   *	mode, also described as the parent dependent mode.
   *
   *	In synchronized mode, wl_surface.commit on a sub-surface will
   *	accumulate the committed state in a cache, but the state will
   *	not be applied and hence will not change the compositor output.
   *	The cached state is applied to the sub-surface immediately after
   *	the parent surface's state is applied. This ensures atomic
   *	updates of the parent and all its synchronized sub-surfaces.
   *	Applying the cached state will invalidate the cache, so further
   *	parent surface commits do not (re-)apply old state.
   *
   *	See wl_subsurface for the recursive effect of this mode.
   *      
   *
   * @param {WlSubsurface} resource
   *
   * @since 1
   *
   */
  setSync (resource) {}
  /**
   *
   *	Change the commit behaviour of the sub-surface to desynchronized
   *	mode, also described as independent or freely running mode.
   *
   *	In desynchronized mode, wl_surface.commit on a sub-surface will
   *	apply the pending state directly, without caching, as happens
   *	normally with a wl_surface. Calling wl_surface.commit on the
   *	parent surface has no effect on the sub-surface's wl_surface
   *	state. This mode allows a sub-surface to be updated on its own.
   *
   *	If cached state exists when wl_surface.commit is called in
   *	desynchronized mode, the pending state is added to the cached
   *	state, and applied as a whole. This invalidates the cache.
   *
   *	Note: even if a sub-surface is set to desynchronized, a parent
   *	sub-surface may override it to behave as synchronized. For details,
   *	see wl_subsurface.
   *
   *	If a surface's parent surface behaves as desynchronized, then
   *	the cached state is applied on set_desync.
   *      
   *
   * @param {WlSubsurface} resource
   *
   * @since 1
   *
   */
  setDesync (resource) {}
}

module.exports = WlSubsurfaceRequests
