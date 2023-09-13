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
import { Rect } from './Rect'
import { Vec4 } from './Vec4'

// prettier-ignore
export type Mat4 = {
  readonly m00: number; readonly m10: number; readonly m20: number; readonly m30: number
  readonly m01: number; readonly m11: number; readonly m21: number; readonly m31: number
  readonly m02: number; readonly m12: number; readonly m22: number; readonly m32: number
  readonly m03: number; readonly m13: number; readonly m23: number; readonly m33: number
}

// prettier-ignore
export const IDENTITY: Mat4 = {
  m00: 1, m10: 0, m20: 0, m30: 0,
  m01: 0, m11: 1, m21: 0, m31: 0,
  m02: 0, m12: 0, m22: 1, m32: 0,
  m03: 0, m13: 0, m23: 0, m33: 1
} as const;

export function scalar(scale: number): Mat4 {
  // prettier-ignore
  return {
    m00: scale, m10: 0,     m20: 0, m30: 0,
    m01: 0,     m11: scale, m21: 0, m31: 0,
    m02: 0,     m12: 0,     m22: 1, m32: 0,
    m03: 0,     m13: 0,     m23: 0, m33: 1
  } as const;
}

export function scalarVector({ x, y, z, w }: Vec4): Mat4 {
  // prettier-ignore
  return {
    m00: x, m10: 0, m20: 0, m30: 0,
    m01: 0, m11: y, m21: 0, m31: 0,
    m02: 0, m12: 0, m22: z, m32: 0,
    m03: 0, m13: 0, m23: 0, m33: w
  } as const;
}

export function translation(x: number, y: number): Mat4 {
  // prettier-ignore
  return {
    m00: 1, m10: 0, m20: 0, m30: x,
    m01: 0, m11: 1, m21: 0, m31: y,
    m02: 0, m12: 0, m22: 1, m32: 0,
    m03: 0, m13: 0, m23: 0, m33: 1
  } as const;
}

export function plusMat4(left: Mat4, right: Mat4): Mat4 {
  // prettier-ignore
  return {
    m00: left.m00+right.m00, m10: left.m10+right.m10, m20: left.m20+right.m20, m30: left.m30+right.m30,
    m01: left.m01+right.m01, m11: left.m11+right.m11, m21: left.m21+right.m21, m31: left.m31+right.m31,
    m02: left.m02+right.m02, m12: left.m12+right.m12, m22: left.m22+right.m22, m32: left.m32+right.m32,
    m03: left.m03+right.m03, m13: left.m13+right.m13, m23: left.m23+right.m23, m33: left.m33+right.m33
  } as const;
}

export function timesPoint(left: Mat4, right: Point): Point {
  // prettier-ignore
  return {
    x: left.m00 * right.x + left.m10 * right.y + left.m30,
    y: left.m01 * right.x + left.m11 * right.y + left.m31,
  } as const
}

export function timesMat4(left: Mat4, right: Mat4): Mat4 {
  const m00 = left.m00 * right.m00 + left.m10 * right.m01 + left.m20 * right.m02 + left.m30 * right.m03
  const m01 = left.m01 * right.m00 + left.m11 * right.m01 + left.m21 * right.m02 + left.m31 * right.m03
  const m02 = left.m02 * right.m00 + left.m12 * right.m01 + left.m22 * right.m02 + left.m32 * right.m03
  const m03 = left.m03 * right.m00 + left.m13 * right.m01 + left.m23 * right.m02 + left.m33 * right.m03
  const m10 = left.m00 * right.m10 + left.m10 * right.m11 + left.m20 * right.m12 + left.m30 * right.m13
  const m11 = left.m01 * right.m10 + left.m11 * right.m11 + left.m21 * right.m12 + left.m31 * right.m13
  const m12 = left.m02 * right.m10 + left.m12 * right.m11 + left.m22 * right.m12 + left.m32 * right.m13
  const m13 = left.m03 * right.m10 + left.m13 * right.m11 + left.m23 * right.m12 + left.m33 * right.m13
  const m20 = left.m00 * right.m20 + left.m10 * right.m21 + left.m20 * right.m22 + left.m30 * right.m23
  const m21 = left.m01 * right.m20 + left.m11 * right.m21 + left.m21 * right.m22 + left.m31 * right.m23
  const m22 = left.m02 * right.m20 + left.m12 * right.m21 + left.m22 * right.m22 + left.m32 * right.m23
  const m23 = left.m03 * right.m20 + left.m13 * right.m21 + left.m23 * right.m22 + left.m33 * right.m23
  const m30 = left.m00 * right.m30 + left.m10 * right.m31 + left.m20 * right.m32 + left.m30 * right.m33
  const m31 = left.m01 * right.m30 + left.m11 * right.m31 + left.m21 * right.m32 + left.m31 * right.m33
  const m32 = left.m02 * right.m30 + left.m12 * right.m31 + left.m22 * right.m32 + left.m32 * right.m33
  const m33 = left.m03 * right.m30 + left.m13 * right.m31 + left.m23 * right.m32 + left.m33 * right.m33

  // prettier-ignore
  return {
    m00, m10, m20, m30,
    m01, m11, m21, m31,
    m02, m12, m22, m32,
    m03, m13, m23, m33
  } as const
}

