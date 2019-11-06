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

import Vec4 from './Vec4'
import Point from './Point'
import Rect from './Rect'

export default class Mat4 {
  /**
   * @param m00 Column 0, Row 0
   * @param m10 Column 1, Row 0
   * @param m20 Column 2, Row 0
   * @param m30 Column 3, Row 0
   * @param m01 Column 0, Row 1
   * @param m11 Column 1, Row 1
   * @param m21 Column 2, Row 1
   * @param m31 Column 3, Row 1
   * @param m02 Column 0, Row 2
   * @param m12 Column 1, Row 2
   * @param m22 Column 2, Row 2
   * @param m32 Column 3, Row 2
   * @param m03 Column 0, Row 3
   * @param m13 Column 1, Row 3
   * @param m23 Column 2, Row 3
   * @param m33 Column 3, Row 3
   * @returns {Mat4}
   */
  static create (
    m00, m10, m20, m30,
    m01, m11, m21, m31,
    m02, m12, m22, m32,
    m03, m13, m23, m33
  ) {
    return new Mat4(
      m00, m10, m20, m30,
      m01, m11, m21, m31,
      m02, m12, m22, m32,
      m03, m13, m23, m33
    )
  }

  /**
   * @returns {Mat4}
   */
  static IDENTITY () {
    return this.create(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1)
  }

