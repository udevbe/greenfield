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
    this._setupMouseListeners(canvas, browserSurface)

    return new BrowserSurfaceView(canvas, context2d)
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

  static _setupMouseListeners (canvas, browserSurface) {
    const browserPointer = browserSurface.browserSeat.browserPointer
    canvas.addEventListener('mousedown', (event) => {
      browserPointer.onMouseDown(event, browserSurface)
    }, true)
    canvas.addEventListener('mouseenter', (event) => {
      browserPointer.onMouseEnter(event, browserSurface)
    }, true)
    canvas.addEventListener('mouseleave', (event) => {
      browserPointer.onMouseLeave(event, browserSurface)
    }, true)
    // other mouse listeners are set in the browser pointer class
  }

  /**
   *
   * @param canvas
   * @param context2d
   */
  constructor (canvas, context2d) {
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

  fade () {
    this._fade(1)
  }

  _fade (opacity) {
    if (opacity > 0.1) {
      window.requestAnimationFrame(() => {
        this._fade(opacity)
      })
    } else {
      document.body.removeChild(this.canvas)
    }
    this.canvas.style.opacity = opacity
    this.canvas.style.filter = 'alpha(opacity=' + opacity * 100 + ')'
    opacity *= 0.8
  }

  destroy () {
    this.fade()
  }
}
