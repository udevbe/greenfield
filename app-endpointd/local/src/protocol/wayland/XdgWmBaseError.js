const namespace = require('wayland-server-bindings-runtime').namespace

const XdgWmBase_Error = {
  /**
   * given wl_surface has another role
   */
  role: 0,
  /**
   * xdg_wm_base was destroyed before children
   */
  defunctSurfaces: 1,
  /**
   * the client tried to map or destroy a non-topmost popup
   */
  notTheTopmostPopup: 2,
  /**
   * the client specified an invalid popup parent surface
   */
  invalidPopupParent: 3,
  /**
   * the client provided an invalid surface state
   */
  invalidSurfaceState: 4,
  /**
   * the client provided an invalid positioner
   */
  invalidPositioner: 5
}

namespace.XdgWmBase_Error = XdgWmBase_Error
module.exports = XdgWmBase_Error
