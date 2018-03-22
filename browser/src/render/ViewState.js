'use strict'

import Texture from './Texture'

export default class ViewState {
  /**
   * @param {WebGLRenderingContext}gl
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
   * Use ViewState.create(..) instead.
   * @param {WebGLRenderingContext}gl
   * @param {Texture}YTexture
   * @param {Texture}UTexture
   * @param {Texture}VTexture
   * @param {Texture}alphaYTexture
   * @param {HTMLImageElement}pngImage
   * @private
   */
  constructor (gl, YTexture, UTexture, VTexture, alphaYTexture, pngImage) {
    /**
     * @type {Texture}
     */
    this.yTexture = YTexture
    /**
     * @type {Texture}
     */
    this.uTexture = UTexture
    /**
     * @type {Texture}
     */
    this.vTexture = VTexture
    /**
     * @type {Texture}
     */
    this.alphaYTexture = alphaYTexture
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {HTMLImageElement}
     */
    this.pngImage = pngImage
  }

  /**
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   */
  update (browserRtcDcBuffer) {
    if (browserRtcDcBuffer.type === 'h264') {
      this._updateH264(browserRtcDcBuffer)
    } else { // if(type === 'png')
      this._updatePNG(browserRtcDcBuffer)
    }
  }

  /**
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   */
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

  /**
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   */
  _updatePNG (browserRtcDcBuffer) {
    const pngArray = browserRtcDcBuffer.pngContent
    const pngBlob = new window.Blob([pngArray], {'type': 'image/png'})
    this.pngImage.src = window.URL.createObjectURL(pngBlob)
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
