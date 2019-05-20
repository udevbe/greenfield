// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

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
    const size = 2 + // fragmentX (uint16LE)
      2 + // fragmentY (uint16LE)
      2 + // fragmentWidth (uint16LE)
      2 + // fragmentHeight (uint16LE)
      4 + // fragment opaque length (uin32LE)
      opaque.length + // opaque (uint8array)
      4 + // fragment alpha length (uin32LE)
      alpha.length // alpha (uint8array)
    return new EncodedFrameFragment(fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha, size)
  }

  /**
   * @private
   * @param {number}fragmentX
   * @param {number}fragmentY
   * @param {number}fragmentWidth
   * @param {number}fragmentHeight
   * @param {Buffer}opaque
   * @param {Buffer}alpha
   * @param {number}size
   */
  constructor (fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha, size) {
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
    /**
     * @type {number}
     */
    this.size = size
  }

  /**
   * @param {Buffer}buffer
   * @param {number}offset
   */
  writeToBuffer (buffer, offset) {
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
    offset += this._opaque.byteLength

    buffer.writeUInt32LE(this._alpha.length, offset, true)
    offset += 4

    this._alpha.copy(buffer, offset)
    offset += this._alpha.byteLength

    return offset
  }
}

module.exports = EncodedFrameFragment
