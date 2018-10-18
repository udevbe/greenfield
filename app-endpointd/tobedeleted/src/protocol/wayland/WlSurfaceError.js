const namespace = require('wayland-server-bindings-runtime').namespace

const WlSurface_Error = {
  /**
   * buffer scale value is invalid
   */
  invalidScale: 0,
  /**
   * buffer transform value is invalid
   */
  invalidTransform: 1
}

namespace.WlSurface_Error = WlSurface_Error
module.exports = WlSurface_Error
