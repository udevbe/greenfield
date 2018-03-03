'use strict'
import Mat4 from './math/Mat4'
import BufferedCanvas from './BrowserCanvas'

export default class BrowserSurfaceView {
  /**
   *
   * @param {BrowserSurface} browserSurface
   * @param {number} width
   * @param {number} height
   * @returns {BrowserSurfaceView}
   */
  static create (browserSurface, width, height) {
    const bufferedCanvas = BufferedCanvas.create(width, height)
    const browserSurfaceView = new BrowserSurfaceView(bufferedCanvas, browserSurface, Mat4.IDENTITY())
    bufferedCanvas.frontContext.canvas.view = browserSurfaceView
    bufferedCanvas.backContext.canvas.view = browserSurfaceView
    browserSurfaceView._armDrawPromise()
    return browserSurfaceView
  }

  /**
   * Use BrowserSurfaceView.create(..) instead.
   * @private
   * @param {BufferedCanvas}bufferedCanvas
   * @param {BrowserSurface}browserSurface
   * @param {Mat4} transformation
   */
  constructor (bufferedCanvas, browserSurface, transformation) {
    /**
     * @type {HTMLCanvasElement}
     */
    this.bufferedCanvas = bufferedCanvas
    /**
     * @type {BrowserSurface}
     */
    this.browserSurface = browserSurface
    /**
     * @type {Mat4}
     */
    this._transformation = transformation
    this.inverseTransformation = transformation.invert()
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

  set transformation (transformation) {
    this._transformation = transformation
    this.inverseTransformation = transformation.invert()
  }

  get transformation () {
    return this._transformation
  }

  applyTransformation () {
    this.bufferedCanvas.frontContext.canvas.style.transform = this.transformation.toCssMatrix()
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
    // FIXME adjust final transformation with additional transformations defined in the browser surface
    this.bufferedCanvas.drawBackBuffer(source, width, height, this.transformation)

    window.requestAnimationFrame((presentationTime) => {
      this.bufferedCanvas.swapBuffers()
      this._drawResolve(presentationTime)
      this._armDrawPromise()
    })
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
   * @param {Point} viewPoint point in view coordinates with respect to view transformations
   * @return {Point} point in browser coordinates
   */
  toBrowserSpace (viewPoint) {
    return this.transformation.timesPoint(viewPoint)
  }

  /**
   * @param {Point} browserPoint point in browser coordinates
   * @return {Point} point in view coordinates with respect to view transformations
   */
  toViewSpace (browserPoint) {
    // FIXME isn't this the same as toSurfaceSpace?
    return this.inverseTransformation.timesPoint(browserPoint)
  }

  /**
   * @param {Point} browserPoint point in browser coordinates
   * @return {Point}
   */
  toSurfaceSpace (browserPoint) {
    // FIXME adjust for surface<->buffer transformations
    return this.toViewSpace(browserPoint)
  }

  fadeOut () {
    this.bufferedCanvas.addCssClass('fadeToHidden')
  }

  destroy () {
    this._destroyResolve()
  }

  onDestroy () {
    return this._destroyPromise
  }
}
