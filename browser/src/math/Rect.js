export default class Rect {
  /**
   * @param {Number} x0
   * @param {Number} y0
   * @param {Number} x1
   * @param {Number} y1
   * @returns {Rect}
   */
  static create (x0, y0, x1, y1) {
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
