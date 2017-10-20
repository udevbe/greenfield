'use strict'

import Texture from './Texture'

export default class H264ViewState {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {Size} size
   * @returns {H264ViewState}
   */
  static create (gl, size) {
    return new H264ViewState(size, gl)
  }

  /**
   *
   * @param {Size} size
   * @param gl
   */
  constructor (size, gl) {
    this.YTexture = null
    this.UTexture = null
    this.VTexture = null
    this.gl = gl
    this.size = size
    // TODO We might also want to introduce blob images (ie png) that can be rendered either directly without the need
    // of gl or decoders (functional similar to hw planes) or the RGBASurfaceShader can be used.
    this.type = 'h264'
  }

  update (buffer, width, height) {
    if (!buffer) { return }

    const lumaSize = width * height
    const chromaSize = lumaSize >> 2

    if (!this.YTexture) {
      this.YTexture = Texture.create(this.gl, {w: width, h: height}, this.gl.LUMINANCE)
    }
    if (!this.UTexture) {
      this.UTexture = Texture.create(this.gl, {w: width / 2, h: height / 2}, this.gl.LUMINANCE)
    }
    if (!this.VTexture) {
      this.VTexture = Texture.create(this.gl, {w: width / 2, h: height / 2}, this.gl.LUMINANCE)
    }

    this.YTexture.fill(buffer.subarray(0, lumaSize))
    this.UTexture.fill(buffer.subarray(lumaSize, lumaSize + chromaSize))
    this.VTexture.fill(buffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize)))
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
