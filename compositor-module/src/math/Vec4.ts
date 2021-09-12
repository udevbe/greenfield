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

import { Point } from './Point'

export type Vec4 = {
  readonly x: number
  readonly y: number
  readonly z: number
  readonly w: number
}

export function createVec4_2D(x: number, y: number): Vec4 {
  return {
    x,
    y,
    z: 1,
    w: 1,
  } as const
}

export function plusVec4({ x: x0, y: y0, z: z0, w: w0 }: Vec4, { x: x1, y: y1, z: z1, w: w1 }: Vec4): Vec4 {
  return {
    x: x0 + x1,
    y: y0 + y1,
    z: z0 + z1,
    w: w0 + w1,
  } as const
}

export function minusVec4({ x: x0, y: y0, z: z0, w: w0 }: Vec4, { x: x1, y: y1, z: z1, w: w1 }: Vec4): Vec4 {
  return {
    x: x0 - x1,
    y: y0 - y1,
    z: z0 - z1,
    w: w0 - w1,
  } as const
}

export function toPoint({ x, y }: Vec4): Point {
  return { x, y }
}
