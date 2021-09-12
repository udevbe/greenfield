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

import { Vec4 } from './Vec4'

export type Point = {
  readonly x: number
  readonly y: number
}

export const ORIGIN: Point = { x: 0, y: 0 }

export function toVec4({ x, y }: Point): Vec4 {
  return {
    x,
    y,
    z: 1,
    w: 1,
  } as const
}

export function plusPoint({ x: x0, y: y0 }: Point, { x: x1, y: y1 }: Point): Point {
  return {
    x: x0 + x1,
    y: y0 + y1,
  } as const
}

export function minusPoint({ x: x0, y: y0 }: Point, { x: x1, y: y1 }: Point): Point {
  return {
    x: x0 - x1,
    y: y0 - y1,
  } as const
}
