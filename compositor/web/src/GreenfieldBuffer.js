'use strict'

/**
 * @interface
 */
export default class GreenfieldBuffer {
  /**
   * @param commitSerial
   * @return {!Promise<*>}
   */
  async getContents (commitSerial) {}
}
