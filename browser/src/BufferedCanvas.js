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
    frontCanvas.style.display = 'inline'
    frontCanvas.style.zIndex = '0'
    const frontContext = frontCanvas.getContext('2d')
    frontContext.imageSmoothingEnabled = false
    frontContext.globalCompositeOperation = 'source-over'

    const backCanvas = document.createElement('canvas')
    backCanvas.width = width
    backCanvas.height = height
    backCanvas.style.display = 'none'
    backCanvas.style.zIndex = '0'
    const backContext = backCanvas.getContext('2d')
    backContext.imageSmoothingEnabled = false
    backContext.globalCompositeOperation = 'source-over'

    const containerDiv = document.createElement('div')
    containerDiv.style.display = 'contents'
    containerDiv.appendChild(frontCanvas)
    containerDiv.appendChild(backCanvas)

    return new BufferedCanvas(frontContext, backContext, containerDiv)
  }

  /**
   * @param {CanvasRenderingContext2D}frontContext
   * @param {CanvasRenderingContext2D}backContext
   * @param {HTMLDivElement}containerDiv
   */
  constructor (frontContext, backContext, containerDiv) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.frontContext = frontContext
    /**
     * @type {CanvasRenderingContext2D}
     */
    this.backContext = backContext
    /**
     * @type {Array<HTMLDivElement>}
     */
    this.inputDivs = []
    /**
     * @type {HTMLDivElement}
     */
    this.containerDiv = containerDiv
    /**
     * Set by the BrowserSurfaceView after constructing this buffered canvas.
     * @type {BrowserSurfaceView}
     */
    this.view = null
  }

  /**
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap}image
   * @param {number}frameWidth
   * @param {number}frameHeight
   * @param {number}fragmentX
   * @param {number}fragmentY
   */
  drawBackBuffer (image, frameWidth, frameHeight, fragmentX, fragmentY) {
    this._draw(this.backContext, image, frameWidth, frameHeight, fragmentX, fragmentY)
  }

  /**
   * @param {CanvasRenderingContext2D} context2d
   * @param {HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap}image
   * @param {number}frameWidth
   * @param {number}frameHeight
   * @param {number}fragmentX
   * @param {number}fragmentY
   * @private
   */
  _draw (context2d, image, frameWidth, frameHeight, fragmentX, fragmentY) {
    // TODO use ImageBitmapRenderingContext.transferFromImageBitmap()
    const canvas = context2d.canvas
    if (canvas.width !== frameWidth || canvas.height !== frameHeight) {
      // resizing clears the canvas
      console.log('resizing back canvas')
      canvas.width = frameWidth
      canvas.height = frameHeight
    }
    // if (image instanceof window.ImageData) {
    //   context2d.putImageData(image, fragmentX, fragmentY)
    // } else if (image instanceof window.HTMLImageElement) {
    context2d.clearRect(fragmentX, fragmentY, image.width, image.height)
    context2d.drawImage(image, fragmentX, fragmentY)
    // /}
  }

  async swapBuffers () {
    // swap canvasses
    const oldFront = this.frontContext
    this.frontContext = this.backContext
    this.backContext = oldFront

    // make back canvas invisible
    this.backContext.canvas.style.display = 'none'
    // make new front canvas visible
    this.frontContext.canvas.style.display = 'inline'

    // make sure the new back canvas has the same transformation as the new front canvas
    this.containerDiv.style.transform = this.frontContext.canvas.style.transform
    this.frontContext.canvas.style.transform = 'inherit'
    this.backContext.canvas.style.transform = this.containerDiv.style.transform

    // make sure the new back canvas has the same content as the new front canvas
    if (this.frontContext.canvas.width !== 0 && this.frontContext.canvas.height !== 0) {
      console.log('drawing front context into back context')
      const imageBitmap = await window.createImageBitmap(
        this.frontContext.canvas,
        0, 0,
        this.frontContext.canvas.width, this.frontContext.canvas.height
      )
      this.drawBackBuffer(imageBitmap, this.frontContext.canvas.width, this.frontContext.canvas.height, 0, 0)
    }
  }

  /**
   * @param {number}index
   */
  set zIndex (index) {
    const zIndex = index.toString(10)
    this.frontContext.canvas.style.zIndex = zIndex
    this.backContext.canvas.style.zIndex = zIndex
    this.inputDivs.forEach((inputDiv) => {
      inputDiv.style.zIndex = zIndex + 1
    })
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
    this.containerDiv.classList.add(cssClass)
  }

  /**
   * @param {string}cssClass
   */
  removeCssClass (cssClass) {
    this.containerDiv.classList.remove(cssClass)
  }

  _detachInputDivs () {
    this.inputDivs.forEach((inputDiv) => {
      if (inputDiv.parentElement) {
        inputDiv.parentElement.removeChild(inputDiv)
      }
    })
  }

  /**
   * @param {HTMLDivElement}divElement
   * @param {Rect}rectangle
   * @private
   */
  _syncDivToRect (divElement, rectangle) {
    const rectangleSize = rectangle.size
    divElement.style.left = `${rectangle.x0}px`
    divElement.style.top = `${rectangle.y0}px`
    divElement.style.width = `${rectangleSize.w}px`
    divElement.style.height = `${rectangleSize.h}px`
  }

  /**
   * @param {Array<Rect>}rectangles
   */
  updateInputRegionElements (rectangles) {
    if (this.inputDivs.length !== rectangles.length) { // recreate divs
      this._detachInputDivs()
      this.inputDivs = []
      rectangles.forEach((rectangle) => {
        const inputDiv = document.createElement('div')
        inputDiv.view = this.view
        inputDiv.classList.add('inputRegion')
        inputDiv.style.zIndex = this.frontContext.canvas.style.zIndex + 1
        this._syncDivToRect(inputDiv, rectangle)
        // TODO a document fragment might be interesting here for atomically adding a group of html elements
        this.containerDiv.appendChild(inputDiv)
        this.inputDivs.push(inputDiv)
      })
    } else { // update existing divs
      for (let i = 0; i < rectangles.length; i++) {
        const rectangle = rectangles[i]
        const inputDiv = this.inputDivs[i]
        this._syncDivToRect(inputDiv, rectangle)
      }
    }
  }

  /**
   * @param {HTMLElement}element
   */
  attachToElement (element) {
    // TODO a document fragment might be interesting here for atomically adding a group of html elements
    element.appendChild(this.containerDiv)
  }

  /**
   * @return {boolean}
   */
  isAttachedToElement () {
    return this.containerDiv.parentElement !== null
  }

  detachFromElement () {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv)
    }
  }

  /**
   * @param {string}cssTransformation
   */
  setElementTransformation (cssTransformation) {
    this.containerDiv.style.transform = cssTransformation
  }

  /**
   * @param {string}cssTransformation
   */
  setBackBufferElementTransformation (cssTransformation) {
    this.backContext.canvas.style.transform = cssTransformation
  }

  /**
   * @return {HTMLElement | null}
   */
  getParentElement () {
    return this.containerDiv.parentElement
  }
}
