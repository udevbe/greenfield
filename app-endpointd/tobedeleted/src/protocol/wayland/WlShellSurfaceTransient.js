const namespace = require('wayland-server-bindings-runtime').namespace

const WlShellSurface_Transient = {
  /**
   * do not set keyboard focus
   */
  inactive: 0x1
}

namespace.WlShellSurface_Transient = WlShellSurface_Transient
module.exports = WlShellSurface_Transient
