'use strict'
import Vect4 from './math/Vect4'
import Mat4 from './math/Mat4'

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

    const browserSurfaceView = new BrowserSurfaceView(canvas, context2d, browserSurface)
    canvas.view = browserSurfaceView
    return browserSurfaceView
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
    canvas.addEventListener('mouseenter', (event) => {
      browserPointer.onMouseEnter(event, browserSurface)
    }, true)
    canvas.addEventListener('mouseleave', () => {
      browserPointer.onMouseLeave(browserSurface)
    }, true)
    // other mouse listeners are set in the browser pointer class
  }

  /**
   * @private
   * @param canvas
   * @param context2d
   * @param browserSurface
   */
  constructor (canvas, context2d, browserSurface) {
    this.canvas = canvas
    this.context2d = context2d
    this.browserSurface = browserSurface
  }

  /**
   * @param {Point} canvasPoint
   * @return {Point}
   */
  toSurfaceSpace (canvasPoint) {
    const surfaceWidth = this.browserSurface.size.w
    const surfaceHeight = this.browserSurface.size.h
    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height

    const scalarVector = Vect4.create(surfaceWidth / canvasWidth, surfaceHeight / canvasHeight, 1, 1)

    return Mat4.scalarVector(scalarVector).timesPoint(canvasPoint)
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
