'use strict'
/**
 * Generic WebGL backed canvas that sets up: a quad to paint a texture on, appropriate vertex/fragment shaders,
 * scene parameters and other things. Specialized versions of this class can be created by overriding several
 * initialization methods.

 */
import Program from './Program'
import Shader from './Shader'
import Texture from './Texture'
import Script from './Script'
import error from '../utils/error'
import { makePerspective } from '../utils/glUtils'
import { Matrix } from 'sylvester.js'

const vertexShaderScript = Script.createFromSource('x-shader/x-vertex', `
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  varying highp vec2 vTextureCoord;
  void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
  }
`)

const fragmentShaderScript = Script.createFromSource('x-shader/x-fragment', `
  precision highp float;
  varying highp vec2 vTextureCoord;
  uniform sampler2D texture;
  void main(void) {
    gl_FragColor = texture2D(texture, vTextureCoord);
  }
`)

export default class WebGLCanvas {
  constructor (canvas, size, useFrameBuffer) {
    this.canvas = canvas
    this.size = size
    this.canvas.width = size.w
    this.canvas.height = size.h

    this.onInitWebGL()
    this.onInitShaders()
    this.initBuffers()

    if (useFrameBuffer) { this.initFramebuffer() }

    this.onInitTextures()
    this.initScene()
  }

  /**
   * Initialize a frame buffer so that we can render off-screen.
   */
  initFramebuffer () {
    const gl = this.gl

    // Create framebuffer object and texture.
    this.framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    this.framebufferTexture = new Texture(this.gl, this.size, gl.RGBA)

    // Create and allocate renderbuffer for depth data.
    const renderbuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.size.w, this.size.h)

    // Attach texture and renderbuffer to the framebuffer.
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.framebufferTexture.texture, 0)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer)
  }

  /**
   * Initialize vertex and texture coordinate buffers for a plane.
   */
  initBuffers () {
    let tmp
    const gl = this.gl

    // Create vertex position buffer.
    this.quadVPBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVPBuffer)
    tmp = [
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tmp), gl.STATIC_DRAW)
    this.quadVPBuffer.itemSize = 3
    this.quadVPBuffer.numItems = 4

    /*
     +--------------------+
     | -1,1 (1)           | 1,1 (0)
     |                    |
     |                    |
     |                    |
     |                    |
     |                    |
     | -1,-1 (3)          | 1,-1 (2)
     +--------------------+
     */

    const scaleX = 1.0
    const scaleY = 1.0

    // Create vertex texture coordinate buffer.
    this.quadVTCBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVTCBuffer)
    tmp = [
      scaleX, 0.0,
      0.0, 0.0,
      scaleX, scaleY,
      0.0, scaleY
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tmp), gl.STATIC_DRAW)
  }

  mvIdentity () {
    this.mvMatrix = Matrix.I(4)
  }

  mvMultiply (m) {
    this.mvMatrix = this.mvMatrix.x(m)
  }

  mvTranslate (m) {
    this.mvMultiply(Matrix.Translation($V([m[0], m[1], m[2]])).ensure4x4())
  }

  setMatrixUniforms () {
    this.program.setMatrixUniform('uPMatrix', new Float32Array(this.perspectiveMatrix.flatten()))
    this.program.setMatrixUniform('uMVMatrix', new Float32Array(this.mvMatrix.flatten()))
  }

  initScene () {
    const gl = this.gl

    // Establish the perspective with which we want to view the
    // scene. Our field of view is 45 degrees, with a width/height
    // ratio of 640:480, and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    this.perspectiveMatrix = makePerspective(45, 1, 0.1, 100.0)

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    this.mvIdentity()

    // Now move the drawing position a bit to where we want to start
    // drawing the square.
    this.mvTranslate([0.0, 0.0, -2.4])

    // Draw the cube by binding the array buffer to the cube's vertices
    // array, setting attributes, and pushing it to GL.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVPBuffer)
    gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    // Set the texture coordinates attribute for the vertices.

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVTCBuffer)
    gl.vertexAttribPointer(this.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0)

    this.onInitSceneTextures()

    this.setMatrixUniforms()

    if (this.framebuffer) {
      console.log('Bound Frame Buffer')
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    }
  }

  toString () {
    return 'WebGLCanvas Size: ' + this.size
  }

  checkLastError (operation) {
    const err = this.gl.getError()
    if (err !== this.gl.NO_ERROR) {
      let name = this.glNames[err]
      name = (name !== undefined) ? name + '(' + err + ')'
        : ('Unknown WebGL ENUM (0x' + value.toString(16) + ')')
      if (operation) {
        console.log('WebGL Error: %s, %s', operation, name)
      } else {
        console.log('WebGL Error: %s', name)
      }
      console.trace()
    }
  }

  onInitWebGL () {
    try {
      this.gl = this.canvas.getContext('experimental-webgl')
    } catch (e) {}

    if (!this.gl) {
      error('Unable to initialize WebGL. Your browser may not support it.')
    }
    if (this.glNames) {
      return
    }
    this.glNames = {}
    for (let propertyName in this.gl) {
      if (typeof this.gl[propertyName] === 'number') {
        this.glNames[this.gl[propertyName]] = propertyName
      }
    }
  }

  onInitShaders () {
    this.program = new Program(this.gl)
    this.program.attach(new Shader(this.gl, vertexShaderScript))
    this.program.attach(new Shader(this.gl, fragmentShaderScript))
    this.program.link()
    this.program.use()
    this.vertexPositionAttribute = this.program.getAttributeLocation('aVertexPosition')
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute)
    this.textureCoordAttribute = this.program.getAttributeLocation('aTextureCoord')
    this.gl.enableVertexAttribArray(this.textureCoordAttribute)
  }

  onInitTextures () {
    const gl = this.gl
    this.texture = new Texture(gl, this.size, gl.RGBA)
  }

  onInitSceneTextures () {
    this.texture.bind(0, this.program, 'texture')
  }

  drawScene () {
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }

  readPixels (buffer) {
    const gl = this.gl
    gl.readPixels(0, 0, this.size.w, this.size.h, gl.RGBA, gl.UNSIGNED_BYTE, buffer)
  }
}
