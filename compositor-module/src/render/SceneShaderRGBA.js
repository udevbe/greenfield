import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { FRAGMENT_ARGB8888, VERTEX_QUAD_TRANSFORM } from './ShaderSources'

class SceneShaderRGBA {
  /**
   * @param {WebGLRenderingContext} gl
   * @returns {SceneShaderRGBA}
   */
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new SceneShaderRGBA(gl, vertexBuffer, shaderArgs, program)
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @return {Program}
   * @private
   */
  static _initShaders (gl) {
    const program = new Program(gl)
    program.attach(ShaderCompiler.compile(gl, VERTEX_QUAD_TRANSFORM))
    program.attach(ShaderCompiler.compile(gl, FRAGMENT_ARGB8888))
    program.link()
    program.use()

    return program
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @param {Program}program
   * @return {{
   * u_projection:WebGLUniformLocation,
   * u_transform:WebGLUniformLocation,
   * u_texture:WebGLUniformLocation,
   * a_position: GLint,
   * a_texCoord: GLint}}
   * @private
   */
  static _initShaderArgs (gl, program) {
    // find shader arguments
    const shaderArgs = {}

    shaderArgs.u_projection = program.getUniformLocation('u_projection')
    shaderArgs.u_transform = program.getUniformLocation('u_transform')

    shaderArgs.u_texture = program.getUniformLocation('u_texture')

    shaderArgs.a_position = program.getAttributeLocation('a_position')
    gl.enableVertexAttribArray(shaderArgs.a_position)
    shaderArgs.a_texCoord = program.getAttributeLocation('a_texCoord')
    gl.enableVertexAttribArray(shaderArgs.a_texCoord)

    return shaderArgs
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @return {WebGLBuffer}
   * @private
   */
  static _initBuffers (gl) {
    // Create vertex buffer object.
    return gl.createBuffer()
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @param {WebGLBuffer}vertexBuffer
   * @param {{
   * u_projection:WebGLUniformLocation,
   * u_transform:WebGLUniformLocation,
   * u_texture:WebGLUniformLocation,
   * a_position: GLint,
   * a_texCoord: GLint}}shaderArgs
   * @param {Program}program
   */
  constructor (gl, vertexBuffer, shaderArgs, program) {
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {WebGLBuffer}
     */
    this.vertexBuffer = vertexBuffer
    /**
     * @type {{u_projection: WebGLUniformLocation, u_transform: WebGLUniformLocation, u_texture: WebGLUniformLocation, a_position: GLint, a_texCoord: GLint}}
     */
    this.shaderArgs = shaderArgs
    /**
     * @type {Program}
     */
    this.program = program
  }

  /**
   * @param {Texture} texture
   */
  setTexture (texture) {
    const gl = this.gl

    gl.uniform1i(this.shaderArgs.u_texture, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture.texture)
  }

  use () {
    this.program.use()
  }

  release () {
    const gl = this.gl
    gl.useProgram(null)
  }

  /**
   * @param {!Size}size
   * @param {number}maxXTexCoord
   * @param {number}maxYTexCoord
   * @param {Mat4}transformation
   */
  updateShaderData (size, maxXTexCoord, maxYTexCoord, transformation) {
    const { w, h } = size
    this.gl.viewport(0, 0, w, h)
    this.program.setUniformM4(this.shaderArgs.u_projection, [
      2.0 / w, 0, 0, 0,
      0, 2.0 / -h, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1
    ])
    this.program.setUniformM4(this.shaderArgs.u_transform, transformation.toArray)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    // TODO apply transformation
    // TODO add transformation uniform & do transform in shader
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      // First triangle
      // top left:
      0, 0, 0, 0,
      // top right:
      w, 0, maxXTexCoord, 0,
      // bottom right:
      w, h, maxXTexCoord, maxYTexCoord,

      // Second triangle
      // bottom right:
      w, h, maxXTexCoord, maxYTexCoord,
      // bottom left:
      0, h, 0, maxYTexCoord,
      // top left:
      0, 0, 0, 0
    ]), this.gl.DYNAMIC_DRAW)
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw () {
    const gl = this.gl
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT)
    gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

export default SceneShaderRGBA
