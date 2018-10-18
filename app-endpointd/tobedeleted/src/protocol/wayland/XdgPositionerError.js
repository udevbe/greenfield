const namespace = require('wayland-server-bindings-runtime').namespace

const XdgPositioner_Error = {
  /**
   * invalid input provided
   */
  invalidInput: 0
}

namespace.XdgPositioner_Error = XdgPositioner_Error
module.exports = XdgPositioner_Error
