/**
 * surface role interface. See 'role' in https://wayland.freedesktop.org/docs/html/apa.html#protocol-spec-wl_surface
 * @interface
 */
export default class SurfaceRole {
  /**
   *
   * @param {Surface}surface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: EncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<Callback>, roleState: *}}newState
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
