const namespace = require('wayland-server-bindings-runtime').namespace

const WlOutput_Transform = {
  /**
   * no transform
   */
  normal: 0,
  /**
   * 90 degrees counter-clockwise
   */
  90: 1,
  /**
   * 180 degrees counter-clockwise
   */
  180: 2,
  /**
   * 270 degrees counter-clockwise
   */
  270: 3,
  /**
   * 180 degree flip around a vertical axis
   */
  flipped: 4,
  /**
   * flip and rotate 90 degrees counter-clockwise
   */
  flipped90: 5,
  /**
   * flip and rotate 180 degrees counter-clockwise
   */
  flipped180: 6,
  /**
   * flip and rotate 270 degrees counter-clockwise
   */
  flipped270: 7
}

namespace.WlOutput_Transform = WlOutput_Transform
module.exports = WlOutput_Transform
