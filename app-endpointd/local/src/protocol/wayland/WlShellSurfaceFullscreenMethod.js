const namespace = require('wayland-server-bindings-runtime').namespace

const WlShellSurface_FullscreenMethod = {
  /**
   * no preference, apply default policy
   */
  default: 0,
  /**
   * scale, preserve the surface's aspect ratio and center on output
   */
  scale: 1,
  /**
   * switch output mode to the smallest mode that can fit the surface, add black borders to compensate size mismatch
   */
  driver: 2,
  /**
   * no upscaling, center on output and add black borders to compensate size mismatch
   */
  fill: 3
}

namespace.WlShellSurface_FullscreenMethod = WlShellSurface_FullscreenMethod
module.exports = WlShellSurface_FullscreenMethod