export function timesRectToBoundingBox(left: Mat4, right: Rect): Rect {
  const topLeft = timesPoint(left, { x: right.x0, y: right.y0 })
  const bottomLeft = timesPoint(left, { x: right.x0, y: right.y1 })
  const bottomRight = timesPoint(left, { x: right.x1, y: right.y1 })
  const topRight = timesPoint(left, { x: right.x1, y: right.y0 })

  const x0 = Math.min(topLeft.x, bottomLeft.x, bottomRight.x, topRight.x)
  const y0 = Math.min(topLeft.y, bottomLeft.y, bottomRight.y, topRight.y)

  const x1 = Math.max(topLeft.x, bottomLeft.x, bottomRight.x, topRight.x)
  const y1 = Math.max(topLeft.y, bottomLeft.y, bottomRight.y, topRight.y)

  // prettier-ignore
  return {
    x0, y0,
    x1, y1,
  } as const
}

export function invert(mat: Mat4): Mat4 {
  const M = [
    [mat.m00, mat.m01, mat.m02, mat.m03],
    [mat.m10, mat.m11, mat.m12, mat.m13],
    [mat.m20, mat.m21, mat.m22, mat.m23],
    [mat.m30, mat.m31, mat.m32, mat.m33],
  ] as const
  const dim = 4 as const

  let i
  let ii = 0
  let j = 0
  let e = 0
  const I: number[][] = []
  const C: number[][] = []
  for (i = 0; i < dim; i += 1) {
    I[I.length] = []
    C[C.length] = []
    for (j = 0; j < dim; j += 1) {
      if (i === j) {
        I[i][j] = 1
      } else {
        I[i][j] = 0
      }
      C[i][j] = M[i][j]
    }
  }

  for (i = 0; i < dim; i += 1) {
    e = C[i][i]

    if (e === 0) {
      for (ii = i + 1; ii < dim; ii += 1) {
        if (C[ii][i] !== 0) {
          for (j = 0; j < dim; j++) {
            e = C[i][j]
            C[i][j] = C[ii][j]
            C[ii][j] = e
            e = I[i][j]
            I[i][j] = I[ii][j]
            I[ii][j] = e
          }
          break
        }
      }
      e = C[i][i]
      if (e === 0) {
        throw new Error('Bad matrix. Transformation can not be inverted.')
      }
    }

    for (j = 0; j < dim; j++) {
      C[i][j] = C[i][j] / e
      I[i][j] = I[i][j] / e
    }

    for (ii = 0; ii < dim; ii++) {
      if (ii === i) {
        continue
      }

      // We want to change this element to 0
      e = C[ii][i]

      for (j = 0; j < dim; j++) {
        C[ii][j] -= e * C[i][j]
        I[ii][j] -= e * I[i][j]
      }
    }
  }

  // prettier-ignore
  return {
    m00: I[0][0], m10: I[1][0], m20: I[2][0], m30: I[3][0],
    m01: I[0][1], m11: I[1][1], m21: I[2][1], m31: I[3][1],
    m02: I[0][2], m12: I[1][2], m22: I[2][2], m32: I[3][2],
    m03: I[0][3], m13: I[1][3], m23: I[2][3], m33: I[3][3],
  }
}

// prettier-ignore
export function mat4ToArray(
  mat4: Mat4,
): [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
] {
  return [
    mat4.m00, mat4.m01, mat4.m02, mat4.m03,
    mat4.m10, mat4.m11, mat4.m12, mat4.m13,
    mat4.m20, mat4.m21, mat4.m22, mat4.m23,
    mat4.m30, mat4.m31, mat4.m32, mat4.m33,
  ]
}
