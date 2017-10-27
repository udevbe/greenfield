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
    return new ViewState(gl, YTexture, UTexture, VTexture)
  }

  /**
   *
   * @param gl
   * @param YTexture
   * @param UTexture
   * @param VTexture
   */
  constructor (gl, YTexture, UTexture, VTexture) {
    this.YTexture = YTexture
    this.UTexture = UTexture
    this.VTexture = VTexture
    this.gl = gl
  }

  update (buffer, width, height) {
    if (!buffer) { return }

    const lumaSize = width * height
    const chromaSize = lumaSize >> 2

    const size = Size.create(width, height)
    const halfSize = size.getHalfSize()

    this.YTexture.fill(buffer.subarray(0, lumaSize), size)
    this.UTexture.fill(buffer.subarray(lumaSize, lumaSize + chromaSize), halfSize)
    this.VTexture.fill(buffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize)), halfSize)
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
