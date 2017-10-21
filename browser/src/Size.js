'use strict'

/**
 * Represents a 2-dimensional size value.
 */

export default class Size {
  static create (width, height) {
    return new Size(width, height)
  }

  /**
   *
   * @param {number} w
   * @param {height} h
   */
  constructor (w, h) {
    this.w = w
    this.h = h
  }

  /**
   *
   * @returns {string}
   */
  toString () {
    return '(' + this.w + ', ' + this.h + ')'
  }

  /**
   *
   * @returns {Size}
   */
  getHalfSize () {
    return new Size(this.w >>> 1, this.h >>> 1)
  }
}
