const namespace = require('wayland-server-bindings-runtime').namespace

const XdgToplevel_State = {
  /**
   * the surface is maximized
   */
  maximized: 1,
  /**
   * the surface is fullscreen
   */
  fullscreen: 2,
  /**
   * the surface is being resized
   */
  resizing: 3,
  /**
   * the surface is now activated
   */
  activated: 4
}

namespace.XdgToplevel_State = XdgToplevel_State
module.exports = XdgToplevel_State
