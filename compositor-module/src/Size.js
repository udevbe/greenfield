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

/**
 * Represents a 2-dimensional size value.
 */

export default class Size {
  /**
   *
   * @param {number} width
   * @param {number} height
   * @returns {Size}
   */
  static create (width, height) {
    return new Size(width, height)
  }

  /**
   * @param {number} w
   * @param {number} h
   */
  constructor (w, h) {
    /**
     * @type {number}
     */
    this.w = w
    /**
     * @type {number}
     */
    this.h = h
  }

  /**
   * @returns {string}
   */
  toString () {
    return '(' + this.w + ', ' + this.h + ')'
  }

  /**
   * @returns {Size}
   */
  getHalfSize () {
    return new Size(this.w >>> 1, this.h >>> 1)
  }

  /**
   * @param {Size}size
   * @return {boolean}
   */
  equals (size) {
    return size.w === this.w && size.h === this.h
  }
}
