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
    browserSurfaceView._armDrawPromise()
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

  /**
   * Use BrowserSurfaceView.create(..) instead.
   * @private
   * @param {HTMLCanvasElement}canvas
   * @param {CanvasRenderingContext2D}context2d
   * @param {BrowserSurface}browserSurface
   */
  constructor (canvas, context2d, browserSurface) {
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.context2d = context2d
    /**
     * @type {BrowserSurface}
     */
    this.browserSurface = browserSurface
    /**
     * @type {Array}
     * @private
     */
    this._drawListeners = []
    /**
     *
     * @type {Function}
     * @private
     */
    this._drawResolve = null
    /**
     * @type {Promise}
     * @private
     */
    this._drawPromise = null

    const browserPointer = this.browserSurface.browserSeat.browserPointer
    const browserSession = this.browserSurface.browserSession
    this._mouseEnterListener = browserSession.eventSource((event) => {
      event.preventDefault()
      browserPointer._onFocusGained(event)
    })
    this._mouseLeaveListener = browserSession.eventSource((event) => {
      event.preventDefault()
      browserPointer._onFocusLost(event)
    })
    /**
     * @type {Promise}
     * @private
     */
    this._destroyPromise = new Promise((resolve) => {
      this._destroyResolve = resolve
    })
  }

  /**
   * @param {HTMLImageElement }sourceImage
   */
  drawPNG (sourceImage) {
    if (sourceImage.complete && sourceImage.naturalHeight !== 0) {
      this._draw(sourceImage, sourceImage.naturalWidth, sourceImage.naturalHeight)
    } else {
      sourceImage.onload = () => {
        this._draw(sourceImage, sourceImage.naturalWidth, sourceImage.naturalHeight)
      }
    }
  }

  /**
   * @param {HTMLCanvasElement}sourceCanvas
   */
  drawCanvas (sourceCanvas) {
    this._draw(sourceCanvas, sourceCanvas.width, sourceCanvas.height)
  }

  /**
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap}source
   * @param {number}width
   * @param {number}height
   * @private
   */
  _draw (source, width, height) {
    this.canvas.width = width
    this.canvas.height = height
    this.context2d.drawImage(source, 0, 0)
    this._drawResolve(this)
    this._drawListeners.forEach(listener => {
      listener(this)
    })
    this._armDrawPromise()
  }

  _armDrawPromise () {
    this._drawResolve = null
    this._drawPromise = new Promise((resolve) => {
      this._drawResolve = resolve
    })
  }

  /**
   * One shot draw promise.
   * @return {Promise}
   */
  onDraw () {
    return this._drawPromise
  }

  /**
   * @param {Function}listener
   */
  addDrawListener (listener) {
    this._drawListeners.push(listener)
  }

  /**
   * @param {Function}listener
   */
  removeDrawListener (listener) {
    const index = this._drawListeners.indexOf(listener)
    if (index > -1) {
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
