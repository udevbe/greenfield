/**
 * surface role interface. See 'role' in https://wayland.freedesktop.org/docs/html/apa.html#protocol-spec-wl_surface
 * @interface
 */
export default class SurfaceRole {
  /**
   *
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {SurfaceState}newState
   * @return {Promise<void>}
   */
  onCommit (surface, renderFrame, newState) {}

  /**
   * @return {*}
   */
  captureRoleState () {}

  /**
   * @param {*}roleState
   */
  setRoleState (roleState) {}
}
