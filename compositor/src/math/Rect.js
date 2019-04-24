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

import Size from '../Size'
import Point from './Point'

export default class Rect {
  /**
   * @param {Number} x0 top left x
   * @param {Number} y0 top left y
   * @param {Number} x1 bottom right x
   * @param {Number} y1 bottom right y
   * @returns {Rect}
   */
  static create (x0, y0, x1, y1) {
    return new Rect(x0, y0, x1, y1)
  }

  /**
   * @param {Number} x0
   * @param {Number} y0
   * @param {Number} x1
   * @param {Number} y1
   * @returns {Rect}
   */
  constructor (x0, y0, x1, y1) {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
  }

  /**
   * @return {number}
   */
  get width () {
    return Math.abs(this.x1 - this.x0)
  }

  /**
   * @return {number}
   */
  get height () {
    return Math.abs(this.y1 - this.y0)
  }

  /**
   * @return {Size}
   */
  get size () {
    return Size.create(this.width, this.height)
  }

  /**
   * @return {Point}
   */
  get position () {
    return Point.create(this.x0, this.y0)
  }

  /**
   * @param {Rect}other
   * @return {Rect}
   */
  intersect (other) {
    const r1 = this
    const r2 = other

    const leftX = Math.max(r1.x0, r2.x0)
    const rightX = Math.min(r1.x1, r2.x1)
    const topY = Math.max(r1.y0, r2.y0)
    const bottomY = Math.min(r1.y1, r2.y1)

    let intersectionRect
    if (leftX < rightX && topY < bottomY) {
      intersectionRect = Rect.create(leftX, topY, rightX, bottomY)
    } else {
      // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)
      intersectionRect = Rect.create(0, 0, 0, 0)
    }

    return intersectionRect
  }
}
