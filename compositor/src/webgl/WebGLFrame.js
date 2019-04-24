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

import BufferContents from '../BufferContents'
import Size from '../Size'

/**
 * @implements BufferContents
 */
export default class WebGLFrame extends BufferContents {
  /**
   * @return {WebGLFrame}
   */
  static create () {
    return new WebGLFrame()
  }

  constructor () {
    super()
    /**
     * @type {Size}
     * @private
     */
    this._size = Size.create(0, 0)
    /**
     * @type {ImageBitmap}
     * @private
     */
    this._imageBitmap = null
  }

  /**
   * @param {ImageBitmap}imageBitmap
   */
  update (imageBitmap) {
    this._imageBitmap = imageBitmap
    this._size = Size.create(imageBitmap.width, imageBitmap.height)
  }

  /**
   * @return {string}
   */
  get mimeType () { return 'image/bitmap' }

  /**
   * @return {ImageBitmap}
   */
  get pixelContent () {
    return this._imageBitmap
  }

  /**
   * @return {number}
   */
  get serial () { return 0 }

  /**
   * @return {Size}
   */
  get size () { return this._size }
}
