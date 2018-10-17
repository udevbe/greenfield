const namespace = require('wayland-server-bindings-runtime').namespace

const WlOutput_Mode = {
  /**
   * indicates this is the current mode
   */
  current: 0x1,
  /**
   * indicates this is the preferred mode
   */
  preferred: 0x2
}

namespace.WlOutput_Mode = WlOutput_Mode
module.exports = WlOutput_Mode
