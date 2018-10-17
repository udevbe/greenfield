const namespace = require('wayland-server-bindings-runtime').namespace

const WlOutput_Subpixel = {
  /**
   * unknown geometry
   */
  unknown: 0,
  /**
   * no geometry
   */
  none: 1,
  /**
   * horizontal RGB
   */
  horizontalRgb: 2,
  /**
   * horizontal BGR
   */
  horizontalBgr: 3,
  /**
   * vertical RGB
   */
  verticalRgb: 4,
  /**
   * vertical BGR
   */
  verticalBgr: 5
}

namespace.WlOutput_Subpixel = WlOutput_Subpixel
module.exports = WlOutput_Subpixel
