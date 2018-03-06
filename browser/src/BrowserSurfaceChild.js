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
    const deltaX = relativePoint.x - this._position.x
    const deltaY = relativePoint.y - this._position.y
    this._position = relativePoint
    this.browserSurface.browserSurfaceViews.forEach((view) => {
      view.transformation = view.transformation.timesMat4(Mat4.translation(deltaX, deltaY))
      view.applyTransformation()
    })
  }

  /**
   * @return {Point}
   */
  get position () {
    return this._position
  }
}
