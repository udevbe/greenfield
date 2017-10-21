'use strict'

export default class BrowserSurfaceView {
  /**
   *
   * @param {BrowserSurface} browserSurface
   * @returns {BrowserSurfaceView}
   */
  static create (browserSurface) {
    const canvas = this._createCanvas()
    return new BrowserSurfaceView(browserSurface, canvas)
  }

  /**
   * @returns {HTMLCanvasElement}
   * @private
   */
  static _createCanvas () {
    const canvas = document.createElement('canvas')
    canvas.style.left = '0px'
    canvas.style.top = '0px'
    canvas.style.position = 'relative'
    document.body.appendChild(canvas)
    return canvas
  }

  /**
   *
   * @param {BrowserSurface} browserSurface
   * @param canvas
   */
  constructor (browserSurface, canvas) {
    this.browserSurface = browserSurface
    this.renderState = null
    this.canvas = canvas
  }
}
