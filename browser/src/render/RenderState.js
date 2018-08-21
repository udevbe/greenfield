/**
 * @interface
 */
export default class RenderState {
  /**
   * @param {BrowserEncodedFrame}browserEncodedFrame
   */
  update (browserEncodedFrame) {}

  destroy () {}
}
