// Copyright 2020 Erik De Rijcke
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

import { Size, sizeEquals, ZERO_SIZE } from '../math/Size'

/**
 * Represents a WebGL texture object.
 */
export default class Texture {
  private constructor(
    public readonly gl: WebGLRenderingContext,
    public readonly format: GLenum,
    public readonly texture: WebGLTexture,
    private size: Size = ZERO_SIZE,
  ) {}

  static create(gl: WebGLRenderingContext, format: number): Texture {
    const texture = gl.createTexture()
    if (texture === null) {
      throw new Error('Failed to create webgl texture.')
    }

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return new Texture(gl, format, texture)
  }

  setContent(buffer: TexImageSource | VideoFrame, size: Size): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    if (sizeEquals(this.size, size)) {
      this.gl.texSubImage2D(this.gl.TEXTURE_2D, 0, 0, 0, this.format, this.gl.UNSIGNED_BYTE, buffer)
    } else {
      this.size = size
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.format, this.gl.UNSIGNED_BYTE, buffer)
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  setContentBuffer(buffer: ArrayBufferView | null, size: Size): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    if (sizeEquals(this.size, size) && buffer !== null) {
      this.gl.texSubImage2D(
        this.gl.TEXTURE_2D,
        0,
        0,
        0,
        size.width,
        size.height,
        this.format,
        this.gl.UNSIGNED_BYTE,
        buffer,
      )
    } else {
      this.size = size
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.format,
        size.width,
        size.height,
        0,
        this.format,
        this.gl.UNSIGNED_BYTE,
        buffer,
      )
    }
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  delete(): void {
    this.gl.deleteTexture(this.texture)
  }
}
