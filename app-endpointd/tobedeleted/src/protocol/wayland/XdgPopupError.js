const namespace = require('wayland-server-bindings-runtime').namespace

const XdgPopup_Error = {
  /**
   * tried to grab after being mapped
   */
  invalidGrab: 0
}

namespace.XdgPopup_Error = XdgPopup_Error
module.exports = XdgPopup_Error
