'use strict'

class EncodingOptions {
  /**
   * @param {number}encodingOptions
   * return {boolean}
   */
  static splitAlpha (encodingOptions) {
    return (encodingOptions & EncodingOptions._ALPHA) !== 0
  }

  /**
   * @param encodingOptions
   * @return {boolean}
   */
  static fullFrame (encodingOptions) {
    return (encodingOptions & EncodingOptions._FULL_FRAME) !== 0
  }
}

/**
 * @type {number}
 * @private
 */
EncodingOptions._ALPHA = (1 << 0)
/**
 * @type {number}
 * @private
 */
EncodingOptions._FULL_FRAME = (1 << 1)

export default EncodingOptions
