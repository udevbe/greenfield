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

    this.yTexture.fill(opaqueBuffer.subarray(0, lumaSize), browserRtcDcBuffer.geo, opaqueWidth)
    this.uTexture.fill(opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize), browserRtcDcBuffer.geo.getHalfSize(), opaqueWidth / 2)
    this.vTexture.fill(opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize)), browserRtcDcBuffer.geo.getHalfSize(), opaqueWidth / 2)

    const alphaBuffer = browserRtcDcBuffer.alphaYuvContent
    if (alphaBuffer) {
      const alphaWidth = browserRtcDcBuffer.alphaYuvWidth
      const alphaHeight = browserRtcDcBuffer.alphaYuvHeight
      const alphaLumaSize = alphaWidth * alphaHeight

      this.alphaYTexture.fill(alphaBuffer.subarray(0, alphaLumaSize), browserRtcDcBuffer.geo, alphaWidth)
    }
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
