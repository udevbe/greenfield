/**
 * Browser surface role interface. See 'role' in https://wayland.freedesktop.org/docs/html/apa.html#protocol-spec-wl_surface
 * @interface
 */
export default class BrowserSurfaceRole {
  /**
   *
   * @param {BrowserSurface}browserSurface
   * @param {RenderFrame}renderFrame
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
   * @return {Promise<void>}
   */
  onCommit (browserSurface, renderFrame, newState) {}

  /**
   * @return {*}
   */
  captureRoleState () {}

  /**
   * @param {*}roleState
   */
  setRoleState (roleState) {}
}
