// Copyright 2020 Erik De Rijcke
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
import Point from './Point'

export default class Rect {
  /**
   * @param x0 top left x
   * @param y0 top left y
   * @param x1 bottom right x
   * @param y1 bottom right y
   */
  static create(x0: number, y0: number, x1: number, y1: number): Rect {
    return new Rect(x0, y0, x1, y1)
  }

  constructor(public x0: number, public y0: number, public x1: number, public y1: number) {}

  get width(): number {
    return Math.abs(this.x1 - this.x0)
  }

  get height(): number {
    return Math.abs(this.y1 - this.y0)
  }

  get size(): Size {
    return Size.create(this.width, this.height)
  }

  get position(): Point {
    return Point.create(this.x0, this.y0)
  }

  intersect(other: Rect): Rect {
    const leftX = Math.max(this.x0, other.x0)
    const rightX = Math.min(this.x1, other.x1)
    const topY = Math.max(this.y0, other.y0)
    const bottomY = Math.min(this.y1, other.y1)

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
