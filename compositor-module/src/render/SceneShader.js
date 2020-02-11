import Program from './Program'
import ShaderCompiler from './ShaderCompiler'
import { FRAGMENT_ARGB8888, VERTEX_QUAD_TRANSFORM } from './ShaderSources'

class SceneShader {
  /**
   * @param {WebGLRenderingContext} gl
   * @returns {SceneShader}
   */
  static create (gl) {
    const program = this._initShaders(gl)
    const shaderArgs = this._initShaderArgs(gl, program)
    const vertexBuffer = this._initBuffers(gl)

    return new SceneShader(gl, vertexBuffer, shaderArgs, program)
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
    /**
     * @type {Size|null}
     * @private
     */
    this._sceneSize = null
  }

  use () {
    this.program.use()
  }

  release () {
    const gl = this.gl
    gl.useProgram(null)
  }

  /**
   * @param {Size}sceneSize
   */
  updateSceneData (sceneSize) {
    if (!this._sceneSize.equals(sceneSize)) {
      this._sceneSize = sceneSize
      const { w, h } = this._sceneSize
      this.gl.viewport(0, 0, w, h)
      this.program.setUniformM4(this.shaderArgs.u_projection, [
        2.0 / w, 0, 0, 0,
        0, 2.0 / -h, 0, 0,
        0, 0, 1, 0,
        -1, 1, 0, 1
      ])
    }
  }

  /**
   * @param {View}view
   */
  updateViewData (view) {
    const { texture, width: w, height: h, transformation } = view.renderState

    this.gl.uniform1i(this.shaderArgs.u_texture, 0)

    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture)

    this.program.setUniformM4(this.shaderArgs.u_transform, transformation.toArray)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
      // First triangle
      // top left:
      0, 0, 0, 0,
      // top right:
      w, 0, 1, 0,
      // bottom right:
      w, h, 1, 1,

      // Second triangle
      // bottom right:
      w, h, 1, 1,
      // bottom left:
      0, h, 0, 1,
      // top left:
      0, 0, 0, 0
    ]), this.gl.DYNAMIC_DRAW)
    this.gl.vertexAttribPointer(this.shaderArgs.a_position, 2, this.gl.FLOAT, false, 16, 0)
    this.gl.vertexAttribPointer(this.shaderArgs.a_texCoord, 2, this.gl.FLOAT, false, 16, 8)
  }

  draw () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6)
    this.gl.bindTexture(this.gl.TEXTURE_2D, null)
  }
}

export default SceneShader
