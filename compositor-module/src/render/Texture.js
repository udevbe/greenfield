// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Represents a WebGL texture object.
 */
export default class Texture {
  /**
   * @param {!WebGLRenderingContext}gl
   * @param {!number}format
   * @return {!Texture}
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
  }

  /**
   * @param {!Uint8Array|HTMLVideoElement}buffer
   * @param {!Rect}geo
   * @param {number}stride
   */
  subImage2dBuffer (buffer, x, y, width, height) {
    const gl = this.gl
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, width, height, this.format, gl.UNSIGNED_BYTE, buffer)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  /**
   * @param {!Uint8Array|HTMLVideoElement}buffer
   * @param {number}width
   * @param {number}height
   */
  image2dBuffer (buffer, width, height) {
    const gl = this.gl
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, gl.UNSIGNED_BYTE, buffer)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  delete () {
    this.gl.deleteTexture(this.texture)
    this.texture = null
  }
}
