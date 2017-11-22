'use strict'

import Texture from './Texture'
import Size from '../Size'

export default class ViewState {
  /**
   *
   * @returns {ViewState}
   */
  static create (gl) {
    const YTexture = Texture.create(gl, gl.LUMINANCE)
    const UTexture = Texture.create(gl, gl.LUMINANCE)
    const VTexture = Texture.create(gl, gl.LUMINANCE)
    const alphaYTexture = Texture.create(gl, gl.LUMINANCE)
    return new ViewState(gl, YTexture, UTexture, VTexture, alphaYTexture)
  }

  /**
   *
   * @param gl
   * @param YTexture
   * @param UTexture
   * @param VTexture
   * @param alphaYTexture
   */
  constructor (gl, YTexture, UTexture, VTexture, alphaYTexture) {
    this.yTexture = YTexture
    this.uTexture = UTexture
    this.vTexture = VTexture
    this.alphaYTexture = alphaYTexture
    this.gl = gl
  }

  /**
   *
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   */
  update (browserRtcDcBuffer) {
    const opaqueBuffer = browserRtcDcBuffer.yuvContent
    if (!opaqueBuffer) { return }

    const opaqueWidth = browserRtcDcBuffer.yuvWidth
    const opaqueHeight = browserRtcDcBuffer.yuvHeight

    const lumaSize = opaqueWidth * opaqueHeight
    const chromaSize = lumaSize >> 2

    const size = Size.create(opaqueWidth, opaqueHeight)
    const halfSize = size.getHalfSize()

    this.yTexture.fill(opaqueBuffer.subarray(0, lumaSize), size)
    this.uTexture.fill(opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize), halfSize)
    this.vTexture.fill(opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize)), halfSize)

    const alphaBuffer = browserRtcDcBuffer.alphaYuvContent
    if (alphaBuffer) {
      const alphaWidth = browserRtcDcBuffer.alphaYuvWidth
      const alphaHeight = browserRtcDcBuffer.alphaYuvHeight
      const alphaLumaSize = alphaWidth * alphaHeight

      const alphaSize = Size.create(alphaWidth, alphaHeight)

      this.alphaYTexture.fill(alphaBuffer.subarray(0, alphaLumaSize), alphaSize)
    }
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
