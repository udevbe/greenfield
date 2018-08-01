'use strict'

class BrowserEncodingOptions {
  /**
   * @param {number}encodingOptions
   * return {boolean}
   */
  static splitAlpha (encodingOptions) {
    return (encodingOptions & BrowserEncodingOptions._ALPHA) !== 0
  }

  static fullFrame (encodingOptions) {
    return (encodingOptions & BrowserEncodingOptions._FULL_FRAME) !== 0
  }
}

BrowserEncodingOptions._ALPHA = (1 << 0)
BrowserEncodingOptions._FULL_FRAME = (1 << 1)

export default BrowserEncodingOptions
