const namespace = require('wayland-server-bindings-runtime').namespace

const WlPointer_AxisSource = {
  /**
   * a physical wheel rotation
   */
  wheel: 0,
  /**
   * finger on a touch surface
   */
  finger: 1,
  /**
   * continuous coordinate space
   */
  continuous: 2,
  /**
   * a physical wheel tilt
   */
  wheelTilt: 3
}

namespace.WlPointer_AxisSource = WlPointer_AxisSource
module.exports = WlPointer_AxisSource
