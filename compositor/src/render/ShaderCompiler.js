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

'use strict'

/**
 * Represents a WebGL shader object and provides a mechanism to load shaders from HTML
 * script tags.
 */

export default class ShaderCompiler {
  /**
   * @param {WebGLRenderingContext}gl
   * @param {{type: string, source: string}}script
   * @return {WebGLShader}
   */
  static compile (gl, script) {
    let shader
    // Now figure out what type of shader script we have, based on its MIME type.
    if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER)
    } else if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER)
    } else {
      throw new Error('Unknown shader type: ' + script.type)
    }

    // Send the source to the shader object.
    gl.shaderSource(shader, script.source)

    // Compile the shader program.
    gl.compileShader(shader)

    // See if it compiled successfully.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    }

    return shader
  }
}
