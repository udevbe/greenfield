'use strict'

import Texture from './Texture'

export default class ViewState {
  /**
   * @param {WebGLRenderingContext}gl
   * @returns {ViewState}
   */
  static create (gl) {
    const opaqueTexture = Texture.create(gl, gl.RGBA)
    const alphaTexture = Texture.create(gl, gl.RGBA)
    const image = new window.Image()
    return new ViewState(gl, opaqueTexture, alphaTexture, image)
  }

  /**
   * Use ViewState.create(..) instead.
   * @param {WebGLRenderingContext}gl
   * @param {Texture}opaqueTexture
   * @param {Texture}alphaTexture
   * @param {HTMLImageElement}image
   * @private
   */
  constructor (gl, opaqueTexture, alphaTexture, image) {
    /**
     * @type {Texture}
     */
    this.opaqueTexture = opaqueTexture
    /**
     * @type {Texture}
     */
    this.alphaTexture = alphaTexture
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
  }

  /**
   * @param {BrowserEncodedFrameFragment}fragment
   */
  async updateFragment (fragment) {
    this.opaqueTexture.fill(await fragment.opaqueImageBitmap)
    this.alphaTexture.fill(await fragment.alphaImageBitmap)
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
