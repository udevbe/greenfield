'use strict'
import assert from '../utils/assert'

export default class Program {
  constructor (gl) {
    this.gl = gl
    this.program = this.gl.createProgram()
  }

  attach (shader) {
    this.gl.attachShader(this.program, shader)
  }

  link () {
    this.gl.linkProgram(this.program)
    // If creating the shader program failed, alert.
    assert(this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS),
      'Unable to initialize the shader program.')
  }

  use () {
    this.gl.useProgram(this.program)
  }

  getAttributeLocation (name) {
    return this.gl.getAttribLocation(this.program, name)
  }

  getUniformLocation (name) {
    return this.gl.getUniformLocation(this.program, name)
  }

  setUniformM4 (uniformLocation, array) {
    this.gl.uniformMatrix4fv(uniformLocation, false, array)
  }
}
