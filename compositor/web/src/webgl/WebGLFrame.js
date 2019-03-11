import BufferContents from '../BufferContents'
import Size from '../Size'

/**
 * @implements BufferContents
 */
export default class WebGLFrame extends BufferContents {
  /**
   * @return {WebGLFrame}
   */
  static create () {
    const canvas = /** @type {HTMLCanvasElement} */ document.createElement('canvas')
    const context = /** @type {ImageBitmapRenderingContext} */ canvas.getContext('bitmaprenderer')
    return new WebGLFrame(canvas, context)
  }

  /**
   * @param {HTMLCanvasElement}canvas
   * @param {ImageBitmapRenderingContext}context
   */
  constructor (canvas, context) {
    super()
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas
    /**
     * @type {ImageBitmapRenderingContext}
     * @private
     */
    this._context = context
    /**
     * @type {Size}
     * @private
     */
    this._size = Size.create(0, 0)
  }

  /**
   * @param {ImageBitmap}imageBitmap
   */
  update (imageBitmap) {
    this._size = Size.create(imageBitmap.width, imageBitmap.height)
    this._context.transferFromImageBitmap(imageBitmap)
  }

  /**
   * @return {string}
   */
  get mimeType () { return 'image/bitmap' }

  /**
   * @return {HTMLCanvasElement}
   */
  get pixelContent () { return this.canvas }

  /**
   * @return {number}
   */
  get serial () { return 0 }

  /**
   * @return {Size}
   */
  get size () { return this._size }
}
