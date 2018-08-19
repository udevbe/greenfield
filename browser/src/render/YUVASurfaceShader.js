'use strict'

import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { vertexQuad, fragmentYUVA } from './ShaderSources'

export default class YUVASurfaceShader {
  /**
   *
   * @param {WebGLRenderingContext} gl
   * @returns {YUVASurfaceShader}
   */
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new YUVASurfaceShader(gl, vertexBuffer, shaderArgs, program)
  }

  static _initShaders (gl) {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, vertexQuad))
    program.attach(ShaderCompiler.compile(gl, fragmentYUVA))
    program.link()
    program.use()

    return program
  }

  static _initShaderArgs (gl, program) {
    // find shader arguments
    const shaderArgs = {}
    shaderArgs.yTexture = program.getUniformLocation('yTexture')
    shaderArgs.uTexture = program.getUniformLocation('uTexture')
    shaderArgs.vTexture = program.getUniformLocation('vTexture')
    shaderArgs.alphaYTexture = program.getUniformLocation('alphaYTexture')

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
   * @param {Texture} textureY
   * @param {Texture} textureU
   * @param {Texture} textureV
   * @param {Texture} textureAlphaY
   */
  _setTexture (textureY, textureU, textureV, textureAlphaY) {
    const gl = this.gl

    gl.uniform1i(this.shaderArgs.yTexture, 0)
    gl.uniform1i(this.shaderArgs.uTexture, 1)
    gl.uniform1i(this.shaderArgs.vTexture, 2)
    gl.uniform1i(this.shaderArgs.alphaYTexture, 3)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textureY.texture)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, textureU.texture)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, textureV.texture)

    gl.activeTexture(gl.TEXTURE3)
    gl.bindTexture(gl.TEXTURE_2D, textureAlphaY.texture)
  }

  use () {
    this.program.use()
  }

  release () {
    const gl = this.gl
    gl.useProgram(null)
  }

  draw (textureY, textureU, textureV, textureAlphaY, bufferSize, viewPortUpdate) {
    const gl = this.gl
    this._setTexture(textureY, textureU, textureV, textureAlphaY)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    if (viewPortUpdate) {
      gl.viewport(0, 0, bufferSize.w, bufferSize.h)
      this.program.setUniformM4(this.shaderArgs.u_projection, [
        2.0 / bufferSize.w, 0, 0, 0,
        0, 2.0 / -bufferSize.h, 0, 0,
        0, 0, 1, 0,
        -1, 1, 0, 1
      ])
      gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
      gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
        // top left:
        0, 0, 0, 0,
        // top right:
        bufferSize.w, 0, 1, 0,
        // bottom right:
        bufferSize.w, bufferSize.h, 1, 1,
        // bottom right:
        bufferSize.w, bufferSize.h, 1, 1,
        // bottom left:
        0, bufferSize.h, 0, 1,
        // top left:
        0, 0, 0, 0
      ]), this.gl.DYNAMIC_DRAW)
      gl.vertexAttribPointer(this.shaderArgs.a_position, 2, gl.FLOAT, false, 16, 0)
      gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, gl.FLOAT, false, 16, 8)
    }
    gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
