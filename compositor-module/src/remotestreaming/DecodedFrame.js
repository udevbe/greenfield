/**
 * @implements BufferContents
 */
class DecodedFrame {
  /**
   * @param {string}mimeType
   * @param {{opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}|ImageBitmap}pixelContent
   * @param {number}serial
   * @param {Size}size
   * @return {DecodedFrame}
   */
  static create (mimeType, pixelContent, serial, size) {
    return new DecodedFrame(mimeType, pixelContent, serial, size)
  }

  /**
   * @param {string}mimeType
   * @param {{opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}|ImageBitmap}pixelContent
   * @param {number}serial
   * @param {Size}size
   */
  constructor (mimeType, pixelContent, serial, size) {
    /**
     * @type {string}
     * @private
     */
    this._mimeType = mimeType
    /**
     * @type {{opaque: {buffer: Uint8Array, width: number, height: number}, alpha: {buffer: Uint8Array, width: number, height: number}}|ImageBitmap}
     * @private
     */
    this._pixelContent = pixelContent
    /**
     * @type {number}
     * @private
     */
    this._serial = serial
    /**
     * @type {Size}
     * @private
     */
    this._size = size
  }

  /**
   * @return {string}
   */
  get mimeType () {
    return this._mimeType
  }

  /**
   * @return {{opaque: {buffer:Uint8Array, width: number, height:number}, alpha:{buffer:Uint8Array, width: number, height:number}}|ImageBitmap}
   */
  get pixelContent () {
    return this._pixelContent
  }

  /**
   * @return {number}
   */
  get serial () {
    return this._serial
  }

  /**
   * @return {Size}
   */
  get size () {
    return this._size
  }

  validateSize () { /* NOOP */ }
}

export default DecodedFrame