  /**
   * @param {Number}scale
   * @returns {Mat4}
   */
  static scalar (scale) {
    return this.create(
      scale, 0, 0, 0,
      0, scale, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
  }

  /**
   * @param {Vec4}vect4
   * @returns {Mat4}
   */
  static scalarVector (vect4) {
    return this.create(
      vect4.x, 0, 0, 0,
      0, vect4.y, 0, 0,
      0, 0, vect4.z, 0,
      0, 0, 0, vect4.w
    )
  }

  /**
   * @param {Number}x
   * @param {Number}y
   * @returns {Mat4}
   */
  static translation (x, y) {
    return this.create(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, 0,
      0, 0, 0, 1
    )
  }

  constructor (
    m00, m10, m20, m30,
    m01, m11, m21, m31,
    m02, m12, m22, m32,
    m03, m13, m23, m33
  ) {
    this.m00 = m00
    this.m10 = m10
    this.m20 = m20
    this.m30 = m30
    this.m01 = m01
    this.m11 = m11
    this.m21 = m21
    this.m31 = m31
    this.m02 = m02
    this.m12 = m12
    this.m22 = m22
    this.m32 = m32
    this.m03 = m03
    this.m13 = m13
    this.m23 = m23
    this.m33 = m33
  }

  /**
   * Add a matrix using this matrix, resulting in a new matrix.
   * @param {Mat4} other
   * @returns {Mat4}
   */
  plus (other) {
    return Mat4.create(
      this.m00 + other.m00, this.m10 + other.m10, this.m20 + other.m20, this.m30 + other.m30,
      this.m01 + other.m01, this.m11 + other.m11, this.m21 + other.m21, this.m31 + other.m31,
      this.m02 + other.m02, this.m12 + other.m12, this.m22 + other.m22, this.m32 + other.m32,
      this.m03 + other.m03, this.m13 + other.m13, this.m23 + other.m23, this.m33 + other.m33
    )
  }

  /**
   * Multiply a point using this matrix, resulting in a new point
   * @param {Point} right
   * @return {Point}
   */
  timesPoint (right) {
    return this.timesVec4(right.toVec4()).toPoint()
  }

  /**
   * Multiply a vector using this matrix, resulting in a new vector.
   * @param {Vec4} right
   * @return {Vec4}
   */
  timesVec4 (right) {
    const rightX = right.x
    const rightY = right.y
    const rightZ = right.z
    const rightW = right.w

    return Vec4.create(
      this.m00 * rightX + this.m10 * rightY + this.m20 * rightZ + this.m30 * rightW,
      this.m01 * rightX + this.m11 * rightY + this.m21 * rightZ + this.m31 * rightW,
      this.m02 * rightX + this.m12 * rightY + this.m22 * rightZ + this.m32 * rightW,
      this.m03 * rightX + this.m13 * rightY + this.m23 * rightZ + this.m33 * rightW
    )
  }

  /**
   * Multiply a matrix using this matrix, resulting in a new matrix.
   * @param {Mat4} right
   * @returns {Mat4}
   */
  timesMat4 (right) {
    const nm00 = this.m00 * right.m00 + this.m10 * right.m01 + this.m20 * right.m02 + this.m30 * right.m03
    const nm01 = this.m01 * right.m00 + this.m11 * right.m01 + this.m21 * right.m02 + this.m31 * right.m03
    const nm02 = this.m02 * right.m00 + this.m12 * right.m01 + this.m22 * right.m02 + this.m32 * right.m03
    const nm03 = this.m03 * right.m00 + this.m13 * right.m01 + this.m23 * right.m02 + this.m33 * right.m03
    const nm10 = this.m00 * right.m10 + this.m10 * right.m11 + this.m20 * right.m12 + this.m30 * right.m13
    const nm11 = this.m01 * right.m10 + this.m11 * right.m11 + this.m21 * right.m12 + this.m31 * right.m13
    const nm12 = this.m02 * right.m10 + this.m12 * right.m11 + this.m22 * right.m12 + this.m32 * right.m13
    const nm13 = this.m03 * right.m10 + this.m13 * right.m11 + this.m23 * right.m12 + this.m33 * right.m13
    const nm20 = this.m00 * right.m20 + this.m10 * right.m21 + this.m20 * right.m22 + this.m30 * right.m23
    const nm21 = this.m01 * right.m20 + this.m11 * right.m21 + this.m21 * right.m22 + this.m31 * right.m23
    const nm22 = this.m02 * right.m20 + this.m12 * right.m21 + this.m22 * right.m22 + this.m32 * right.m23
    const nm23 = this.m03 * right.m20 + this.m13 * right.m21 + this.m23 * right.m22 + this.m33 * right.m23
    const nm30 = this.m00 * right.m30 + this.m10 * right.m31 + this.m20 * right.m32 + this.m30 * right.m33
    const nm31 = this.m01 * right.m30 + this.m11 * right.m31 + this.m21 * right.m32 + this.m31 * right.m33
    const nm32 = this.m02 * right.m30 + this.m12 * right.m31 + this.m22 * right.m32 + this.m32 * right.m33
    const nm33 = this.m03 * right.m30 + this.m13 * right.m31 + this.m23 * right.m32 + this.m33 * right.m33

    return Mat4.create(
      nm00, nm10, nm20, nm30,
      nm01, nm11, nm21, nm31,
      nm02, nm12, nm22, nm32,
      nm03, nm13, nm23, nm33
    )
  }

  /**
   * Multiply a rectangle using this matrix, resulting in a new rectangle.
   * @param {Rect} right
   * @returns {Rect}
   */
  timesRect (right) {
    const topLeft = this.timesPoint(Point.create(right.x0, right.y0))
    const bottomRight = this.timesPoint(Point.create(right.x1, right.y1))
    return Rect.create(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y)
  }

  /**
   *
   * @returns {Mat4|null}
   */
  invert () {
    const M = [
      [this.m00, this.m01, this.m02, this.m03],
      [this.m10, this.m11, this.m12, this.m13],
      [this.m20, this.m21, this.m22, this.m23],
      [this.m30, this.m31, this.m32, this.m33]
    ]

    let i
    let ii = 0
    let j = 0
    const dim = M.length
    let e = 0
    const I = []
    const C = []
    for (i = 0; i < dim; i += 1) {
      I[I.length] = []
      C[C.length] = []
      for (j = 0; j < dim; j += 1) {
        if (i === j) { I[i][j] = 1 } else { I[i][j] = 0 }
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
        if (e === 0) { return null }
      }

      for (j = 0; j < dim; j++) {
        C[i][j] = C[i][j] / e
        I[i][j] = I[i][j] / e
      }

      for (ii = 0; ii < dim; ii++) {
        if (ii === i) { continue }

        // We want to change this element to 0
        e = C[ii][i]

        for (j = 0; j < dim; j++) {
          C[ii][j] -= e * C[i][j]
          I[ii][j] -= e * I[i][j]
        }
      }
    }

    return Mat4.create(
      I[0][0], I[1][0], I[2][0], I[3][0],
      I[0][1], I[1][1], I[2][1], I[3][1],
      I[0][2], I[1][2], I[2][2], I[3][2],
      I[0][3], I[1][3], I[2][3], I[3][3]
    )
  }

  clone () {
    return Mat4.create(
      this.m00, this.m10, this.m20, this.m30,
      this.m01, this.m11, this.m21, this.m31,
      this.m02, this.m12, this.m22, this.m32,
      this.m03, this.m13, this.m23, this.m33
    )
  }

  /**
   * @return {string}
   */
  toCssMatrix () {
    // css matrix is column major order
    return `matrix3d(${this.m00}, ${this.m01}, ${this.m02}, ${this.m03}, ${this.m10}, ${this.m11}, ${this.m12}, ${this.m13}, ${this.m20}, ${this.m21}, ${this.m22}, ${this.m23}, ${this.m30}, ${this.m31}, ${this.m32}, ${this.m33})`
  }
}
