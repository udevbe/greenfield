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

import Vec4 from './Vec4'

export default class Point {
  static create(x: number, y: number): Point {
    return new Point(x, y)
  }

  constructor(public readonly x: number, public readonly y: number) {}

  toVec4(): Vec4 {
    return Vec4.create(this.x, this.y, 0, 1)
  }

  plus(right: Point): Point {
    return Point.create(this.x + right.x, this.y + right.y)
  }

  minus(right: Point): Point {
    return Point.create(this.x - right.x, this.y - right.y)
  }
}
