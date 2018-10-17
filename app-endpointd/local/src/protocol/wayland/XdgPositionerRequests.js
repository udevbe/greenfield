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


class XdgPositionerRequests {
  constructor () {
    this[0] = this.destroy
    this[1] = this.setSize
    this[2] = this.setAnchorRect
    this[3] = this.setAnchor
    this[4] = this.setGravity
    this[5] = this.setConstraintAdjustment
    this[6] = this.setOffset
  }

  /**
   *
   *	Notify the compositor that the xdg_positioner will no longer be used.
   *      
   *
   * @param {XdgPositioner} resource
   *
   * @since 1
   *
   */
  destroy (resource) {}
  /**
   *
   *	Set the size of the surface that is to be positioned with the positioner
   *	object. The size is in surface-local coordinates and corresponds to the
   *	window geometry. See xdg_surface.set_window_geometry.
   *
   *	If a zero or negative size is set the invalid_input error is raised.
   *      
   *
   * @param {XdgPositioner} resource
   * @param {Number} width width of positioned rectangle
   * @param {Number} height height of positioned rectangle
   *
   * @since 1
   *
   */
  setSize (resource, width, height) {}
  /**
   *
   *	Specify the anchor rectangle within the parent surface that the child
   *	surface will be placed relative to. The rectangle is relative to the
   *	window geometry as defined by xdg_surface.set_window_geometry of the
   *	parent surface.
   *
   *	When the xdg_positioner object is used to position a child surface, the
   *	anchor rectangle may not extend outside the window geometry of the
   *	positioned child's parent surface.
   *
   *	If a negative size is set the invalid_input error is raised.
   *      
   *
   * @param {XdgPositioner} resource
   * @param {Number} x x position of anchor rectangle
   * @param {Number} y y position of anchor rectangle
   * @param {Number} width width of anchor rectangle
   * @param {Number} height height of anchor rectangle
   *
   * @since 1
   *
   */
  setAnchorRect (resource, x, y, width, height) {}
  /**
   *
   *	Defines the anchor point for the anchor rectangle. The specified anchor
   *	is used derive an anchor point that the child surface will be
   *	positioned relative to. If a corner anchor is set (e.g. 'top_left' or
   *	'bottom_right'), the anchor point will be at the specified corner;
   *	otherwise, the derived anchor point will be centered on the specified
   *	edge, or in the center of the anchor rectangle if no edge is specified.
   *      
   *
   * @param {XdgPositioner} resource
   * @param {Number} anchor anchor
   *
   * @since 1
   *
   */
  setAnchor (resource, anchor) {}
  /**
   *
   *	Defines in what direction a surface should be positioned, relative to
   *	the anchor point of the parent surface. If a corner gravity is
   *	specified (e.g. 'bottom_right' or 'top_left'), then the child surface
   *	will be placed towards the specified gravity; otherwise, the child
   *	surface will be centered over the anchor point on any axis that had no
   *	gravity specified.
   *      
   *
   * @param {XdgPositioner} resource
   * @param {Number} gravity gravity direction
   *
   * @since 1
   *
   */
  setGravity (resource, gravity) {}
  /**
   *
   *	Specify how the window should be positioned if the originally intended
   *	position caused the surface to be constrained, meaning at least
   *	partially outside positioning boundaries set by the compositor. The
   *	adjustment is set by constructing a bitmask describing the adjustment to
   *	be made when the surface is constrained on that axis.
   *
   *	If no bit for one axis is set, the compositor will assume that the child
   *	surface should not change its position on that axis when constrained.
   *
   *	If more than one bit for one axis is set, the order of how adjustments
   *	are applied is specified in the corresponding adjustment descriptions.
   *
   *	The default adjustment is none.
   *      
   *
   * @param {XdgPositioner} resource
   * @param {Number} constraintAdjustment bit mask of constraint adjustments
   *
   * @since 1
   *
   */
  setConstraintAdjustment (resource, constraintAdjustment) {}
  /**
   *
   *	Specify the surface position offset relative to the position of the
   *	anchor on the anchor rectangle and the anchor on the surface. For
   *	example if the anchor of the anchor rectangle is at (x, y), the surface
   *	has the gravity bottom|right, and the offset is (ox, oy), the calculated
   *	surface position will be (x + ox, y + oy). The offset position of the
   *	surface is the one used for constraint testing. See
   *	set_constraint_adjustment.
   *
   *	An example use case is placing a popup menu on top of a user interface
   *	element, while aligning the user interface element of the parent surface
   *	with some user interface element placed somewhere in the popup surface.
   *      
   *
   * @param {XdgPositioner} resource
   * @param {Number} x surface position x offset
   * @param {Number} y surface position y offset
   *
   * @since 1
   *
   */
  setOffset (resource, x, y) {}
}

module.exports = XdgPositionerRequests
