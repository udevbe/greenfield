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

import { mat4ToArray } from '../math/Mat4'
import { Size } from '../math/Size'
import View from '../View'
import Program from './Program'
import RenderState from './RenderState'
import ShaderCompiler from './ShaderCompiler'
import { FRAGMENT_ARGB8888, VERTEX_QUAD_TRANSFORM } from './ShaderSources'

type ShaderArgs = {
  u_projection: WebGLUniformLocation
  u_transform: WebGLUniformLocation
  u_texture: WebGLUniformLocation
  a_position: GLint
  a_texCoord: GLint
}

function initShaders(gl: WebGLRenderingContext): Program {
  const program = new Program(gl)
  program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD_TRANSFORM))
  program.attach(ShaderCompiler.compile(gl, FRAGMENT_ARGB8888))
  program.link()
  program.use()

  return program
}

function initShaderArgs(gl: WebGLRenderingContext, program: Program): ShaderArgs {
  // find shader arguments
  const u_projection = program.getUniformLocation('u_projection')
  if (u_projection === null) {
    throw new Error('u_projection not found in shader')
  }
  const u_transform = program.getUniformLocation('u_transform')
  if (u_transform === null) {
    throw new Error('u_transform not found in shader')
  }
  const u_texture = program.getUniformLocation('u_texture')
  if (u_texture === null) {
    throw new Error('u_texture not found in shader')
  }
  const a_position = program.getAttributeLocation('a_position')
  if (a_position === null) {
    throw new Error('a_position not found in shader')
  }
  gl.enableVertexAttribArray(a_position)
  const a_texCoord = program.getAttributeLocation('a_texCoord')
  if (a_texCoord === null) {
    throw new Error('a_texCoord not found in shader')
  }
  gl.enableVertexAttribArray(a_texCoord)

  return {
    u_projection,
    u_transform,
    u_texture,
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

class SceneShader {
  private _sceneSize?: Size

  static create(gl: WebGLRenderingContext): SceneShader {
    const program = initShaders(gl)
    const shaderArgs = initShaderArgs(gl, program)
    const vertexBuffer = initBuffers(gl)
    return new SceneShader(gl, vertexBuffer, shaderArgs, program)
  }

  private constructor(
    public readonly gl: WebGLRenderingContext,
    public readonly vertexBuffer: WebGLBuffer,
    public readonly shaderArgs: ShaderArgs,
    public readonly program: Program,
  ) {}

  use(): void {
    this.program.use()
  }

  release(): void {
    this.gl.useProgram(null)
  }

  updateSceneData(sceneSize: Size): void {
    const { width, height } = sceneSize
    this._sceneSize = sceneSize
    this.gl.viewport(0, 0, width, height)
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT)
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA)
    this.gl.enable(this.gl.BLEND)
    this.program.setUniformM4(this.shaderArgs.u_projection, [
      2.0 / width,
      0,
      0,
      0,
      0,
      2.0 / -height,
      0,
      0,
      0,
      0,
      1,
      0,
      -1,
      1,
      0,
      1,
    ])
  }

  updateViewData(view: View, renderState: RenderState): void {
    const {
      texture,
      size: { width, height },
    } = renderState

    this.gl.uniform1i(this.shaderArgs.u_texture, 0)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture)

    this.program.setUniformM4(this.shaderArgs.u_transform, mat4ToArray(view.transformation))

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      // prettier-ignore
      new Float32Array([
        // First triangle
        // top left:
        0, 0, 0, 0,
        // top right:
        width, 0, 1, 0,
        // bottom right:
        width, height, 1, 1,
        // Second triangle
        // bottom right:
        width, height, 1, 1,
        // bottom left:
        0, height, 0, 1,
        // top left:
        0, 0, 0, 0,
      ]),
      this.gl.DYNAMIC_DRAW,
    )
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw(): void {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
    this.gl.flush()
  }
}

export default SceneShader
