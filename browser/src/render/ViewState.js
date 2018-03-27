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
    const image = new window.Image()
    return new ViewState(gl, YTexture, UTexture, VTexture, alphaYTexture, image)
  }

  /**
   * Use ViewState.create(..) instead.
   * @param {WebGLRenderingContext}gl
   * @param {Texture}YTexture
   * @param {Texture}UTexture
   * @param {Texture}VTexture
   * @param {Texture}alphaYTexture
   * @param {HTMLImageElement}image
   * @private
   */
  constructor (gl, YTexture, UTexture, VTexture, alphaYTexture, image) {
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
    this.image = image
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}}bufferContents
   */
  update (bufferContents) {
    if (bufferContents.type === 'h264') {
      this._updateH264(bufferContents)
    } else { // if(type === 'png')
      this._updateImage(bufferContents)
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}}bufferContents
   */
  _updateH264 (bufferContents) {
    const opaqueBuffer = bufferContents.yuvContent
    if (!opaqueBuffer) { return }

    const opaqueWidth = bufferContents.yuvWidth
    const opaqueHeight = bufferContents.yuvHeight

    const lumaSize = opaqueWidth * opaqueHeight
    const chromaSize = lumaSize >> 2

    this.yTexture.fill(opaqueBuffer.subarray(0, lumaSize), bufferContents.geo, opaqueWidth)
    this.uTexture.fill(opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize), bufferContents.geo.getHalfSize(), opaqueWidth / 2)
    this.vTexture.fill(opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize)), bufferContents.geo.getHalfSize(), opaqueWidth / 2)

    const alphaBuffer = bufferContents.alphaYuvContent
    if (alphaBuffer) {
      const alphaWidth = bufferContents.alphaYuvWidth
      const alphaHeight = bufferContents.alphaYuvHeight
      const alphaLumaSize = alphaWidth * alphaHeight

      this.alphaYTexture.fill(alphaBuffer.subarray(0, alphaLumaSize), bufferContents.geo, alphaWidth)
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}}bufferContents
   */
  _updateImage (bufferContents) {
    this.image = bufferContents.pngImage
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
