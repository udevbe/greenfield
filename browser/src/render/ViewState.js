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

  update (state) {
    if (state.buffer.type === 'h264') {
      this._updateH264(state)
    } else { // if(type === 'png')
      this._updatePNG(state)
    }
  }

  _updateH264 (state) {
    const opaqueBuffer = state.buffer.yuvContent
    if (!opaqueBuffer) { return }

    const opaqueWidth = state.buffer.yuvWidth
    const opaqueHeight = state.buffer.yuvHeight

    const lumaSize = opaqueWidth * opaqueHeight
    const chromaSize = lumaSize >> 2

    this.yTexture.fill(opaqueBuffer.subarray(0, lumaSize), state.buffer.geo, opaqueWidth)
    this.uTexture.fill(opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize), state.buffer.geo.getHalfSize(), opaqueWidth / 2)
    this.vTexture.fill(opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize)), state.buffer.geo.getHalfSize(), opaqueWidth / 2)

    const alphaBuffer = state.buffer.alphaYuvContent
    if (alphaBuffer) {
      const alphaWidth = state.buffer.alphaYuvWidth
      const alphaHeight = state.buffer.alphaYuvHeight
      const alphaLumaSize = alphaWidth * alphaHeight

      this.alphaYTexture.fill(alphaBuffer.subarray(0, alphaLumaSize), state.buffer.geo, alphaWidth)
    }
  }

  _updatePNG (state) {
    const pngArray = state.buffer.pngContent
    const pngBlob = new window.Blob([pngArray], {'type': 'image/png'})
    this.pngImage.src = window.URL.createObjectURL(pngBlob)
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
