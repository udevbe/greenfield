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

import BufferContents from '../BufferContents'
import Size from '../Size'

/**
 * @implements BufferContents
 */
export default class WebGLFrame extends BufferContents {
  /**
   * @param {HTMLCanvasElement} canvas
   * @return {WebGLFrame}
   */
  static create (canvas) {
    return new WebGLFrame(canvas, Size.create(canvas.width, canvas.height))
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Size}size
   */
  constructor (canvas, size) {
    super()
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._canvas = canvas
    /**
     * @type {Size}
     * @private
     */
    this._size = size
  }

  /**
   * @return {string}
   */
  get mimeType () { return 'image/canvas' }

  /**
   * @return {HTMLCanvasElement}
   */
  get pixelContent () {
    return this._canvas
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
