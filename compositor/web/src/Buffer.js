'use strict'

/**
 * @interface
 */
export default class Buffer {
  /**
   * @param commitSerial
   * @return {!Promise<*>}
   */
  async getContents (commitSerial) {}
}
