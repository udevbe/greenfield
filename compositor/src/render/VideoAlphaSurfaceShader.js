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

'use strict'

import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { fragmentVideoAlpha, vertexQuad } from './ShaderSources'

class VideoAlphaSurfaceShader {
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new VideoAlphaSurfaceShader(gl, vertexBuffer, shaderArgs, program)
  }

  static _initShaders (gl) {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, vertexQuad))
    program.attach(ShaderCompiler.compile(gl, fragmentVideoAlpha))
    program.link()
    program.use()

    return program
  }

  static _initShaderArgs (gl, program) {
    // find shader arguments
    const shaderArgs = {}
    shaderArgs.opaqueTexture = program.getUniformLocation('opaqueTexture')
    shaderArgs.alphaTexture = program.getUniformLocation('alphaTexture')

    shaderArgs.u_projection = program.getUniformLocation('u_projection')

    shaderArgs.a_position = program.getAttributeLocation('a_position')
    gl.enableVertexAttribArray(shaderArgs.a_position)
    shaderArgs.a_texCoord = program.getAttributeLocation('a_texCoord')
    gl.enableVertexAttribArray(shaderArgs.a_texCoord)

    return shaderArgs
  }

  static _initBuffers (gl) {
    // Create vertex buffer object.
    return gl.createBuffer()
  }

  constructor (gl, vertexBuffer, shaderArgs, program) {
    this.gl = gl
    this.vertexBuffer = vertexBuffer
    this.shaderArgs = shaderArgs
    this.program = program
  }

  /**
   *
   * @param {Texture} textureOpaque
   * @param {Texture} textureAlpha
   */
  setTexture (textureOpaque, textureAlpha) {
    this.gl.uniform1i(this.shaderArgs.yTexture, 0)
    this.gl.uniform1i(this.shaderArgs.alphaYTexture, 1)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureOpaque.texture)

    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureAlpha.texture)
  }

  /**
   * @param {!Size}encodedFrameSize
   */
  updateShaderData (encodedFrameSize) {
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
      w, 0, 1, 0,
      // bottom right:
      w, h, 1, 1,

      // Second triangle
      // bottom right:
      w, h, 1, 1,
      // bottom left:
      0, h, 0, 1,
      // top left:
      0, 0, 0, 0
    ]), this.gl.DYNAMIC_DRAW)
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }

  release () {
    this.gl.useProgram(null)
  }
}

export default VideoAlphaSurfaceShader
