import Point from './Point'

export default class Vect4 {
  /**
   * @param x
   * @param y
   * @param z
   * @param w
   * @returns {Vect4}
   */
  static create (x,
                 y,
                 z,
                 w) {
    return new Vect4(x, y, z, w)
  }

  static create2D (x, y) {
    return this.create(x, y, 1, 1)
  }

  /**
   * @param {Number }x
   * @param {Number} y
   * @param {Number} z
   * @param {Number} w
   */
  constructor (x,
               y,
               z,
               w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  /**
   * @param {Vect4} right
   * @returns {Vect4}
   */
  plus (right) {
    return Vect4.create(
      this.x + right.x,
      this.y + right.y,
      this.z + right.z,
      this.w + right.w
    )
  }

  /**
   * @param {Vect4} right
   * @returns {Vect4}
   */
  minus (right) {
    return Vect4.create(
      this.x - right.x,
      this.y - right.y,
      this.z - right.z,
      this.w - right.w
    )
  }

  /**
   * @returns {Point}
   */
  toPoint () {
    return Point.create(this.x, this.y)
  }
}
