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

/**
 * Represents a 2-dimensional size value.
 */
export default class Size {
  w: number
  h: number

  static create(width: number, height: number): Size {
    return new Size(width, height)
  }

  constructor(w: number, h: number) {
    this.w = w
    this.h = h
  }

  toString(): string {
    return '(' + this.w + ', ' + this.h + ')'
  }

  getHalfSize(): Size {
    return new Size(this.w >>> 1, this.h >>> 1)
  }

  equals(size: Size): boolean {
    return size.w === this.w && size.h === this.h
  }
}
