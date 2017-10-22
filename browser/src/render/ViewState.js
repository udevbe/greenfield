'use strict'

import YUVSurfaceShader from './YUVSurfaceShader'
import Texture from './Texture'
import Size from '../Size'

export default class ViewState {
  /**
   *
   * @returns {ViewState}
   */
  static create (view, size) {
    let gl = view.canvas.getContext('webgl')
    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL!')
    }

    const YTexture = Texture.create(gl, gl.LUMINANCE)
    const UTexture = Texture.create(gl, gl.LUMINANCE)
    const VTexture = Texture.create(gl, gl.LUMINANCE)

    const state = new ViewState(size, gl, YUVSurfaceShader.create(gl), YTexture, UTexture, VTexture)
    state.init(view, size)

    this._unfade(view.canvas, 0.1)

    return state
  }

  static _unfade (element, op) {
    if (op < 1) {
      window.requestAnimationFrame(() => {
        this._unfade(element, op)
      })
    }
    element.style.opacity = op
    element.style.filter = 'alpha(opacity=' + op * 100 + ')'
    op += op * 0.1
  }

  _initViewport () {
    // first time render for this output, clear it.
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight)
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
  }

  _initShader () {
    this.yuvSurfaceShader.use()
    this.yuvSurfaceShader.setSize(this.size)
    this.yuvSurfaceShader.setProjection([
      2.0 / this.size.w, 0, 0, 0,
      0, 2.0 / -this.size.h, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1
    ])
    this.yuvSurfaceShader.release()
  }

  /**
   *
   * @param {Size} size
   * @param gl
   * @param yuvSurfaceShader
   * @param YTexture
   * @param UTexture
   * @param VTexture
   */
  constructor (size, gl, yuvSurfaceShader, YTexture, UTexture, VTexture) {
    this.YTexture = YTexture
    this.UTexture = UTexture
    this.VTexture = VTexture
    this.gl = gl
    this.size = size
    this.yuvSurfaceShader = yuvSurfaceShader
  }

  init (view, size) {
    // TODO destroy textures
    view.canvas.width = size.w
    view.canvas.height = size.h

    this.size = size
    this._initViewport()
    this._initShader()
  }

  update (buffer, width, height) {
    if (!buffer) { return }

    const lumaSize = width * height
    const chromaSize = lumaSize >> 2

    const size = Size.create(width, height)
    const halfSize = size.getHalfSize()

    this.YTexture.fill(buffer.subarray(0, lumaSize), size)
    this.UTexture.fill(buffer.subarray(lumaSize, lumaSize + chromaSize), halfSize)
    this.VTexture.fill(buffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize)), halfSize)
  }

  paint () {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.yuvSurfaceShader.use()
    this.yuvSurfaceShader.setTexture(this.YTexture, this.UTexture, this.VTexture)
    this.yuvSurfaceShader.draw()
    this.yuvSurfaceShader.release()
  }

  // TODO handle state destruction
  // TODO optimize texture uploading by using surface/view damage info
}
