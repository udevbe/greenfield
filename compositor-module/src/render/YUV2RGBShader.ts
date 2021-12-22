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

export const FRAGMENT_YUV_TO_RGB = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;

  varying vec2 v_texCoord;

  uniform sampler2D yTexture;
  uniform sampler2D uTexture;
  uniform sampler2D vTexture;

  const vec3 yuv_bt709_offset = vec3(-0.0625, -0.5, -0.5);
  const vec3 yuv_bt709_rcoeff = vec3(1.164, 0.000, 1.787);
  const vec3 yuv_bt709_gcoeff = vec3(1.164,-0.213,-0.531);
  const vec3 yuv_bt709_bcoeff = vec3(1.164,2.112, 0.000);
  
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

    rgba.rgb = yuv_to_rgb (texel.xyz, yuv_bt709_offset, yuv_bt709_rcoeff, yuv_bt709_gcoeff, yuv_bt709_bcoeff);
    rgba.a = 1.0;
    gl_FragColor=rgba;
  }
`,
} as const

type ShaderArgs = {
  yTexture: WebGLUniformLocation
  uTexture: WebGLUniformLocation
  vTexture: WebGLUniformLocation
  a_position: GLint
  a_texCoord: GLint
}

function initShaders(gl: WebGLRenderingContext): Program {
  const program = new Program(gl)
  program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD))
  program.attach(ShaderCompiler.compile(gl, FRAGMENT_YUV_TO_RGB))
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

  const a_position = program.getAttributeLocation('a_position')
  gl.enableVertexAttribArray(a_position)
  const a_texCoord = program.getAttributeLocation('a_texCoord')
  gl.enableVertexAttribArray(a_texCoord)

  return {
    yTexture,
    uTexture,
    vTexture,
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

class YUV2RGBShader {
  static create(gl: WebGLRenderingContext): YUV2RGBShader {
    const program = initShaders(gl)
    const shaderArgs = initShaderArgs(gl, program)
    const vertexBuffer = initBuffers(gl)

    return new YUV2RGBShader(gl, vertexBuffer, shaderArgs, program)
  }

  private constructor(
    public readonly gl: WebGLRenderingContext,
    public readonly vertexBuffer: WebGLBuffer,
    public readonly shaderArgs: ShaderArgs,
    public readonly program: Program,
  ) {}

  setTexture(textureY: Texture, textureU: Texture, textureV: Texture): void {
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
        1, -1, maxXTexCoord, 0,
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
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
    gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

export default YUV2RGBShader
