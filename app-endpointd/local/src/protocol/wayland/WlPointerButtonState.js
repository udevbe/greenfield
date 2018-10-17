const namespace = require('wayland-server-bindings-runtime').namespace

const WlPointer_ButtonState = {
  /**
   * the button is not pressed
   */
  released: 0,
  /**
   * the button is pressed
   */
  pressed: 1
}

namespace.WlPointer_ButtonState = WlPointer_ButtonState
module.exports = WlPointer_ButtonState
