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
   * @return {GLint}
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
