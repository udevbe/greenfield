const namespace = require('wayland-server-bindings-runtime').namespace

const WlPointer_Error = {
  /**
   * given wl_surface has another role
   */
  role: 0
}

namespace.WlPointer_Error = WlPointer_Error
module.exports = WlPointer_Error
