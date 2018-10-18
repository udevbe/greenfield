const namespace = require('wayland-server-bindings-runtime').namespace

const WlDataDevice_Error = {
  /**
   * given wl_surface has another role
   */
  role: 0
}

namespace.WlDataDevice_Error = WlDataDevice_Error
module.exports = WlDataDevice_Error
