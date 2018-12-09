'use strict'
import Mat4 from './math/Mat4'
import BufferedCanvas from './BufferedCanvas'
import Vec4 from './math/Vec4'
import Region from './Region'
import Renderer from './render/Renderer'

export default class View {
  /**
   *
   * @param {Surface} surface
   * @param {number} width
   * @param {number} height
   * @returns {View}
   */
  static create (surface, width, height) {
    const bufferedCanvas = BufferedCanvas.create(width, height)
    const view = new View(bufferedCanvas, surface, Mat4.IDENTITY())
    bufferedCanvas.view = view
    view.updateInputRegion()
    return view
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
   * Use View.create(..) instead.
   * @private
   * @param {BufferedCanvas}bufferedCanvas
   * @param {Surface}surface
   * @param {Mat4} transformation
   */
  constructor (bufferedCanvas, surface, transformation) {
    /**
     * @type {BufferedCanvas}
     */
    this.bufferedCanvas = bufferedCanvas
    /**
     * @type {Surface}
     */
    this.surface = surface
    /**
     * @type {?Mat4}
     */
    this.customTransformation = null
    /**
     * @type {Map<string, Mat4>}
     */
    this.userTransformations = new Map()
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
     * @type {View}
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
   * @param {View}parent
   */
  set parent (parent) {
    if (this.destroyed) { return }

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
    if (this.destroyed) { return }

    this._primary = primary
  }

  get primary () {
    if (this._primary) {
      return true
    } else if (this.parent) {
      return this.parent.primary
    } else {
      return false
    }
  }

  /**
   * @return {View}
   */
  get parent () {
    return this._parent
  }

  /**
   * @param {Mat4}transformation
   */
  set transformation (transformation) {
    if (this.destroyed) { return }

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
    if (this.destroyed) { return }

    const transformation = this._calculateTransformation()
    this.transformation = transformation
    const bufferToViewTransformation = transformation.timesMat4(this.surface.inverseBufferTransformation)
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
    this.surface.children.forEach((surfaceChild) => {
      if (surfaceChild.surface === this.surface) {
        return
      }

      surfaceChild.surface.views.filter((view) => {
        return view.parent === this
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
    const bufferToViewTransformation = transformation.timesMat4(this.surface.inverseBufferTransformation)
    // update canvas
    const newCssTransform = bufferToViewTransformation.toCssMatrix()
    this.bufferedCanvas.setBackBufferElementTransformation(newCssTransform)
  }

  /**
   * @return {Mat4}
   * @private
   */
  _calculateTransformation () {
    if (this.customTransformation) {
      return this.customTransformation
    }
    // TODO we might want to keep some 'transformation dirty' flags to avoid needless matrix multiplications

    // inherit parent transformation
    let parentTransformation = Mat4.IDENTITY()
    if (this._parent) {
      parentTransformation = this._parent.transformation
    }

    // position transformation
    const surfaceChild = this.surface.surfaceChildSelf
    const { x, y } = surfaceChild.position
    const positionTransformation = Mat4.translation(x, y)

    return parentTransformation.timesMat4(positionTransformation)
  }

  withUserTransformations (transformation) {
    let finalTransformation = transformation
    this.userTransformations.forEach(value => finalTransformation = transformation.timesMat4(value))
    return finalTransformation
  }

  raise () {
    if (this.destroyed) { return }

    this.zIndex = View._nextTopZIndex()
    this.surface.updateChildViewsZIndexes()
  }

  /**
   * @param {number}index
   */
  set zIndex (index) {
    if (this.destroyed) { return }

    if (index >= View._topZIndex) {
      View._topZIndex = index
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
    if (this.destroyed) { return }

    // FIXME adjust final transformation with additional transformations defined in the surface
    this._applyTransformationsBackBuffer()
    this.bufferedCanvas.drawBackBuffer(image)
  }

  /**
   * @param {RenderFrame}renderFrame
   */
  swapBuffers (renderFrame) {
    if (this.destroyed) { return }

    this.transformation = this._backBufferTransformation
    renderFrame.then(() => {
      if (this.destroyed) { return }

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
  toViewSpaceFromBrowser (browserPoint) {
    return this._inverseTransformation.timesPoint(browserPoint)
  }

  toViewSpaceFromSurface (surfacePoint) {
    const canvas = this.bufferedCanvas.frontContext.canvas
    const boundingRect = canvas.getBoundingClientRect()
    const canvasWidth = Math.round(boundingRect.width)
    const canvasHeight = Math.round(boundingRect.height)
    const surfaceSize = this.surface.size
    const surfaceWidth = surfaceSize.w
    const surfaceHeight = surfaceSize.h
    if (surfaceWidth === canvasWidth && surfaceHeight === canvasHeight) {
      return surfacePoint
    } else {
      return Mat4.scalarVector(Vec4.create2D(canvasWidth / surfaceWidth, canvasHeight / surfaceHeight)).timesPoint(surfacePoint)
    }
  }

  /**
   * @param {Point} browserPoint point in browser coordinates
   * @return {Point}
   */
  toSurfaceSpace (browserPoint) {
    const viewPoint = this.toViewSpaceFromBrowser(browserPoint)

    const canvas = this.bufferedCanvas.frontContext.canvas
    const boundingRect = canvas.getBoundingClientRect()
    const canvasWidth = Math.round(boundingRect.width)
    const canvasHeight = Math.round(boundingRect.height)
    const surfaceSize = this.surface.size
    const surfaceWidth = surfaceSize.w
    const surfaceHeight = surfaceSize.h
    if (surfaceWidth === canvasWidth && surfaceHeight === canvasHeight) {
      return viewPoint
    } else {
      return Mat4.scalarVector(Vec4.create2D(surfaceWidth / canvasWidth, surfaceHeight / canvasHeight)).timesPoint(viewPoint)
    }
  }

  show () {
    if (this.destroyed) { return }

    this.bufferedCanvas.containerDiv.style.display = 'contents'
  }

  hide () {
    if (this.destroyed) { return }

    this.bufferedCanvas.containerDiv.style.display = 'none'
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
    if (this.destroyed) { return }

    this.bufferedCanvas.attachToElement(element)

    // attach child views
    this.surface.children.forEach((surfaceChild) => {
      surfaceChild.surface.views.filter((childView) => {
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
    if (this.destroyed) { return }

    const inputPixmanRegion = this.surface.state.inputPixmanRegion
    const surfacePixmanRegion = this.surface.pixmanRegion
    Region.intersect(inputPixmanRegion, inputPixmanRegion, surfacePixmanRegion)
    const inputRectangles = Region.rectangles(inputPixmanRegion)
    this.bufferedCanvas.updateInputRegionElements(inputRectangles)
  }
}

/**
 * @type {number}
 * @private
 */
View._topZIndex = 20
