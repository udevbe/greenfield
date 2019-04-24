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

import Vec4 from './Vec4'

export default class Point {
  /**
   * @param {number }x
   * @param {number} y
   * @returns {Point}
   */
  static create (x, y) {
    return new Point(x, y)
  }

  /**
   *
   * @param {number}x
   * @param {number}y
   */
  constructor (x, y) {
    /**
     * @type {number}
     */
    this.x = x
    /**
     * @type {number}
     */
    this.y = y
  }

  /**
   * @returns {Vec4}
   */
  toVec4 () {
    return Vec4.create(
      this.x,
      this.y,
      0,
      1)
  }

  /**
   * @param {Point} right
   * @returns {Point}
   */
  plus (right) {
    return Point.create(
      this.x + right.x,
      this.y + right.y
    )
  }

  /**
   * @param {Point} right
   * @returns {Point}
   */
  minus (right) {
    return Point.create(
      this.x - right.x,
      this.y - right.y
    )
  }
}
