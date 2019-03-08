import Size from './Size'
import BufferContents from './BufferContents'

/**
 * @implements BufferContents
 */
export default class ShmFrame extends BufferContents {
  /**
   * @param {ArrayBuffer}arrayBuffer
   * @param {number}width
   * @param {number}height
   * @return {ShmFrame}
   */
  static create (arrayBuffer, width, height) {
    return new ShmFrame(new ImageData(new Uint8ClampedArray(arrayBuffer), width, height), width, height)
  }

  /**
   * @param {ImageData}contents
   * @param {number}width
   * @param {number}height
   */
  constructor (contents, width, height) {
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
    this._content = contents
  }

  /**
   * @return {Size}
   * @override
   */
  get size () {
    return this._size
  }

  /**
   * @return {ImageData}
   * @override
   */
  get contents () {
    return this._content
  }

  /**
   * @return {string}
   * @override
   */
  get mimeType () {
    return 'image/rgba'
  }

  /**
   * @return {number}
   * @override
   */
  get serial () {
    return 0
  }
}
