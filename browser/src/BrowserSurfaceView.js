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
    canvas.style.position = 'absolute'
    canvas.style.zIndex = 0
    return canvas
  }

  enableMouseListeners () {
    this.canvas.addEventListener('mouseenter', this._mouseEnterListener, true)
    this.canvas.addEventListener('mouseleave', this._mouseLeaveListener, true)
    // other mouse listeners are set in the browser pointer class
  }

  disableMouseListeners () {
    this.canvas.removeEventListener('mouseenter', this._mouseEnterListener, true)
    this.canvas.removeEventListener('mouseleave', this._mouseLeaveListener, true)
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
    this._drawListeners = []

    const browserPointer = this.browserSurface.browserSeat.browserPointer
    const browserSession = this.browserSurface.browserSession
    this._mouseEnterListener = browserSession.eventSource((event) => {
      browserPointer.onMouseEnter(event)
    })
    this._mouseLeaveListener = browserSession.eventSource((event) => {
      browserPointer.onMouseLeave(event)
    })

    this._destroyPromise = new Promise((resolve) => {
      this._destroyResolve = resolve
    })
  }

  draw (sourceCanvas) {
    this.canvas.width = sourceCanvas.width
    this.canvas.height = sourceCanvas.height
    this.context2d.drawImage(sourceCanvas, 0, 0)
    this._drawListeners.forEach(listener => {
      listener(this)
    })
  }

  addDrawListener (listener) {
    this._drawListeners.push(listener)
  }

  removeDrawListener (listener) {
    const index = this._drawListeners.indexOf(listener)
    if (index > 0) {
      this._drawListeners.splice(index, 1)
    }
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

    if (canvasWidth === surfaceWidth && canvasHeight === surfaceHeight) {
      return canvasPoint
    }

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
    }
    this.canvas.style.opacity = opacity
    this.canvas.style.filter = 'alpha(opacity=' + opacity * 100 + ')'
    opacity *= 0.8
  }

  destroy () {
    this._destroyResolve()
  }

  onDestroy () {
    return this._destroyPromise
  }

}
