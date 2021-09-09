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

import { SizeRO } from '../math/Size'
import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { FRAGMENT_YUVA_TO_RGBA, VERTEX_QUAD } from './ShaderSources'
import Texture from './Texture'

type ShaderArgs = {
  yTexture: WebGLUniformLocation
  uTexture: WebGLUniformLocation
  vTexture: WebGLUniformLocation
  alphaYTexture: WebGLUniformLocation
  a_position: GLint
  a_texCoord: GLint
}

function initShaders(gl: WebGLRenderingContext): Program {
  const program = new Program(gl)
  program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD))
  program.attach(ShaderCompiler.compile(gl, FRAGMENT_YUVA_TO_RGBA))
  program.link()
  program.use()

  return program
}

function initShaderArgs(gl: WebGLRenderingContext, program: Program): ShaderArgs {
  // find shader arguments
  const yTexture = program.getUniformLocation('yTexture')
  if (yTexture === null) {
    throw new Error('yTexture not found shader')
  }
  const uTexture = program.getUniformLocation('uTexture')
  if (uTexture === null) {
    throw new Error('uTexture not found shader')
  }
  const vTexture = program.getUniformLocation('vTexture')
  if (vTexture === null) {
    throw new Error('vTexture not found shader')
  }
  const alphaYTexture = program.getUniformLocation('alphaYTexture')
  if (alphaYTexture === null) {
    throw new Error('alphaYTexture not found shader')
  }

  const a_position = program.getAttributeLocation('a_position')
  gl.enableVertexAttribArray(a_position)
  const a_texCoord = program.getAttributeLocation('a_texCoord')
  gl.enableVertexAttribArray(a_texCoord)

  return {
    yTexture,
    uTexture,
    vTexture,
    alphaYTexture,
    a_position,
    a_texCoord,
  }
}

function initBuffers(gl: WebGLRenderingContext): WebGLBuffer {
  // Create vertex buffer object.
  const webglBuffer = gl.createBuffer()
  if (webglBuffer === null) {
    throw new Error("Can't create webgl buffer.")
  }
  return webglBuffer
}

class YUVA2RGBAShader {
  static create(gl: WebGLRenderingContext): YUVA2RGBAShader {
    const program = initShaders(gl)
    const shaderArgs = initShaderArgs(gl, program)
    const vertexBuffer = initBuffers(gl)

    return new YUVA2RGBAShader(gl, vertexBuffer, shaderArgs, program)
  }

  private constructor(
    public readonly gl: WebGLRenderingContext,
    public readonly vertexBuffer: WebGLBuffer,
    public readonly shaderArgs: ShaderArgs,
    public readonly program: Program,
  ) {}

  setTexture(textureY: Texture, textureU: Texture, textureV: Texture, textureAlphaY: Texture): void {
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

  use(): void {
    this.program.use()
  }

  release(): void {
    this.gl.useProgram(null)
  }

  updateShaderData(encodedFrameSize: SizeRO, maxXTexCoord: number, maxYTexCoord: number): void {
    const { width, height } = encodedFrameSize
    this.gl.viewport(0, 0, width, height)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      // prettier-ignore
      new Float32Array([
        // First triangle
        // top left:
        -1, 1, 0, maxYTexCoord,
        // top right:
        1, 1, maxXTexCoord, maxYTexCoord,
        // bottom right:
        1, -1, maxXTexCoord, 0,

        // Second triangle
        // bottom right:
        1, -1,  maxXTexCoord, 0,
        // bottom left:
        -1, -1, 0, 0,
        // top left:
        -1, 1, 0, maxYTexCoord,
      ]),
      this.gl.DYNAMIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw(): void {
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }
}

export default YUVA2RGBAShader
