const namespace = require('wayland-server-bindings-runtime').namespace

const WlPointer_Axis = {
  /**
   * vertical axis
   */
  verticalScroll: 0,
  /**
   * horizontal axis
   */
  horizontalScroll: 1
}

namespace.WlPointer_Axis = WlPointer_Axis
module.exports = WlPointer_Axis
