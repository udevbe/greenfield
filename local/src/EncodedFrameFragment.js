class EncodedFrameFragment {
  /**
   * @param {number}fragmentX
   * @param {number}fragmentY
   * @param {number}fragmentWidth
   * @param {number}fragmentHeight
   * @param {Buffer}opaque
   * @param {Buffer}alpha
   * @return {EncodedFrameFragment}
   */
  static create (fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha) {
    return new EncodedFrameFragment(fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha)
  }

  /**
   * @private
   * @param {number}fragmentX
   * @param {number}fragmentY
   * @param {number}fragmentWidth
   * @param {number}fragmentHeight
   * @param {Buffer}opaque
   * @param {Buffer}alpha
   */
  constructor (fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha) {
    /**
     * @type {number}
     * @private
     */
    this._fragmentX = fragmentX
    /**
     * @type {number}
     * @private
     */
    this._fragmentY = fragmentY
    /**
     * @type {number}
     * @private
     */
    this._fragmentWidth = fragmentWidth
    /**
     * @type {number}
     * @private
     */
    this._fragmentHeight = fragmentHeight
    /**
     * @type {Buffer}
     * @private
     */
    this._opaque = opaque
    /**
     * @type {Buffer}
     * @private
     */
    this._alpha = alpha
  }

  get size () {
    return 2 + // fragmentX (uint16LE)
      2 + // fragmentY (uint16LE)
      2 + // fragmentWidth (uint16LE)
      2 + // fragmentHeight (uint16LE)
      4 + // fragment opaque length (uin32LE)
      this._opaque.length + // opaque (uint8array)
      4 + // fragment alpha length (uin32LE)
      this._alpha.length // alpha (uint8array)
  }

  /**
   * @param {Buffer}buffer
   * @param {number}bufferOffset
   */
  writeToBuffer (buffer, bufferOffset) {
    let offset = bufferOffset

    buffer.writeUInt16LE(this._fragmentX, offset, true)
    offset += 2

    buffer.writeUInt16LE(this._fragmentY, offset, true)
    offset += 2

    buffer.writeUInt16LE(this._fragmentWidth, offset, true)
    offset += 2

    buffer.writeUInt16LE(this._fragmentHeight, offset, true)
    offset += 2

    buffer.writeUInt32LE(this._opaque.length, offset, true)
    offset += 4

    this._opaque.copy(buffer, offset)
    offset += this._opaque.length

    buffer.writeUInt32LE(this._alpha.length, offset, true)
    offset += 4

    this._alpha.copy(buffer, offset)
    offset += this._alpha.length

    return offset
  }
}

module.exports = EncodedFrameFragment
