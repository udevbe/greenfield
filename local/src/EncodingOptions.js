class EncodingOptions {
  /**
   * @param {number}encodingOptions
   * @return {number}
   */
  static splitAlpha (encodingOptions) {
    return (encodingOptions | EncodingOptions._ALPHA)
  }

  /**
   * @param encodingOptions
   * @return {number}
   */
  static fullFrame (encodingOptions) {
    return (encodingOptions | EncodingOptions._FULL_FRAME)
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

module.exports = EncodingOptions
