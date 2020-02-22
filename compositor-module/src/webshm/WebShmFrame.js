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

import Size from '../Size'

/**
 * @implements BufferContents
 */
export default class WebShmFrame {
  /**
   * @param {number}width
   * @param {number}height
   * @return {WebShmFrame}
   */
  static create (width, height) {
    return new WebShmFrame(width, height)
  }

  /**
   * @param {number}width
   * @param {number}height
   */
  constructor (width, height) {
    /**
     * @type {Size}
     * @private
     * @const
     */
    this._size = Size.create(width, height)
    /**
     * @type {ImageData}
     */
    this._pixelContent = new ImageData(new Uint8ClampedArray(new ArrayBuffer(width * height * 4)), width, height)
  }

  /**
   * @return {Size}
   * @override
   */
  get size () { return this._size }

  /**
   * @return {ImageData}
   * @override
   */
  get pixelContent () { return this._pixelContent }

  /**
   * @return {string}
   * @override
   */
  get mimeType () { return 'image/rgba' }

  /**
   * @return {number}
   * @override
   */
  get serial () { return 0 }

  /**
   * @param {WebFD}pixelContent
   */
  async attach (pixelContent) {
    const arrayBuffer = /** @type {ArrayBuffer} */ await pixelContent.getTransferable()
    this._pixelContent = new ImageData(new Uint8ClampedArray(arrayBuffer), this._size.w, this._size.h)
  }

  /**
   * @override
   */
  validateSize () { /* NOOP */ }
}
