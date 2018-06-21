'use strict'

const XdgPositionerRequests = require('./protocol/wayland/XdgPositionerRequests')

module.exports = class ShimXdgPositioner extends XdgPositionerRequests {
  /**
   * @param {XdgPositioner}xdgPositionerProxy
   * @return {ShimXdgPositioner}
   */
  static create (xdgPositionerProxy) {
    return new ShimXdgPositioner(xdgPositionerProxy)
  }

  /**
   * @param {XdgPositioner}xdgPositionerProxy
   * @private
   */
  constructor (xdgPositionerProxy) {
    super()
    /**
     * @type {XdgPositioner}
     */
    this.proxy = xdgPositionerProxy
  }

  /**
   *
   *  Notify the compositor that the xdg_positioner will no longer be used.
   *
   *
   * @param {XdgPositioner} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    this.proxy.destroy()
    resource.destroy()
  }

  /**
   *
   *  Set the size of the surface that is to be positioned with the positioner
   *  object. The size is in surface-local coordinates and corresponds to the
   *  window geometry. See xdg_surface.set_window_geometry.
   *
   *  If a zero or negative size is set the invalid_input error is raised.
   *
   *
   * @param {XdgPositioner} resource
   * @param {Number} width width of positioned rectangle
   * @param {Number} height height of positioned rectangle
   *
   * @since 1
   *
   */
  setSize (resource, width, height) {
    this.proxy.setSize(width, height)
  }

  /**
   *
   *  Specify the anchor rectangle within the parent surface that the child
   *  surface will be placed relative to. The rectangle is relative to the
   *  window geometry as defined by xdg_surface.set_window_geometry of the
   *  parent surface.
   *
   *  When the xdg_positioner object is used to position a child surface, the
   *  anchor rectangle may not extend outside the window geometry of the
   *  positioned child's parent surface.
   *
   *  If a negative size is set the invalid_input error is raised.
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
  setAnchorRect (resource, x, y, width, height) {
    this.proxy.setAnchorRect(x, y, width, height)
  }

  /**
   *
   *  Defines the anchor point for the anchor rectangle. The specified anchor
   *  is used derive an anchor point that the child surface will be
   *  positioned relative to. If a corner anchor is set (e.g. 'top_left' or
   *  'bottom_right'), the anchor point will be at the specified corner;
   *  otherwise, the derived anchor point will be centered on the specified
   *  edge, or in the center of the anchor rectangle if no edge is specified.
   *
   *
   * @param {XdgPositioner} resource
   * @param {Number} anchor anchor
   *
   * @since 1
   *
   */
  setAnchor (resource, anchor) {
    this.proxy.setAnchor(anchor)
  }

  /**
   *
   *  Defines in what direction a surface should be positioned, relative to
   *  the anchor point of the parent surface. If a corner gravity is
   *  specified (e.g. 'bottom_right' or 'top_left'), then the child surface
   *  will be placed towards the specified gravity; otherwise, the child
   *  surface will be centered over the anchor point on any axis that had no
   *  gravity specified.
   *
   *
   * @param {XdgPositioner} resource
   * @param {Number} gravity gravity direction
   *
   * @since 1
   *
   */
  setGravity (resource, gravity) {
    this.proxy.setGravity(gravity)
  }

  /**
   *
   *  Specify how the window should be positioned if the originally intended
   *  position caused the surface to be constrained, meaning at least
   *  partially outside positioning boundaries set by the compositor. The
   *  adjustment is set by constructing a bitmask describing the adjustment to
   *  be made when the surface is constrained on that axis.
   *
   *  If no bit for one axis is set, the compositor will assume that the child
   *  surface should not change its position on that axis when constrained.
   *
   *  If more than one bit for one axis is set, the order of how adjustments
   *  are applied is specified in the corresponding adjustment descriptions.
   *
   *  The default adjustment is none.
   *
   *
   * @param {XdgPositioner} resource
   * @param {Number} constraintAdjustment bit mask of constraint adjustments
   *
   * @since 1
   *
   */
  setConstraintAdjustment (resource, constraintAdjustment) {
    this.proxy.setConstraintAdjustment(constraintAdjustment)
  }

  /**
   *
   *  Specify the surface position offset relative to the position of the
   *  anchor on the anchor rectangle and the anchor on the surface. For
   *  example if the anchor of the anchor rectangle is at (x, y), the surface
   *  has the gravity bottom|right, and the offset is (ox, oy), the calculated
   *  surface position will be (x + ox, y + oy). The offset position of the
   *  surface is the one used for constraint testing. See
   *  set_constraint_adjustment.
   *
   *  An example use case is placing a popup menu on top of a user interface
   *  element, while aligning the user interface element of the parent surface
   *  with some user interface element placed somewhere in the popup surface.
   *
   *
   * @param {XdgPositioner} resource
   * @param {Number} x surface position x offset
   * @param {Number} y surface position y offset
   *
   * @since 1
   *
   */
  setOffset (resource, x, y) {
    this.proxy.setOffset(x, y)
  }
}
