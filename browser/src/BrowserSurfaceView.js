'use strict'
import Mat4 from './math/Mat4'
import BufferedCanvas from './BufferedCanvas'
import Vec4 from './math/Vec4'
import BrowserRegion from './BrowserRegion'
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
    bufferedCanvas.view = browserSurfaceView
    browserSurfaceView.updateInputRegion()
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
    this._backBufferTransformation = transformation
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
    /**
     * @type {boolean}
     * @private
     */
    this._primary = false
  }

  /**
   * @param {BrowserSurfaceView}parent
   */
  set parent (parent) {
    if (this.destroyed) {
      return
    }
    this._parent = parent

    if (this._parent) {
      this.primary = parent.primary

      parent.onDestroy().then(() => {
        if (this.parent === parent) {
          this.destroy()
          this.parent = null
        }
      })
      const renderFrame = Renderer.createRenderFrame()
      this.applyTransformations(renderFrame)
      renderFrame.fire()
      if (this._parent.isAttached()) {
        this.attachTo(this._parent.parentElement())
      } else {
        this.detach()
      }
    }
  }

  set primary (primary) {
    if (this.destroyed) {
      return
    }
    this._primary = primary
    this.browserSurface.browserSurfaceChildren.forEach(browserSurfaceChild => {
      if (browserSurfaceChild === this.browserSurface.browserSurfaceChildSelf) return
      browserSurfaceChild.browserSurface.browserSurfaceViews.filter(browserSurfaceView => {
        return browserSurfaceView.parent === this
      }).forEach(browserSurfaceView => {
        browserSurfaceView.primary = primary
      })
    })
  }

  get primary () {
    return this._primary
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
    if (this.destroyed) {
      return
    }
    this._transformation = transformation
    this._inverseTransformation = transformation.invert()
  }

  /**
   * @return {Mat4}
   */
  get transformation () {
    return this._transformation
  }

  /**
   * @param {RenderFrame}renderFrame
   */
  applyTransformations (renderFrame) {
    if (this.destroyed) {
      return
    }
    const transformation = this._calculateTransformation()
    this.transformation = transformation
    const bufferToViewTransformation = transformation.timesMat4(this.browserSurface.inverseBufferTransformation)
    // update canvas
    const newCssTransform = bufferToViewTransformation.toCssMatrix()
    renderFrame.then(() => {
      this.bufferedCanvas.setElementTransformation(newCssTransform)
    })
    this._applyTransformationsChild(renderFrame)
  }

  /**
   * @param renderFrame
   * @private
   */
  _applyTransformationsChild (renderFrame) {
    // find all child views who have this view as it's parent and update their transformation
    this.browserSurface.browserSurfaceChildren.forEach((browserSurfaceChild) => {
      if (browserSurfaceChild.browserSurface === this.browserSurface) {
        return
      }

      browserSurfaceChild.browserSurface.browserSurfaceViews.filter((browserSurfaceView) => {
        return browserSurfaceView.parent === this
      }).forEach((childView) => {
        childView.applyTransformations(renderFrame)
      })
    })
  }

  /**
   * @private
   */
  _applyTransformationsBackBuffer () {
    const transformation = this._calculateTransformation()
    this._backBufferTransformation = transformation
    const bufferToViewTransformation = transformation.timesMat4(this.browserSurface.inverseBufferTransformation)
    // update canvas
    const newCssTransform = bufferToViewTransformation.toCssMatrix()
    this.bufferedCanvas.setBackBufferElementTransformation(newCssTransform)
  }

  /**
   * @return {Mat4}
   * @private
   */
  _calculateTransformation () {
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

    return parentTransformation.timesMat4(positionTransformation)
  }

  raise () {
    if (this.destroyed) {
      return
    }
    this.zIndex = BrowserSurfaceView._nextTopZIndex()
    this.browserSurface.updateChildViewsZIndexes()
  }

  /**
   * @param {number}index
   */
  set zIndex (index) {
    if (this.destroyed) {
      return
    }
    if (index >= BrowserSurfaceView._topZIndex) {
      BrowserSurfaceView._topZIndex = index
    }
    this.bufferedCanvas.zIndex = index
  }

  /**
   * @return {number}
   */
  get zIndex () {
    return window.parseInt(this.bufferedCanvas.frontContext.canvas.style.zIndex, 10)
  }

  /**
   * @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|ImageBitmap}image
   */
  draw (image) {
    if (this.destroyed) {
      return
    }
    // FIXME adjust final transformation with additional transformations defined in the browser surface
    this._applyTransformationsBackBuffer()
    this.bufferedCanvas.drawBackBuffer(image)
  }

  /**
   * @param {RenderFrame}renderFrame
   */
  swapBuffers (renderFrame) {
    if (this.destroyed) {
      return
    }
    this.transformation = this._backBufferTransformation
    renderFrame.then(() => {
      this.bufferedCanvas.swapBuffers()
    })
    // update child transformations as new parent buffer is visible
    this._applyTransformationsChild(renderFrame)
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
    const canvasWidth = Math.round(boundingRect.width)
    const canvasHeight = Math.round(boundingRect.height)
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

  show () {
    if (this.destroyed) {
      return
    }
    this.bufferedCanvas.removeCssClass('fadeToHidden')
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
    return this.bufferedCanvas.isAttachedToElement()
  }

  /**
   * @param {HTMLElement}element
   */
  attachTo (element) {
    if (this.destroyed) {
      return
    }
    this.bufferedCanvas.attachToElement(element)

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
    this.bufferedCanvas.detachFromElement()
  }

  updateInputRegion () {
    if (this.destroyed) {
      return
    }
    const inputPixmanRegion = this.browserSurface.state.inputPixmanRegion
    const surfacePixmanRegion = this.browserSurface.pixmanRegion
    BrowserRegion.intersect(inputPixmanRegion, inputPixmanRegion, surfacePixmanRegion)
    const inputRectangles = BrowserRegion.rectangles(inputPixmanRegion)
    this.bufferedCanvas.updateInputRegionElements(inputRectangles)
  }
}

/**
 * @type {number}
 * @private
 */
BrowserSurfaceView._topZIndex = 20
