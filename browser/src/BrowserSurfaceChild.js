'use strict'

import Point from './math/Point'
import Mat4 from './math/Mat4'

export default class BrowserSurfaceChild {
  /**
   * Use browserSurface.browserSurfaceChildSelf
   * @param {BrowserSurface} browserSurface
   * @return {BrowserSurfaceChild}
   * @private
   */
  static create (browserSurface) {
    return new BrowserSurfaceChild(browserSurface)
  }

  /**
   * @param {BrowserSurface} browserSurface
   */
  constructor (browserSurface) {
    /**
     * @type {BrowserSurface}
     */
    this.browserSurface = browserSurface
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
