'use strict'

export default class BrowserSurfaceView {
  /**
   *
   * @param {BrowserSurface} browserSurface
   * @returns {BrowserSurfaceView}
   */
  static create (browserSurface) {
    const canvas = this._createCanvas()
    const ctx = canvas.getContext('2d')

    return new BrowserSurfaceView(browserSurface, canvas, ctx)
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
   * @param ctx
   */
  constructor (browserSurface, canvas, ctx) {
    this.browserSurface = browserSurface
    this.renderState = null
    this.canvas = canvas
    this.ctx = ctx
  }

  /**
   *
   * @param {ImageData} imageData
   */
  draw (imageData) {
    this.ctx.putImageData(imageData, 0, 0)
  }

  get pixelBuffer () {
    if (!this._pixelBuffer || this._pixelBuffer.length !== this.canvas.width * this.canvas.height * 4) {
      this._pixelBuffer = new Uint8Array(this.canvas.width * this.canvas.height * 4)
    }
    return this._pixelBuffer
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
