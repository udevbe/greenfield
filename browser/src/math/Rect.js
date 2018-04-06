'use strict'

export default class Rect {
  /**
   * @param {Number} x0 top left x
   * @param {Number} y0 top left y
   * @param {Number} x1 bottom right x
   * @param {Number} y1 bottom right y
   * @returns {Rect}
   */
  static create (x0, y0, x1, y1) {
    if (x0 > x1) {
      throw new Error('x1 must be greater than x0')
    }
    if (y0 > y1) {
      throw new Error('y1 must be greater than y0')
    }
    return new Rect(x0, y0, x1, y1)
  }

  /**
   * @param {Number} x0
   * @param {Number} y0
   * @param {Number} x1
   * @param {Number} y1
   * @returns {Rect}
   */
  constructor (x0, y0, x1, y1) {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
  }
}
