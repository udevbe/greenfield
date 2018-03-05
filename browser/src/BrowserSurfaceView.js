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
    /**
     * @type {BrowserSurfaceView}
     * @private
     */
    this._parent = null
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
   * @param {BrowserSurfaceView}parent
   */
  set parent (parent) {
    this._parent = parent

    // get global (browser) position of new child view, based on the relative position of the child (relative to us)
    const browserSurfaceChild = parent.browserSurface.browserSurfaceChildren.find((browserSurfaceChild) => {
      return browserSurfaceChild.browserSurface === this.browserSurface
    })

    this.syncTransformationToParent(browserSurfaceChild.position)
  }

  syncTransformationToParent (childPosition) {
    // FIXME this cancels out any special transformations that were set on the child view as the child now
    // inherits the parent's transformations. A solution is to store these transformations in a separate field and
    // apply them here again.
    const {x, y} = this.parent.toBrowserSpace(childPosition)
    this.transformation = Mat4.translation(x, y).timesMat4(this.parent.transformation)
    this.applyTransformation()
  }

  /**
   * @return {BrowserSurfaceView}
   */
  get parent () {
    return this._parent
  }

  set transformation (transformation) {
    this._transformation = transformation
    this.inverseTransformation = transformation.invert()
  }

  get transformation () {
    return this._transformation
  }

  applyTransformation () {
    // We could be doing a transform on the back-buffer and wait for animation frame before doing as swap.
    // However this has some performance implications as we'd also have to keep both buffer contents in sync.
    // As for new we just do it immediately on the front-buffer. If it has noticeable visual artifact we might
    // consider using the back-buffer method.

    this.bufferedCanvas.frontContext.canvas.style.transform = this.transformation.toCssMatrix()

    // find all child views who have this view as it's parent and update their transformation
    this.browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      const childViews = browserSurfaceChild.browserSurface.browserSurfaceViews.filter((browserSurfaceView) => {
        return browserSurfaceView.parent === this || browserSurfaceView === this
      })

      childViews.forEach((childView) => {
        childView.syncTransformationToParent(browserSurfaceChild.position)
      })
    })
  }

  raise () {
    // See remark in applyTransformation. Same applies here.

    // raise all child views in order they are declared in the browserSurfaceChildren list
    this.browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      const childViews = browserSurfaceChild.browserSurface.browserSurfaceViews.filter((childView) => {
        return childView.parent === this || childView === this
      })
      childViews.forEach((childView) => {
        this.bufferedCanvas.zIndex = BrowserSurfaceView._nextTopZIndex()
        childView.raise()
      })
    })
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

/**
 *
 * @type {number}
 * @private
 */
BrowserSurfaceView._topZIndex = 0
