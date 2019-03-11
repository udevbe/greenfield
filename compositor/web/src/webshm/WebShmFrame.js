import Size from '../Size'
import BufferContents from '../BufferContents'

/**
 * @implements BufferContents
 */
export default class WebShmFrame extends BufferContents {
  /**
   * @param {number}width
   * @param {number}height
   * @return {WebShmFrame}
   */
  static create (width, height) {
    return new WebShmFrame(width, height)
  }

  /**
   * @param {number}width
   * @param {number}height
   */
  constructor (width, height) {
    super()
    /**
     * @type {Size}
     * @private
     * @const
     */
    this._size = Size.create(width, height)
    /**
     * @type {ImageData}
     */
    this._pixelContent = new ImageData(new Uint8ClampedArray(new ArrayBuffer(width * height * 4)), width, height)
  }

  /**
   * @return {Size}
   * @override
   */
  get size () { return this._size }

  /**
   * @return {ImageData}
   * @override
   */
  get pixelContent () { return this._pixelContent }

  /**
   * @return {string}
   * @override
   */
  get mimeType () { return 'image/rgba' }

  /**
   * @return {number}
   * @override
   */
  get serial () { return 0 }

  /**
   * @param {WebFD}pixelContent
   */
  async attach (pixelContent) {
    const arrayBuffer = /** @type {ArrayBuffer} */ await pixelContent.getTransferable()
    this._pixelContent = new ImageData(new Uint8ClampedArray(arrayBuffer), this._size.w, this._size.h)
  }
}
