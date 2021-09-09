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

import { SizeRO } from './Size'
import { PointRO } from './Point'

export type RectRO = {
  readonly x0: number
  readonly y0: number
  readonly x1: number
  readonly y1: number
}

export type RectROWithInfo = {
  readonly size: SizeRO
  readonly position: PointRO
} & RectRO

export function createRect(position: PointRO, size: SizeRO): RectROWithInfo {
  return {
    x0: position.x,
    y0: position.y,
    x1: position.x + size.width,
    y1: position.x + size.height,
    size,
    position,
  }
}

export function withInfo(rect: RectRO): RectROWithInfo {
  return {
    ...rect,
    size: {
      width: Math.abs(rect.x1 - rect.x0),
      height: Math.abs(rect.y1 - rect.y0),
    },
    position: {
      x: rect.x0,
      y: rect.y0,
    },
  }
}

export function intersect(rect: RectRO, other: RectRO): RectRO {
  const leftX = Math.max(rect.x0, other.x0)
  const rightX = Math.min(rect.x1, other.x1)
  const topY = Math.max(rect.y0, other.y0)
  const bottomY = Math.min(rect.y1, other.y1)

  let intersectionRect
  if (leftX < rightX && topY < bottomY) {
    intersectionRect = { x0: leftX, y0: topY, x1: rightX, y1: bottomY }
  } else {
    // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)
    intersectionRect = { x0: 0, y0: 0, x1: 0, y1: 0 }
  }

  return intersectionRect
}
