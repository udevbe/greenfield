'use strict'

import Size from './Size'

/**
 * A double buffered canvas. Required as canvas resizing & css transform is not atomic and can result in flickering.
 * This class has 2 canvasses that can be swapped. Ideally one would render to the invisible 'back' canvas, once done
 * a call to requestAnimation frame can be used to perform a swapBuffers(). This will make the 'back' canvas the 'front'
 * canvas, and effectively make it visible. The 'front' canvas will then become the 'back' canvas.
 */
export default class BufferedCanvas {
  /**
   * @param width
   * @param height
   * @return {BufferedCanvas}
   */
  static create (width, height) {
    const frontCanvas = document.createElement('canvas')
    frontCanvas.width = width
    frontCanvas.height = height
    frontCanvas.style.position = 'absolute'
    frontCanvas.style.display = 'inline'
    frontCanvas.style.zIndex = '0'
    const frontContext = frontCanvas.getContext('2d')
    frontContext.imageSmoothingEnabled = false

    const backCanvas = document.createElement('canvas')
    backCanvas.width = width
    backCanvas.height = height
    backCanvas.style.position = 'absolute'
    backCanvas.style.display = 'none'
    backCanvas.style.zIndex = '0'
    const backContext = backCanvas.getContext('2d')
    backContext.imageSmoothingEnabled = false

    return new BufferedCanvas(frontContext, backContext)
  }

  constructor (frontContext, backContext) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.frontContext = frontContext
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.backContext = backContext
  }

  /**
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap}source
   * @param {number}width
   * @param {number}height
   */
  drawBackBuffer (source, width, height) {
    this._draw(this.backContext, source, width, height)
  }

  /**
   * @param {CanvasRenderingContext2D} context2d
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap}source
   * @param {number}width
   * @param {number}height
   * @private
   */
  _draw (context2d, source, width, height) {
    const canvas = context2d.canvas
    if (canvas.width !== width || canvas.height !== height) {
      // resizing clears the canvas
      canvas.width = width
      canvas.height = height
    } else {
      context2d.clearRect(0, 0, canvas.width, canvas.height)
    }
    context2d.drawImage(source, 0, 0)
  }

  swapBuffers () {
    // swap canvasses
    const oldFront = this.frontContext
    this.frontContext = this.backContext
    this.backContext = oldFront

    // make back canvas invisible
    this.backContext.canvas.style.display = 'none'
    // make new front canvas visible
    this.frontContext.canvas.style.display = 'inline'

    // make sure the new back canvas has the same transformation as the new front canvas
    this.backContext.canvas.style.transform = this.frontContext.canvas.style.transform
  }

  /**
   * @param {number}index
   */
  set zIndex (index) {
    this.backContext.canvas.style.zIndex = index.toString(10)
    this.frontContext.canvas.style.zIndex = index.toString(10)
  }

  /**
   * @return {Size}
   */
  size () {
    return Size.create(this.frontContext.canvas.width, this.frontContext.canvas.height)
  }

  /**
   * @param {string}cssClass
   */
  addCssClass (cssClass) {
    this.frontContext.canvas.classList.add(cssClass)
    this.backContext.canvas.classList.add(cssClass)
  }

  /**
   * @param {string}cssClass
   */
  removeCssClass (cssClass) {
    this.frontContext.canvas.classList.remove(cssClass)
    this.backContext.canvas.classList.remove(cssClass)
  }
}
