const namespace = require('wayland-server-bindings-runtime').namespace

const WlSeat_Capability = {
  /**
   * the seat has pointer devices
   */
  pointer: 1,
  /**
   * the seat has one or more keyboards
   */
  keyboard: 2,
  /**
   * the seat has touch devices
   */
  touch: 4
}

namespace.WlSeat_Capability = WlSeat_Capability
module.exports = WlSeat_Capability
