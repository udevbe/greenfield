const namespace = require('wayland-server-bindings-runtime').namespace

const XdgPositioner_Gravity = {
  /**
   * undefined
   */
  none: 0,
  /**
   * undefined
   */
  top: 1,
  /**
   * undefined
   */
  bottom: 2,
  /**
   * undefined
   */
  left: 3,
  /**
   * undefined
   */
  right: 4,
  /**
   * undefined
   */
  topLeft: 5,
  /**
   * undefined
   */
  bottomLeft: 6,
  /**
   * undefined
   */
  topRight: 7,
  /**
   * undefined
   */
  bottomRight: 8
}

namespace.XdgPositioner_Gravity = XdgPositioner_Gravity
module.exports = XdgPositioner_Gravity
