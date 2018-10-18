/**
 * @interface
 */
export default class RenderState {
  /**
   * @param {EncodedFrame}encodedFrame
   */
  update (encodedFrame) {}

  destroy () {}
}
