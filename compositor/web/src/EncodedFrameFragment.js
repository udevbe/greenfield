import Rect from './math/Rect'

export default class EncodedFrameFragment {
  /**
   * @param {!string}encodingType
   * @param {!number}fragmentX
   * @param {!number}fragmentY
   * @param {!number}fragmentWidth
   * @param {!number}fragmentHeight
   * @param {!Uint8Array}opaque
   * @param {!Uint8Array}alpha
   * @return {!EncodedFrameFragment}
   */
  static create (encodingType, fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha) {
    const geo = Rect.create(fragmentX, fragmentY, fragmentX + fragmentWidth, fragmentY + fragmentHeight)
    return new EncodedFrameFragment(encodingType, geo, opaque, alpha)
  }

  /**
   * @param {!string}encodingType
   * @param {!Rect}geo
   * @param {!Uint8Array}opaque
   * @param {!Uint8Array}alpha
   * @private
   */
  constructor (encodingType, geo, opaque, alpha) {
    /**
     * @type {!string}
     * @const
     */
    this.encodingType = encodingType
    /**
     * @type {!Rect}
     * @const
     */
    this.geo = geo
    /**
     * @type {!Uint8Array}
     * @const
     */
    this.opaque = opaque
    /**
     * @type {!Uint8Array}
     * @const
     */
    this.alpha = alpha
  }
}
