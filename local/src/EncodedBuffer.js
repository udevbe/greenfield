module.exports = class EncodedBuffer {
  /**
   * @param {number}frameX
   * @param {number}frameY
   * @param {Buffer}buffer
   */
  static create (frameX, frameY, buffer) {
    return new EncodedBuffer(frameX, frameY, buffer)
  }

  /**
   * @param {number}frameX
   * @param {number}frameY
   * @param {Buffer}buffer
   */
  constructor (frameX, frameY, buffer) {
    /**
     * @type {number}
     * @private
     */
    this._frameX = frameX
    /**
     * @type {number}
     * @private
     */
    this._frameY = frameY
    /**
     * @type {Buffer}
     * @private
     */
    this._buffer = buffer
  }

  /**
   * @return {Buffer}
   */
  toBuffer () {
    const buffer = Buffer.allocUnsafe(4 + 2 + 2 + this._buffer.length) // length + frameX + frameY + buffer
    buffer.writeUInt32BE(this._buffer.length, 0, true)
    buffer.writeUInt16BE(this._frameX, 4, true)
    buffer.writeUInt16BE(this._frameY, 6, true)
    this._buffer.copy(buffer, 8)
    return buffer
  }
}
