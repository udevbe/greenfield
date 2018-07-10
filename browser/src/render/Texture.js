'use strict'

/**
 * Represents a WebGL texture object.
 */
export default class Texture {
  /**
   * @param {WebGLRenderingContext}gl
   * @param {number}format
   * @return {Texture}
   */
  static create (gl, format) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return new Texture(gl, format, texture)
  }

  /**
   * Use Texture.create(..) instead.
   * @param {WebGLRenderingContext}gl
   * @param {number}format
   * @param {WebGLTexture}texture
   * @private
   */
  constructor (gl, format, texture) {
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {WebGLTexture}
     */
    this.texture = texture
    /**
     * @type {number}
     */
    this.format = format
    /**
     * @type {Size}
     */
    this.size = null
  }

  /**
   * @param {HTMLImageElement}textureData
   * @param {Size}size
   */
  fill (textureData, size) {
    const gl = this.gl

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    // TODO use texSubimage2d if size hasn't changed
    if (this.size === null || this.size.w !== size.w || this.size.h !== size.h) {
      this.size = size
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, gl.UNSIGNED_BYTE, textureData)
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.format, gl.UNSIGNED_BYTE, textureData)
    }
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
