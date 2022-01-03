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

import { Size } from '../math/Size'
import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { VERTEX_QUAD } from './ShaderSources'
import Texture from './Texture'

const FRAGMENT_RGB_AND_A_TO_RGBA = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;

  varying vec2 v_texCoord;

  uniform sampler2D rgbTexture;
  uniform sampler2D alphaTexture;

  void main(void) {
    vec4 rgba = texture2D(rgbTexture, v_texCoord);
    rgba.a = texture2D(alphaTexture, v_texCoord).g;
    // rgba.r = 1.;
    // rgba.g = 1.;
    // rgba.b = 1.;
    // rgba.a = 1.;
    gl_FragColor=rgba;
  }
`,
} as const

type ShaderArgs = {
  rgbTexture: WebGLUniformLocation
  alphaTexture: WebGLUniformLocation
  a_position: GLint
  a_texCoord: GLint
}

function initShaders(gl: WebGLRenderingContext): Program {
  const program = new Program(gl)
  program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD))
  program.attach(ShaderCompiler.compile(gl, FRAGMENT_RGB_AND_A_TO_RGBA))
  program.link()
  program.use()

  return program
}

function initShaderArgs(gl: WebGLRenderingContext, program: Program): ShaderArgs {
  // find shader arguments
  const rgbTexture = program.getUniformLocation('rgbTexture')
  if (rgbTexture === null) {
    throw new Error('rgbTexture not found in shader')
  }
  const alphaTexture = program.getUniformLocation('alphaTexture')
  if (alphaTexture === null) {
    throw new Error('alphaTexture not found in shader')
  }

  const a_position = program.getAttributeLocation('a_position')
  gl.enableVertexAttribArray(a_position)
  const a_texCoord = program.getAttributeLocation('a_texCoord')
  gl.enableVertexAttribArray(a_texCoord)

  return {
    rgbTexture,
    alphaTexture,
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

export class RGBandA2RGBAShader {
  static create(gl: WebGLRenderingContext): RGBandA2RGBAShader {
    const program = initShaders(gl)
    const shaderArgs = initShaderArgs(gl, program)
    const vertexBuffer = initBuffers(gl)

    return new RGBandA2RGBAShader(gl, vertexBuffer, shaderArgs, program)
  }

  private constructor(
    public readonly gl: WebGLRenderingContext,
    public readonly vertexBuffer: WebGLBuffer,
    public readonly shaderArgs: ShaderArgs,
    public readonly program: Program,
  ) {}

  setTexture(textureRGB: Texture, textureAlpha: Texture): void {
    this.gl.uniform1i(this.shaderArgs.rgbTexture, 0)
    this.gl.uniform1i(this.shaderArgs.alphaTexture, 1)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureRGB.texture)

    this.gl.activeTexture(this.gl.TEXTURE1)
    this.gl.bindTexture(this.gl.TEXTURE_2D, textureAlpha.texture)
  }

  use(): void {
    this.program.use()
  }

  release(): void {
    this.gl.useProgram(null)
  }

  updateShaderData(encodedFrameSize: Size, maxXTexCoord: number, maxYTexCoord: number): void {
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
