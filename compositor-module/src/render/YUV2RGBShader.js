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

import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { FRAGMENT_YUV_TO_RGB, VERTEX_QUAD } from './ShaderSources'

class YUV2RGBShader {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @returns {YUV2RGBShader}
   */
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new YUV2RGBShader(gl, vertexBuffer, shaderArgs, program)
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @return {Program}
   * @private
   */
  static _initShaders (gl) {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD))
    program.attach(ShaderCompiler.compile(gl, FRAGMENT_YUV_TO_RGB))
    program.link()
    program.use()

    return program
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @param {Program}program
   * @return {{
   * yTexture:WebGLUniformLocation,
   * uTexture:WebGLUniformLocation,
   * vTexture:WebGLUniformLocation,
   * u_projection:WebGLUniformLocation,
   * a_position: GLint,
   * a_texCoord: GLint}}
   * @private
   */
  static _initShaderArgs (gl, program) {
    // find shader arguments
    const shaderArgs = {}
    shaderArgs.yTexture = program.getUniformLocation('yTexture')
    shaderArgs.uTexture = program.getUniformLocation('uTexture')
    shaderArgs.vTexture = program.getUniformLocation('vTexture')

    shaderArgs.u_projection = program.getUniformLocation('u_projection')

    shaderArgs.a_position = program.getAttributeLocation('a_position')
    gl.enableVertexAttribArray(shaderArgs.a_position)
    shaderArgs.a_texCoord = program.getAttributeLocation('a_texCoord')
    gl.enableVertexAttribArray(shaderArgs.a_texCoord)

    return shaderArgs
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @return {WebGLBuffer}
   * @private
   */
  static _initBuffers (gl) {
    // Create vertex buffer object.
    return gl.createBuffer()
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @param {WebGLBuffer}vertexBuffer
   * @param {{
   * yTexture:WebGLUniformLocation,
   * uTexture:WebGLUniformLocation,
   * vTexture:WebGLUniformLocation,
   * u_projection:WebGLUniformLocation,
   * a_position: GLint,
   * a_texCoord: GLint}}shaderArgs
   * @param {Program}program
   */
  constructor (gl, vertexBuffer, shaderArgs, program) {
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {WebGLBuffer}
     */
    this.vertexBuffer = vertexBuffer
    /**
     * @type {{yTexture: WebGLUniformLocation, uTexture: WebGLUniformLocation, vTexture: WebGLUniformLocation, u_projection: WebGLUniformLocation, a_position: GLint, a_texCoord: GLint}}
     */
    this.shaderArgs = shaderArgs
    /**
     * @type {Program}
     */
    this.program = program
  }

  /**
   * @param {Texture} textureY
   * @param {Texture} textureU
   * @param {Texture} textureV
   */
  setTexture (textureY, textureU, textureV) {
    const gl = this.gl

    gl.uniform1i(this.shaderArgs.yTexture, 0)
    gl.uniform1i(this.shaderArgs.uTexture, 1)
    gl.uniform1i(this.shaderArgs.vTexture, 2)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureY.texture)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, textureU.texture)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, textureV.texture)
  }

  use () {
    this.program.use()
  }

  release () {
    const gl = this.gl
    gl.useProgram(null)
  }

  /**
   * @param {!Size}encodedFrameSize
   * @param {number}maxXTexCoord
   * @param {number}maxYTexCoord
   */
  updateShaderData (encodedFrameSize, maxXTexCoord, maxYTexCoord) {
    const { w, h } = encodedFrameSize
    this.gl.viewport(0, 0, w, h)
    this.program.setUniformM4(this.shaderArgs.u_projection, [
      2.0 / w, 0, 0, 0,
      0, 2.0 / -h, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1
    ])
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      // First triangle
      // top left:
      0, 0, 0, 0,
      // top right:
      w, 0, maxXTexCoord, 0,
      // bottom right:
      w, h, maxXTexCoord, maxYTexCoord,

      // Second triangle
      // bottom right:
      w, h, maxXTexCoord, maxYTexCoord,
      // bottom left:
      0, h, 0, maxYTexCoord,
      // top left:
      0, 0, 0, 0
    ]), this.gl.DYNAMIC_DRAW)
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw () {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
    gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

export default YUV2RGBShader
