'use strict'

export default class Program {
  /**
   * @param {WebGLRenderingContext}gl
   */
  constructor (gl) {
    this.gl = gl
    this.program = this.gl.createProgram()
  }

  /**
   * @param {WebGLShader}shader
   */
  attach (shader) {
    this.gl.attachShader(this.program, shader)
  }

  link () {
    this.gl.linkProgram(this.program)
    // If creating the shader program failed, alert.
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program.')
    }
  }

  use () {
    this.gl.useProgram(this.program)
  }

  /**
   * @param {string}name
   * @return {number}
   */
  getAttributeLocation (name) {
    return this.gl.getAttribLocation(this.program, name)
  }

  /**
   * @param {string}name
   * @return {WebGLUniformLocation | null}
   */
  getUniformLocation (name) {
    return this.gl.getUniformLocation(this.program, name)
  }

  /**
   * @param {WebGLUniformLocation}uniformLocation
   * @param {Array<number>}array
   */
  setUniformM4 (uniformLocation, array) {
    this.gl.uniformMatrix4fv(uniformLocation, false, array)
  }
}
