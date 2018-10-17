const namespace = require('wayland-server-bindings-runtime').namespace

const WlKeyboard_KeyState = {
  /**
   * key is not pressed
   */
  released: 0,
  /**
   * key is pressed
   */
  pressed: 1
}

namespace.WlKeyboard_KeyState = WlKeyboard_KeyState
module.exports = WlKeyboard_KeyState
