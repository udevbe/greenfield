const namespace = require('wayland-server-bindings-runtime').namespace

const WlKeyboard_KeymapFormat = {
  /**
   * no keymap; client must understand how to interpret the raw keycode
   */
  noKeymap: 0,
  /**
   * libxkbcommon compatible; to determine the xkb keycode, clients must add 8 to the key event keycode
   */
  xkbV1: 1
}

namespace.WlKeyboard_KeymapFormat = WlKeyboard_KeymapFormat
module.exports = WlKeyboard_KeymapFormat
