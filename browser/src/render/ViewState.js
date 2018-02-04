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
    const pngImg = new window.Image()
    return new ViewState(gl, YTexture, UTexture, VTexture, alphaYTexture, pngImg)
  }

  /**
   *
   * @param gl
   * @param YTexture
   * @param UTexture
   * @param VTexture
   * @param alphaYTexture
   * @param pngImage
   */
  constructor (gl, YTexture, UTexture, VTexture, alphaYTexture, pngImage) {
    this.yTexture = YTexture
    this.uTexture = UTexture
    this.vTexture = VTexture
    this.alphaYTexture = alphaYTexture
    this.gl = gl
    this.pngImage = pngImage
  }

  /**
   *
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   */
  update (browserRtcDcBuffer) {
    // if (browserRtcDcBuffer.type === 'h264') {
    this._updateH264(browserRtcDcBuffer)
    // } else { // if(type === 'png')
    //   await this._updatePNG(browserRtcDcBuffer)
    // }
  }

  _updateH264 (browserRtcDcBuffer) {
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

  _updatePNG (browserRtcDcBuffer) {
    return new Promise((resolve) => {
      const pngArray = browserRtcDcBuffer.pngContent
      const pngBlob = new window.Blob([pngArray], {'type': 'image/png'})
      const pngBlobURL = window.URL.createObjectURL(pngBlob)
      this.pngImage.onload = () => {
        resolve()
      }
      this.pngImage.src = pngBlobURL
    })
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
