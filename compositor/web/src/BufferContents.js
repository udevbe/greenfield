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
  get contents () {}

  /**
   * @return {number}
   */
  get serial () {}
}
