class EncodedBuffer {
  /**
   * @param {number}frameX
   * @param {number}frameY
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {Buffer}buffer
   * @return {EncodedBuffer}
   */
  static create (frameX, frameY, bufferWidth, bufferHeight, buffer) {
    return new EncodedBuffer(frameX, frameY, bufferWidth, bufferHeight, buffer)
  }

  /**
   * @param {number}frameX
   * @param {number}frameY
   * @param {number}bufferWidth
   * @param {number}bufferHeight
   * @param {Buffer}buffer
   */
  constructor (frameX, frameY, bufferWidth, bufferHeight, buffer) {
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
     * @type {number}
     * @private
     */
    this._bufferWidth = bufferWidth
    /**
     * @type {number}
     * @private
     */
    this._bufferHeight = bufferHeight
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
    const buffer = Buffer.allocUnsafe(4 + 2 + 2 + 2 + 2 + this._buffer.length) // length + frameX + frameY + bufferWidth + bufferHeight + buffer
    buffer.writeUInt32BE(this._buffer.length + 8, 0, true)
    buffer.writeUInt16BE(this._frameX, 4, true)
    buffer.writeUInt16BE(this._frameY, 6, true)
    buffer.writeUInt16BE(this._bufferWidth, 8, true)
    buffer.writeUInt16BE(this._bufferHeight, 10, true)
    this._buffer.copy(buffer, 12)
    return buffer
  }
}

module.exports = EncodedBuffer
