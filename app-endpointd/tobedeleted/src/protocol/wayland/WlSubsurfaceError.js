const namespace = require('wayland-server-bindings-runtime').namespace

const WlSubsurface_Error = {
  /**
   * wl_surface is not a sibling or the parent
   */
  badSurface: 0
}

namespace.WlSubsurface_Error = WlSubsurface_Error
module.exports = WlSubsurface_Error
