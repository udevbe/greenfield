'use strict'

/**
 * Represents a WebGL shader object and provides a mechanism to load shaders from HTML
 * script tags.
 */

export default class ShaderCompiler {
  static compile (gl, script) {
    let shader
    // Now figure out what type of shader script we have, based on its MIME type.
    if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER)
    } else if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER)
    } else {
      console.error('Unknown shader type: ' + script.type)
      return
    }

    // Send the source to the shader object.
    gl.shaderSource(shader, script.source)

    // Compile the shader program.
    gl.compileShader(shader)

    // See if it compiled successfully.
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
    }

    return shader
  }
}
