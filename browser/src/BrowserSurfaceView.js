'use strict'
import Mat4 from './math/Mat4'
import BufferedCanvas from './BufferedCanvas'
import Vec4 from './math/Vec4'

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
    return browserSurfaceView
  }

  /**
   * @return {number}
   * @private
   */
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
  drawImage (sourceImage) {
    this._draw(sourceImage, sourceImage.naturalWidth, sourceImage.naturalHeight)
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
    const transformationUpdated = this._applyTransformations(this.bufferedCanvas.frontContext)
    if (transformationUpdated) {
      this._applyTransformationsChild()
    }
  }

  _applyTransformationsChild () {
    // find all child views who have this view as it's parent and update their transformation
    this.browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      if (browserSurfaceChild.browserSurface === this.browserSurface) {
        return
      }

      browserSurfaceChild.browserSurface.browserSurfaceViews.filter((browserSurfaceView) => {
        return browserSurfaceView.parent === this
      }).forEach((childView) => {
        childView.applyTransformations()
      })
    })
  }

  applyTransformationsBackBuffer () {
    const transformationUpdated = this._applyTransformations(this.bufferedCanvas.backContext)
    if (transformationUpdated) {
      this._applyTransformationsChildBackBuffer()
    }
  }

  _applyTransformationsChildBackBuffer () {
    // find all child views who have this view as it's parent and update their transformation
    this.browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      if (browserSurfaceChild.browserSurface === this.browserSurface) {
        return
      }

      browserSurfaceChild.browserSurface.browserSurfaceViews.filter((browserSurfaceView) => {
        return browserSurfaceView.parent === this
      }).forEach((childView) => {
        childView.applyTransformations()
      })
    })
  }

  /**
   * @param {CanvasRenderingContext2D}canvasContext
   * @return {boolean}
   * @private
   */
  _applyTransformations (canvasContext) {
    // TODO we might want to keep some 'transformation dirty' flags to avoid needless matrix multiplications

    // inherit parent transformation
    let parentTransformation = Mat4.IDENTITY()
    if (this._parent) {
      parentTransformation = this._parent.transformation
    }

    // position transformation
    const browserSurfaceChild = this.browserSurface.browserSurfaceChildSelf
    const {x, y} = browserSurfaceChild.position
    const positionTransformation = Mat4.translation(x, y)

    this.transformation = parentTransformation.timesMat4(positionTransformation)
    const bufferToViewTransformation = this.transformation.timesMat4(this.browserSurface.inverseBufferTransformation)

    // update canvas
    const newCssTransform = bufferToViewTransformation.toCssMatrix()
    if (newCssTransform !== canvasContext.canvas.style.transform) {
      canvasContext.canvas.style.transform = newCssTransform
      return true
    } else {
      return false
    }
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
    this.applyTransformationsBackBuffer()
    this.bufferedCanvas.drawBackBuffer(source, width, height)
  }

  swapBuffers () {
    this.bufferedCanvas.swapBuffers()
    // update child transformations as new parent buffer is visible
    this._applyTransformationsChild()
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
    return this._inverseTransformation.timesPoint(browserPoint)
  }

  /**
   * @param {Point} browserPoint point in browser coordinates
   * @return {Point}
   */
  toSurfaceSpace (browserPoint) {
    const viewPoint = this.toViewSpace(browserPoint)

    const canvas = this.bufferedCanvas.frontContext.canvas
    const boundingRect = canvas.getBoundingClientRect()
    const canvasWidth = boundingRect.width
    const canvasHeight = boundingRect.height
    const surfaceSize = this.browserSurface.size
    const surfaceWidth = surfaceSize.w
    const surfaceHeight = surfaceSize.h
    if (surfaceWidth === canvasWidth && surfaceHeight === canvasHeight) {
      return viewPoint
    } else {
      return Mat4.scalarVector(Vec4.create2D(surfaceWidth / canvasWidth, surfaceHeight / canvasHeight)).timesPoint(viewPoint)
    }
  }

  fadeOut () {
    this.bufferedCanvas.addCssClass('fadeToHidden')
  }

  destroy () {
    this.destroyed = true
    this._destroyResolve()
  }

  /**
   * @return {Promise}
   */
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
