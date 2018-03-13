'use strict'
import Mat4 from './math/Mat4'
import BufferedCanvas from './BufferedCanvas'
import Renderer from './render/Renderer'

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

  static _nextTopZIndex () {
    this._topZIndex++
    return this._topZIndex
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
     * @type {BufferedCanvas}
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
    /**
     * @type {Mat4}
     */
    this._inverseTransformation = transformation.invert()
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
    /**
     * @type {boolean}
     */
    this.destroyed = false
    /**
     * @type {BrowserSurfaceView}
     * @private
     */
    this._parent = null
  }

  /**
   * @param {HTMLImageElement}sourceImage
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
   * @param {BrowserSurfaceView}parent
   */
  set parent (parent) {
    this._parent = parent

    if (this._parent) {
      parent.onDestroy().then(() => {
        if (this.parent === parent) {
          this.destroy()
          this.parent = null
        }
      })

      this.applyTransformations()
      if (this._parent.isAttached()) {
        this.attachTo(this._parent.parentElement())
      } else {
        this.detach()
      }
    }
  }

  /**
   * @return {BrowserSurfaceView}
   */
  get parent () {
    return this._parent
  }

  /**
   * @param {Mat4}transformation
   */
  set transformation (transformation) {
    this._transformation = transformation
    this._inverseTransformation = transformation.invert()
  }

  /**
   * @return {Mat4}
   */
  get transformation () {
    return this._transformation
  }

  applyTransformations () {
    this._applyTransformations(this.bufferedCanvas.frontContext)
  }

  _applyTransformations (canvasContext) {
    // We could be doing a transform on the back-buffer and wait for animation frame before doing as swap.
    // However this has some performance implications as we'd also have to keep both buffer contents in sync.
    // As for now we just do it immediately on the front-buffer. If it has noticeable visual artifact we might
    // consider using the back-buffer method.

    // inherit parent transformation
    let parentTransformation = Mat4.IDENTITY()
    if (this._parent) {
      parentTransformation = this._parent.transformation
    }

    // setup position
    const browserSurfaceChild = this.browserSurface.browserSurfaceChildSelf
    const {x, y} = browserSurfaceChild.position
    const positionTransformation = Mat4.translation(x, y)

    // TODO other transformations

    // store final transformation
    this.transformation = parentTransformation.timesMat4(positionTransformation)

    // update canvas
    canvasContext.canvas.style.transform = this.transformation.toCssMatrix()

    // find all child views who have this view as it's parent and update their transformation
    this.browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      const childViews = browserSurfaceChild.browserSurface.browserSurfaceViews.filter((browserSurfaceView) => {
        return browserSurfaceView.parent === this
      })

      childViews.forEach((childView) => {
        childView.applyTransformations()
      })
    })
  }

  raise () {
    this.zIndex = BrowserSurfaceView._nextTopZIndex()
    this.browserSurface.updateChildViewsZIndexes()
  }

  /**
   * @param {number}index
   */
  set zIndex (index) {
    if (index >= BrowserSurfaceView._topZIndex) {
      BrowserSurfaceView._topZIndex = index
    }
    this.bufferedCanvas.zIndex = index
  }

  /**
   * @return {number}
   */
  get zIndex () {
    return parseInt(this.bufferedCanvas.frontContext.canvas.style.zIndex, 10)
  }

  /**
   * @param {HTMLCanvasElement}sourceCanvas
   */
  async drawCanvas (sourceCanvas) {
    await this._draw(sourceCanvas, sourceCanvas.width, sourceCanvas.height)
  }

  /**
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap}source
   * @param {number}width
   * @param {number}height
   * @private
   */
  async _draw (source, width, height) {
    // FIXME adjust final transformation with additional transformations defined in the browser surface
    this.bufferedCanvas.drawBackBuffer(source, width, height, this.transformation)
    this._applyTransformations(this.bufferedCanvas.backContext)

    const presentationTime = await Renderer.onAnimationFrame()
    this.bufferedCanvas.swapBuffers()
    this._drawResolve(presentationTime)
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
  async onDraw () {
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
    return this._inverseTransformation.timesPoint(browserPoint)
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
    this.destroyed = true
    this._destroyResolve()
  }

  onDestroy () {
    return this._destroyPromise
  }

  isAttached () {
    return this.bufferedCanvas.frontContext.canvas.parentElement && this.bufferedCanvas.backContext.canvas.parentElement
  }

  /**
   * @param {HTMLElement}element
   */
  attachTo (element) {
    if (!this.bufferedCanvas.frontContext.canvas.parentElement) {
      element.appendChild(this.bufferedCanvas.frontContext.canvas)
    }
    if (!this.bufferedCanvas.backContext.canvas.parentElement) {
      element.appendChild(this.bufferedCanvas.backContext.canvas)
    }

    // attach child views
    this.browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      browserSurfaceChild.browserSurface.browserSurfaceViews.filter((childView) => {
        return childView.parent === this
      }).forEach((childView) => {
        childView.attachTo(element)
      })
    })
  }

  /**
   * @return {HTMLElement}
   */
  parentElement () {
    return this.bufferedCanvas.frontContext.canvas.parentElement
  }

  detach () {
    this._removeCanvas(this.bufferedCanvas.frontContext)
    this._removeCanvas(this.bufferedCanvas.backContext)
  }

  _removeCanvas (context) {
    const canvas = context.canvas
    const parent = canvas.parentElement
    if (parent) {
      parent.removeChild(canvas)
    }
  }
}

/**
 * @type {number}
 * @private
 */
BrowserSurfaceView._topZIndex = 20
