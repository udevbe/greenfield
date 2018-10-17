const namespace = require('wayland-server-bindings-runtime').namespace

const WlShellSurface_Resize = {
  /**
   * no edge
   */
  none: 0,
  /**
   * top edge
   */
  top: 1,
  /**
   * bottom edge
   */
  bottom: 2,
  /**
   * left edge
   */
  left: 4,
  /**
   * top and left edges
   */
  topLeft: 5,
  /**
   * bottom and left edges
   */
  bottomLeft: 6,
  /**
   * right edge
   */
  right: 8,
  /**
   * top and right edges
   */
  topRight: 9,
  /**
   * bottom and right edges
   */
  bottomRight: 10
}

namespace.WlShellSurface_Resize = WlShellSurface_Resize
module.exports = WlShellSurface_Resize
