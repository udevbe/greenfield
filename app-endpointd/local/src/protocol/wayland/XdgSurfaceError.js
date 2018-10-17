const namespace = require('wayland-server-bindings-runtime').namespace

const XdgSurface_Error = {
  /**
   * undefined
   */
  notConstructed: 1,
  /**
   * undefined
   */
  alreadyConstructed: 2,
  /**
   * undefined
   */
  unconfiguredBuffer: 3
}

namespace.XdgSurface_Error = XdgSurface_Error
module.exports = XdgSurface_Error
