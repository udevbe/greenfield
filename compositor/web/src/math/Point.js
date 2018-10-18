'use strict'

import Vec4 from './Vec4'

export default class Point {
  /**
   * @param {number }x
   * @param {number} y
   * @returns {Point}
   */
  static create (x, y) {
    return new Point(x, y)
  }

  /**
   *
   * @param {number}x
   * @param {number}y
   */
  constructor (x, y) {
    /**
     * @type {number}
     */
    this.x = x
    /**
     * @type {number}
     */
    this.y = y
  }

  /**
   * @returns {Vec4}
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
