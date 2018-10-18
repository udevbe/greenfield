const namespace = require('wayland-server-bindings-runtime').namespace

const XdgPositioner_Anchor = {
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

namespace.XdgPositioner_Anchor = XdgPositioner_Anchor
module.exports = XdgPositioner_Anchor
