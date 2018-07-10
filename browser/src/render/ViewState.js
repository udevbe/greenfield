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
    /**
     * @type {HTMLImageElement}
     */
    this.image = image
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, pngImage: HTMLImageElement, content: HTMLImageElement, alphaContent: HTMLImageElement}}bufferContents
   */
  update (bufferContents) {
    if (bufferContents.type === 'jpeg') {
      this._updateJpeg(bufferContents)
    } else { // if(type === 'png')
      this._updateImage(bufferContents)
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, pngImage: HTMLImageElement, content: HTMLImageElement, alphaContent: HTMLImageElement}}bufferContents
   */
  _updateJpeg (bufferContents) {
    const opaqueJpeg = bufferContents.content
    if (!opaqueJpeg) { return }

    this.opaqueTexture.fill(opaqueJpeg, bufferContents.geo)

    const alphaJpeg = bufferContents.alphaContent
    if (alphaJpeg) {
      this.alphaTexture.fill(alphaJpeg, bufferContents.geo)
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, pngImage: HTMLImageElement, content: HTMLImageElement, alphaContent: HTMLImageElement}}bufferContents
   */
  _updateImage (bufferContents) {
    this.image = bufferContents.pngImage
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
