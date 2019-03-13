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
    return new WebGLFrame()
  }

  constructor () {
    super()
    /**
     * @type {Size}
     * @private
     */
    this._size = Size.create(0, 0)
    /**
     * @type {ImageBitmap}
     * @private
     */
    this._imageBitmap = null
  }

  /**
   * @param {ImageBitmap}imageBitmap
   */
  update (imageBitmap) {
    this._imageBitmap = imageBitmap
    this._size = Size.create(imageBitmap.width, imageBitmap.height)
  }

  /**
   * @return {string}
   */
  get mimeType () { return 'image/bitmap' }

  /**
   * @return {ImageBitmap}
   */
  get pixelContent () {
    return this._imageBitmap
  }

  /**
   * @return {number}
   */
  get serial () { return 0 }

  /**
   * @return {Size}
   */
  get size () { return this._size }
}
