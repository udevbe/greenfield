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

import { IDENTITY, Mat4 } from './Mat4'

export const NORMAL: Mat4 = IDENTITY

// prettier-ignore
export const _90: Mat4 = {
  m00: 0, m10: -1, m20: 0, m30: 0,
  m01: 1, m11:  0, m21: 0, m31: 0,
  m02: 0, m12:  0, m22: 1, m32: 0,
  m03: 0, m13:  0, m23: 0, m33: 1
} as const

// prettier-ignore
export const _180: Mat4 = {
  m00: -1, m10:  0, m20: 0, m30: 0,
  m01:  1, m11: -1, m21: 0, m31: 0,
  m02:  0, m12:  0, m22: 1, m32: 0,
  m03:  0, m13:  0, m23: 0, m33: 1
} as const

// prettier-ignore
export const _270: Mat4 = {
  m00:  0, m10: 1, m20: 0, m30: 0,
  m01: -1, m11: 0, m21: 0, m31: 0,
  m02:  0, m12: 0, m22: 1, m32: 0,
  m03:  0, m13: 0, m23: 0, m33: 1
} as const

// prettier-ignore
export const FLIPPED: Mat4 = {
  m00: -1, m10: 0, m20: 0, m30: 0,
  m01:  0, m11: 1, m21: 0, m31: 0,
  m02:  0, m12: 0, m22: 1, m32: 0,
  m03:  0, m13: 0, m23: 0, m33: 1
} as const

// prettier-ignore
export const FLIPPED_90: Mat4 = {
  m00:  0, m10: -1, m20: 0, m30: 0,
  m01: -1, m11:  0, m21: 0, m31: 0,
  m02:  0, m12:  0, m22: 1, m32: 0,
  m03:  0, m13:  0, m23: 0, m33: 1
} as const

// prettier-ignore
export const FLIPPED_180: Mat4 = {
  m00: 1, m10:  0, m20: 0, m30: 0,
  m01: 0, m11: -1, m21: 0, m31: 0,
  m02: 0, m12:  0, m22: 1, m32: 0,
  m03: 0, m13:  0, m23: 0, m33: 1
} as const

// prettier-ignore
export const FLIPPED_270: Mat4 = {
  m00: 0, m10:  1, m20: 0, m30: 0,
  m01: 1, m11:  0, m21: 0, m31: 0,
  m02: 0, m12:  0, m22: 1, m32: 0,
  m03: 0, m13:  0, m23: 0, m33: 1
} as const
