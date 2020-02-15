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
import { FRAGMENT_YUVA_TO_RGBA, VERTEX_QUAD } from './ShaderSources'

class YUVA2RGBAShader {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @returns {YUVA2RGBAShader}
   */
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new YUVA2RGBAShader(gl, vertexBuffer, shaderArgs, program)
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @return {Program}
   * @private
   */
  static _initShaders (gl) {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD))
    program.attach(ShaderCompiler.compile(gl, FRAGMENT_YUVA_TO_RGBA))
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
   * alphaTexture:WebGLUniformLocation,
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
    shaderArgs.alphaYTexture = program.getUniformLocation('alphaYTexture')

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
   * alphaTexture:WebGLUniformLocation,
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
     * @type {{yTexture: WebGLUniformLocation, uTexture: WebGLUniformLocation, vTexture: WebGLUniformLocation, alphaTexture: WebGLUniformLocation, a_position: GLint, a_texCoord: GLint}}
     */
    this.shaderArgs = shaderArgs
    /**
     * @type {Program}
     */
    this.program = program
  }

  /**
   *
   * @param {Texture} textureY
   * @param {Texture} textureU
   * @param {Texture} textureV
   * @param {Texture} textureAlphaY
   */
  setTexture (textureY, textureU, textureV, textureAlphaY) {
    this.gl.uniform1i(this.shaderArgs.yTexture, 0)
    this.gl.uniform1i(this.shaderArgs.uTexture, 1)
    this.gl.uniform1i(this.shaderArgs.vTexture, 2)
    this.gl.uniform1i(this.shaderArgs.alphaYTexture, 3)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureY.texture)

    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureU.texture)

    this.gl.activeTexture(this.gl.TEXTURE2)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureV.texture)

    this.gl.activeTexture(this.gl.TEXTURE3)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureAlphaY.texture)
  }

  use () {
    this.program.use()
  }

  release () {
    this.gl.useProgram(null)
  }

  /**
   * @param {!Size}encodedFrameSize
   * @param {number}maxXTexCoord
   * @param {number}maxYTexCoord
   */
  updateShaderData (encodedFrameSize, maxXTexCoord, maxYTexCoord) {
    const { w, h } = encodedFrameSize
    this.gl.viewport(0, 0, w, h)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      // First triangle
      // top left:
      -1, 1, 0, maxYTexCoord,
      // top right:
      1, 1, maxXTexCoord, maxYTexCoord,
      // bottom right:
      1, -1, maxXTexCoord, 0,

      // Second triangle
      // bottom right:
      1, -1, maxXTexCoord, 0,
      // bottom left:
      -1, -1, 0, 0,
      // top left:
      -1, 1, 0, maxYTexCoord
    ]), this.gl.DYNAMIC_DRAW)
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }
}

export default YUVA2RGBAShader
