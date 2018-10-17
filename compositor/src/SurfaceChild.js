'use strict'

import Point from './math/Point'

export default class SurfaceChild {
  /**
   * Use surface.SurfaceChildSelf instead.
   * @param {Surface} surface
   * @return {SurfaceChild}
   * @private
   */
  static create (surface) {
    return new SurfaceChild(surface)
  }

  /**
   * @param {Surface} surface
   * @private
   */
  constructor (surface) {
    /**
     * @type {Surface}
     */
    this.surface = surface
    /**
     * @type {Point}
     * @private
     */
    this._position = Point.create(0, 0)
  }

  /**
   * @param {Point} relativePoint
   */
  set position (relativePoint) {
    this._position = relativePoint
  }

  /**
   * @return {Point}
   */
  get position () {
    return this._position
  }
}
