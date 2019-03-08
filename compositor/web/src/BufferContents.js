/**
 * @interface
 */
export default class BufferContents {
  /**
   * @return {Size}
   */
  get size () {}

  /**
   * @return {string}
   */
  get mimeType () {}

  /**
   * @return {*}
   */
  get pixelContent () {}

  /**
   * @return {number}
   */
  get serial () {}
}
