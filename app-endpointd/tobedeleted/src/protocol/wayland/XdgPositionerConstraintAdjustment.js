const namespace = require('wayland-server-bindings-runtime').namespace

const XdgPositioner_ConstraintAdjustment = {
  /**
   * undefined
   */
  none: 0,
  /**
   * undefined
   */
  slideX: 1,
  /**
   * undefined
   */
  slideY: 2,
  /**
   * undefined
   */
  flipX: 4,
  /**
   * undefined
   */
  flipY: 8,
  /**
   * undefined
   */
  resizeX: 16,
  /**
   * undefined
   */
  resizeY: 32
}

namespace.XdgPositioner_ConstraintAdjustment = XdgPositioner_ConstraintAdjustment
module.exports = XdgPositioner_ConstraintAdjustment
