const namespace = require('wayland-server-bindings-runtime').namespace

const XdgToplevel_ResizeEdge = {
  /**
   * undefined
   */
  none: 0,
  /**
   * undefined
   */
  top: 1,
  /**
   * undefined
   */
  bottom: 2,
  /**
   * undefined
   */
  left: 4,
  /**
   * undefined
   */
  topLeft: 5,
  /**
   * undefined
   */
  bottomLeft: 6,
  /**
   * undefined
   */
  right: 8,
  /**
   * undefined
   */
  topRight: 9,
  /**
   * undefined
   */
  bottomRight: 10
}

namespace.XdgToplevel_ResizeEdge = XdgToplevel_ResizeEdge
module.exports = XdgToplevel_ResizeEdge
