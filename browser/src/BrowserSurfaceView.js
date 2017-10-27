'use strict'

export default class BrowserSurfaceView {
  /**
   *
   * @param {BrowserSurface} browserSurface
   * @returns {BrowserSurfaceView}
   */
  static create (browserSurface) {
    const canvas = this._createCanvas()
    const context2d = canvas.getContext('2d')

    return new BrowserSurfaceView(browserSurface, canvas, context2d)
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
   * @param context2d
   */
  constructor (browserSurface, canvas, context2d) {
    this.browserSurface = browserSurface
    this.canvas = canvas
    this.context2d = context2d
  }

  unfade () {
    this._unfade(0.08)
  }

  _unfade (opacity) {
    if (opacity < 1) {
      window.requestAnimationFrame(() => {
        this._unfade(opacity)
      })
    }
    this.canvas.style.opacity = opacity
    this.canvas.style.filter = 'alpha(opacity=' + opacity * 100 + ')'
    opacity *= 1.1
  }
}
