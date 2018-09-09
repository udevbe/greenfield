import Point from './Point'

export default class Vec4 {
  /**
   * @param {number}x
   * @param {number}y
   * @param {number}z
   * @param {number}w
   * @returns {Vec4}
   */
  static create (x, y, z, w) {
    return new Vec4(x, y, z, w)
  }

  static create2D (x, y) {
    return this.create(x, y, 1, 1)
  }

  /**
   * @param {number}x
   * @param {number}y
   * @param {number}z
   * @param {number}w
   */
  constructor (x, y, z, w) {
    this.x = x
    this.y = y
    this.z = z
    this.w = w
  }

  /**
   * @param {Vec4} right
   * @returns {Vec4}
   */
  plus (right) {
    return Vec4.create(
      this.x + right.x,
      this.y + right.y,
      this.z + right.z,
      this.w + right.w
    )
  }

  /**
   * @param {Vec4} right
   * @returns {Vec4}
   */
  minus (right) {
    return Vec4.create(
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
