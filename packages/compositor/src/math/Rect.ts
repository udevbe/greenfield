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

import { Size } from './Size'
import { Point } from './Point'

export type Rect = {
  readonly x0: number
  readonly y0: number
  readonly x1: number
  readonly y1: number
}

export const ZERO_RECT: Rect = {
  x0: 0,
  y0: 0,
  x1: 0,
  y1: 0,
}

export type RectWithInfo = {
  readonly size: Size
  readonly position: Point
} & Rect

export function createRect(position: Point, size: Size): RectWithInfo {
  return {
    x0: position.x,
    y0: position.y,
    x1: position.x + size.width,
    y1: position.y + size.height,
    size,
    position,
  }
}

export function withSizeAndPosition(rect: Rect): RectWithInfo {
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

export function intersect(rect: Rect, other: Rect): Rect {
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

export function boundingRect(rects: Rect[]): Rect {
  const xs: number[] = []
  const ys: number[] = []

  if (rects.length) {
    rects.forEach((rect) => {
      xs.push(rect.x0)
      ys.push(rect.y0)
      xs.push(rect.x1)
      ys.push(rect.y1)
    })

    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    return { x0: minX, y0: minY, x1: maxX, y1: maxY }
  } else {
    return { x0: 0, y0: 0, x1: 0, y1: 0 }
  }
}
