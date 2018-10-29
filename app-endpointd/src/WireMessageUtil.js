'use strict'

const Fixed = require('./Fixed')

class WireMessageUtil {
  /**
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @param {number}consumption
   * @private
   */
  static _checkMessageSize (wireMsg, consumption) {
    if (wireMsg.consumed + consumption > wireMsg.size) {
      throw new Error(`Request too short.`)
    } else {
      wireMsg.consumed += consumption
    }
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @returns {number}
   */
  static u (wireMsg) { // unsigned integer {number}
    const argSize = 4
    this._checkMessageSize(wireMsg, argSize)

    const arg = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize

    return arg
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @returns {number}
   */
  static i (wireMsg) { // integer {number}
    const argSize = 4
    this._checkMessageSize(wireMsg, argSize)

    const arg = new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    return arg
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @returns {number}
   */
  static f (wireMsg) { // float {number}
    const argSize = 4
    this._checkMessageSize(wireMsg, argSize)
    const arg = new Int32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    return new Fixed(arg >> 0)
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @param {Boolean} optional
   * @returns {Resource}
   */
  static o (wireMsg, optional) {
    const argSize = 4
    this._checkMessageSize(wireMsg, argSize)
    const arg = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    if (optional && arg === 0) {
      return null
    } else {
      return this._resources[arg]
    }
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @returns {number}
   */
  static n (wireMsg) {
    const argSize = 4
    this._checkMessageSize(wireMsg, argSize)
    const arg = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += argSize
    return arg
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @param {Boolean} optional
   * @returns {String}
   */
  static s (wireMsg, optional) { // {String}
    const argSize = 4
    this._checkMessageSize(wireMsg, argSize)
    const stringSize = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += 4
    if (optional && stringSize === 0) {
      return null
    } else {
      const alignedSize = ((stringSize + 3) & ~3)
      this._checkMessageSize(wireMsg, alignedSize)
      const byteArray = new Uint8Array(wireMsg.buffer, wireMsg.bufferOffset, stringSize)
      wireMsg.bufferOffset += alignedSize
      return String.fromCharCode.apply(null, byteArray)
    }
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @param {Boolean} optional
   * @returns {ArrayBuffer}
   */
  static a (wireMsg, optional) {
    const argSize = 4
    this._checkMessageSize(wireMsg, argSize)
    const arraySize = new Uint32Array(wireMsg.buffer, wireMsg.bufferOffset, 1)[0]
    wireMsg.bufferOffset += 4
    if (optional && arraySize === 0) {
      return null
    } else {
      const alignedSize = ((arraySize + 3) & ~3)
      this._checkMessageSize(wireMsg, alignedSize)
      const arg = wireMsg.buffer.slice(wireMsg.bufferOffset, wireMsg.bufferOffset + arraySize)
      wireMsg.bufferOffset += alignedSize
      return arg
    }
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} wireMsg
   * @returns {number}
   */
  static h (wireMsg) { // file descriptor {number}
    if (wireMsg.fds.length) {
      return wireMsg.fds.shift()
    } else {
      throw new Error('File descriptor expected.')
    }
  }

  /**
   *
   * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} message
   * @param {string} argsSignature
   * @returns {Array<*>}
   */
  static unmarshallArgs (message, argsSignature) {
    const argsSigLength = argsSignature.length
    const args = []
    let optional = false
    for (let i = 0; i < argsSigLength; i++) {
      let signature = argsSignature[i]
      optional = signature === '?'

      if (optional) {
        signature = argsSignature[++i]
      }

      args.push(this[signature](message, optional))
    }
    return args
  }
}

module.exports = WireMessageUtil
