'use strict'

class WireMessageInterceptor {
  /**
   /**
   * @param message
   * @param opcode
   * @returns {Array<ArrayBuffer>|null}
   */
  intercept (message, opcode) {
    const requestHandler = this[opcode]
    if (requestHandler) {
      requestHandler(message)
    }
  }
}

module.exports = WireMessageInterceptor
