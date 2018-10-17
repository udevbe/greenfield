const namespace = require('wayland-server-bindings-runtime').namespace

const WlSubcompositor_Error = {
  /**
   * the to-be sub-surface is invalid
   */
  badSurface: 0
}

namespace.WlSubcompositor_Error = WlSubcompositor_Error
module.exports = WlSubcompositor_Error
