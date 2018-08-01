'use strict'

import Texture from './Texture'
import Size from '../Size'

export default class ViewState {
  /**
   * @param {!WebGLRenderingContext}gl
   * @returns {!ViewState}
   */
  static create (gl) {
    return new ViewState(gl)
  }

  /**
   * Use ViewState.create(..) instead.
   * @param {!WebGLRenderingContext}gl
   * @private
   */
  constructor (gl) {
    /**
     * @type {!WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {!Texture}
     */
    this.opaqueTexture = Texture.create(this.gl, this.gl.RGBA)
    /**
     * @type {!Texture}
     */
    this.alphaTexture = Texture.create(this.gl, this.gl.RGBA)
    /**
     * @type {!Size}
     * @private
     */
    this._size = Size.create(0, 0)
  }

  /**
   * @param {Size}frameSize
   * @param {!BrowserEncodedFrameFragment}fragment
   */
  async updateFragment (frameSize, fragment) {
    if (fragment.alphaImageBitmap) {
      const opaqueImageBitmap = await fragment.opaqueImageBitmap
      const alphaImageBitmap = await fragment.alphaImageBitmap
      if (this._size.w !== frameSize.w || this._size.h !== frameSize.h) {
        this.opaqueTexture.image2d(opaqueImageBitmap)
        this.alphaTexture.image2d(alphaImageBitmap)
        this._size = frameSize
      } else {
        this.opaqueTexture.subimage2d(opaqueImageBitmap, fragment.geo)
        this.alphaTexture.subimage2d(alphaImageBitmap, fragment.geo)
      }
    } else {
      const opaqueImageBitmap = await fragment.opaqueImageBitmap
      if (this._size.w !== frameSize.w || this._size.h !== frameSize.h) {
        this.opaqueTexture.image2d(opaqueImageBitmap)
        this._size = frameSize
      } else {
        this.opaqueTexture.subimage2d(opaqueImageBitmap, fragment.geo)
      }
    }
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
