'use strict'

/**
 * Represents a WebGL texture object.
 */
export default class Texture {
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

  constructor (gl, format, texture) {
    this.gl = gl
    this.texture = texture
    this.format = format
    this.size = null
  }

  /**
   * @param {Buffer}textureData
   * @param {Size}size
   * @param {number}stride
   */
  fill (textureData, size, stride) {
    const gl = this.gl

    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, stride)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    // TODO use texSubimage2d if size hasn't changed
    if (this.size === null || this.size.w !== size.w || this.size.h !== size.h) {
      this.size = size
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, size.w, size.h, 0, this.format, gl.UNSIGNED_BYTE, textureData)
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, size.w, size.h, this.format, gl.UNSIGNED_BYTE, textureData)
    }
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0)
  }
}
