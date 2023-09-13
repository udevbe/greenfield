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
import RenderState from './RenderState'

const FRAGMENT_YUVA_TO_RGBA = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;

  varying vec2 v_texCoord;

  uniform sampler2D yTexture;
  uniform sampler2D uTexture;
  uniform sampler2D vTexture;
  uniform sampler2D alphaYTexture;
  
  const vec3 yuv_bt601_offset = vec3(-0.0625, -0.5, -0.5);
  const vec3 yuv_bt601_rcoeff = vec3(1.164, 0.000, 1.596);
  const vec3 yuv_bt601_gcoeff = vec3(1.164,-0.391,-0.813);
  const vec3 yuv_bt601_bcoeff = vec3(1.164, 2.018, 0.000);
  
  vec3 yuv_to_rgb (vec3 val, vec3 offset, vec3 ycoeff, vec3 ucoeff, vec3 vcoeff) {
    vec3 rgb;              
    val += offset;        
    rgb.r = dot(val, ycoeff);
    rgb.g = dot(val, ucoeff);
    rgb.b = dot(val, vcoeff);
    return rgb;
  }

  void main(void) {
    vec4 texel, rgba;

    texel.x = texture2D(yTexture, v_texCoord).r;
    texel.y = texture2D(uTexture, v_texCoord).r;
    texel.z = texture2D(vTexture, v_texCoord).r;
    float alphaChannel = texture2D(alphaYTexture, v_texCoord).r;

    rgba.rgb = yuv_to_rgb (texel.xyz, yuv_bt601_offset, yuv_bt601_rcoeff, yuv_bt601_gcoeff, yuv_bt601_bcoeff);
    rgba.a = yuv_to_rgb (vec3(alphaChannel, 0.5, 0.5), yuv_bt601_offset, yuv_bt601_rcoeff, yuv_bt601_gcoeff, yuv_bt601_bcoeff).r;
    gl_FragColor=rgba;
  }
`,
}

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

  updateShaderData(renderState: RenderState): void {
    const { width, height } = renderState.size
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.viewport(0, 0, width, height)

    const textureMinU = 1 - width / renderState.texture.size.width
    const textureMinV = 1 - height / renderState.texture.size.height

    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      // prettier-ignore
      new Float32Array([
        // First triangle
        // top left:
        -1, 1, textureMinU, 1,
        // top right:
        1, 1, 1, 1,
        // bottom right:
        1, -1, 1, textureMinV,

        // Second triangle
        // bottom right:
        1, -1, 1, textureMinV,
        // bottom left:
        -1, -1, textureMinU, textureMinV,
        // top left:
        -1, 1, textureMinU, 1
      ]),
      this.gl.STATIC_DRAW,
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
