'use strict'

import Vec4 from './Vect4'

export default class Point {
  /**
   * @param {Number }x
   * @param {Number} y
   * @returns {Point}
   */
  static create (x, y) {
    return new Point(x, y)
  }

  /**
   *
   * @param {Number}x
   * @param {Number}y
   */
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  /**
   * @returns {Vect4}
   */
  toVec4 () {
    return Vec4.create(
      this.x,
      this.y,
      0,
      1)
  }

  /**
   * @param {Point} right
   * @returns {Point}
   */
  plus (right) {
    return Point.create(
      this.x + right.x,
      this.y + right.y
    )
  }

  /**
   * @param {Point} right
   * @returns {Point}
   */
  minus (right) {
    return Point.create(
      this.x - right.x,
      this.y - right.y
    )
  }
}
