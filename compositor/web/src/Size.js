'use strict'

/**
 * Represents a 2-dimensional size value.
 */

export default class Size {
  /**
   *
   * @param {number} width
   * @param {number} height
   * @returns {Size}
   */
  static create (width, height) {
    return new Size(width, height)
  }

  /**
   * @param {number} w
   * @param {number} h
   */
  constructor (w, h) {
    /**
     * @type {number}
     */
    this.w = w
    /**
     * @type {number}
     */
    this.h = h
  }

  /**
   * @returns {string}
   */
  toString () {
    return '(' + this.w + ', ' + this.h + ')'
  }

  /**
   * @returns {Size}
   */
  getHalfSize () {
    return new Size(this.w >>> 1, this.h >>> 1)
  }

  /**
   * @param {Size}size
   * @return {boolean}
   */
  equals (size) {
    return size.w === this.w && size.h === this.h
  }
}
