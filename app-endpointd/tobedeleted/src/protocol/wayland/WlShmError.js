const namespace = require('wayland-server-bindings-runtime').namespace

const WlShm_Error = {
  /**
   * buffer format is not known
   */
  invalidFormat: 0,
  /**
   * invalid size or stride during pool or buffer creation
   */
  invalidStride: 1,
  /**
   * mmapping the file descriptor failed
   */
  invalidFd: 2
}

namespace.WlShm_Error = WlShm_Error
module.exports = WlShm_Error
