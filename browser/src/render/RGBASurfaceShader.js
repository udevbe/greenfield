'use strict'

import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { vertexQuad, fragmentRGBA } from './ShaderSources'

export default class RGBASurfaceShader {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @returns {RGBASurfaceShader}
   */
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl, shaderArgs)

    return new RGBASurfaceShader(gl, vertexBuffer, shaderArgs, program)
  }

  static _initShaders (gl) {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, vertexQuad))
    program.attach(ShaderCompiler.compile(gl, fragmentRGBA))
    program.link()
    program.use()
    return program
  }

  static _initShaderArgs (gl, program) {
    // find shader arguments
    const shaderArgs = {}
    shaderArgs.u_projection = program.getUniformLocation('u_projection')
    shaderArgs.u_texture0 = program.getUniformLocation('u_texture0')
    shaderArgs.u_transform = program.getUniformLocation('u_transform')
    shaderArgs.a_position = program.getAttributeLocation('a_position')
    gl.enableVertexAttribArray(shaderArgs.a_position)
    shaderArgs.a_texCoord = program.getAttributeLocation('a_texCoord')
    gl.enableVertexAttribArray(shaderArgs.a_texCoord)
    return shaderArgs
  }

  static _initBuffers (gl, shaderArgs) {
    // Create vertex buffer object.
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.vertexAttribPointer(shaderArgs.a_position, 2, gl.FLOAT, false, 16, 0)
    gl.vertexAttribPointer(shaderArgs.a_texCoord, 2, gl.FLOAT, false, 16, 8)
    return vbo
  }

  constructor (gl, vertexBuffer, shaderArgs, program) {
    this.gl = gl
    this.vertexBuffer = vertexBuffer
    this.shaderArgs = shaderArgs
    this.program = program
  }

  setProjection (projection) {
    this.program.setUniformM4(this.shaderArgs.u_projection, projection)
  }

  setTransform (transform) {
    this.program.setUniformM4(this.shaderArgs.u_transform, transform)
  }

  /**
   *
   * @param {Size} size
   */
  setSize (size) {
    const gl = this.gl
    gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    // TODO we could also do 3 subdata calls (probably faster as we have to transfer less data)
    gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      // top right:
      size.w, 0.0, 1.0, 0.0,
      // bottom right:
      size.w, size.h, 1.0, 1.0,
      // bottom left:
      0.0, size.h, 0.0, 1.0,
      // top left:
      0.0, 0.0, 0.0, 0.0
    ]), this.gl.DYNAMIC_DRAW)
  }

  /**
   *
   * @param {Texture} texture
   */
  setTexture (texture) {
    const gl = this.gl
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture.texture)
    gl.uniform1i(this.shaderArgs.u_texture0, 0)
  }

  draw () {
    const gl = this.gl
    this.program.use()
    gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}
