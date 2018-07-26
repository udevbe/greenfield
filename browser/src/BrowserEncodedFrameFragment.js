import Rect from './math/Rect'

export default class BrowserEncodedFrameFragment {
  /**
   * @param {!string}encodingType
   * @param {!number}fragmentX
   * @param {!number}fragmentY
   * @param {!number}fragmentWidth
   * @param {!number}fragmentHeight
   * @param {!Uint8Array}opaque
   * @param {!Uint8Array}alpha
   * @return {!BrowserEncodedFrameFragment}
   */
  static create (encodingType, fragmentX, fragmentY, fragmentWidth, fragmentHeight, opaque, alpha) {
    const geo = Rect.create(fragmentX, fragmentY, fragmentX + fragmentWidth, fragmentY + fragmentHeight)

    const opaqueImageBlob = new window.Blob([opaque], {'type': encodingType})
    const opaqueImageBitmap = window.createImageBitmap(opaqueImageBlob, 0, 0, fragmentWidth, fragmentHeight)

    const alphaImageBitmap = alpha.length ? window.createImageBitmap(new window.Blob([alpha], {'type': encodingType}), 0, 0, fragmentWidth, fragmentHeight) : null

    return new BrowserEncodedFrameFragment(encodingType, geo, opaque, alpha, opaqueImageBitmap, alphaImageBitmap)
  }

  /**
   * @param {!string}encodingType
   * @param {!Rect}geo
   * @param {!Uint8Array}opaque
   * @param {!Uint8Array}alpha
   * @param {!Promise<ImageBitmap>}opaqueImageBitmap
   * @param {?Promise<ImageBitmap>}alphaImageBitmap
   * @private
   */
  constructor (encodingType, geo, opaque, alpha, opaqueImageBitmap, alphaImageBitmap) {
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
    /**
     * @type {!Promise<ImageBitmap>}
     */
    this.opaqueImageBitmap = opaqueImageBitmap
    /**
     * @type {?Promise<ImageBitmap>}
     */
    this.alphaImageBitmap = alphaImageBitmap
  }
}
