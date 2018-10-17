const namespace = require('wayland-server-bindings-runtime').namespace

const WlDataSource_Error = {
  /**
   * action mask contains invalid values
   */
  invalidActionMask: 0,
  /**
   * source doesn't accept this request
   */
  invalidSource: 1
}

namespace.WlDataSource_Error = WlDataSource_Error
module.exports = WlDataSource_Error
