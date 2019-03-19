/**
 * @interface
 */
export default class BufferImplementation {
  /**
   * @param {number}serial
   * @return {BufferContents}
   */
  async getContents (serial) {}

  release () {}
}
