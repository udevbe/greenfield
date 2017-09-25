'use strict'

export default class BrowserSurfaceView {
  /**
   *
   * @param {number} globalX
   * @param {number} globalY
   * @param {BrowserSurface} browserSurface
   * @returns {BrowserSurfaceView}
   */
  static create (globalX, globalY, browserSurface) {
    return new BrowserSurfaceView(globalX, globalY, browserSurface)
  }

  /**
   *
   * @param {number} globalX
   * @param {number} globalY
   * @param {BrowserSurface} browserSurface
   */
  constructor (globalX, globalY, browserSurface) {
    this.position = {x: globalX, y: globalY}
    this.browserSurface = browserSurface
    this.renderState = null
  }

  /**
   *
   * @param position
   * @param {number} position.x global x coordinate
   * @param {number} position.y global y coordinate
   */
  setPosition (position) {
    this.position = position
  }

  getTransform () {
    return [
      1, 0, 0, this.position.x,
      0, 1, 0, this.position.y,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]
  }
}
