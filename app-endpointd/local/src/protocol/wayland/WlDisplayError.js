const namespace = require('wayland-server-bindings-runtime').namespace

const WlDisplay_Error = {
  /**
   * server couldn't find object
   */
  invalidObject: 0,
  /**
   * method doesn't exist on the specified interface
   */
  invalidMethod: 1,
  /**
   * server is out of memory
   */
  noMemory: 2
}

namespace.WlDisplay_Error = WlDisplay_Error
module.exports = WlDisplay_Error
