'use strict'

import Point from './math/Point'

export default class BrowserSurfaceChild {
  /**
   * @param {BrowserSurface} browserSurface
   * @return {BrowserSurfaceChild}
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
    // TODO emit event so child views can update their position
  }

  /**
   * @return {Point}
   */
  get position () {
    return this._position
  }
}
