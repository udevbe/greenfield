const namespace = require('wayland-server-bindings-runtime').namespace

const WlShell_Error = {
  /**
   * given wl_surface has another role
   */
  role: 0
}

namespace.WlShell_Error = WlShell_Error
module.exports = WlShell_Error
