'use strict'

import RGBASurfaceShader from './RGBASurfaceShader'
import YUVSurfaceShader from './YUVSurfaceShader'
import H264ViewState from './H264ViewState'
import BrowserDcBufferFactory from '../BrowserDcBufferFactory'

export default class GLRenderer {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @returns {GLRenderer}
   */
  static create (canvas) {
    const gl = canvas.getContext('webgl')
    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL!')
    }

    this._initViewport(gl, canvas)
    // TODO this needs to be updated each time the canvas changes it's dimensions
    const projectionTransform = [
      2.0 / canvas.width, 0, 0, -1,
      0, 2.0 / -canvas.height, 0, 1,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]

    const rgbaSurfaceShader = RGBASurfaceShader.create(gl)
    const yuvSurfaceShader = YUVSurfaceShader.create(gl)

    return new GLRenderer(gl, projectionTransform, rgbaSurfaceShader, yuvSurfaceShader)
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {HTMLCanvasElement} canvas
   * @private
   */
  static _initViewport (gl, canvas) {
    const width = canvas.width
    const height = canvas.height

    // first time render for this output, clear it.
    gl.viewport(0, 0, width, height)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  /**
   *
   * @param {WebGLRenderingContext} gl
   * @param {Array} projectionTransform
   * @param {RGBASurfaceShader} rgbaSurfaceShader
   * @param {YUVSurfaceShader} yuvSurfaceShader
   */
  constructor (gl, projectionTransform, rgbaSurfaceShader, yuvSurfaceShader) {
    this.gl = gl
    this.projectionTransform = projectionTransform
    this.rgbaSurfaceShader = rgbaSurfaceShader
    this.yuvSurfaceShader = yuvSurfaceShader

    // TODO introduce a cursor layer and handle blob images that are placed above the rendered canvas. This allows
    // to implement a mouse cursor that can be moved without the main canvas scene to be updated
  }

  /**
   *
   * @param {BrowserSurfaceView} view
   */
  render (view) {
    const browserBuffer = view.browserSurface.browserBuffer
    const browserRtcDcBuffer = BrowserDcBufferFactory.get(browserBuffer.grBufferResource)

    const drawSyncSerial = browserRtcDcBuffer.syncSerial
    const bufferSize = browserRtcDcBuffer.geo

    browserRtcDcBuffer.whenComplete(drawSyncSerial).then(() => {
      // TODO use a scheduled rendering task that fires when no more tasks are to be done
      // TODO use a webworker for decoding & rendering

      if (!view.renderState || view.renderState.size.w !== bufferSize.w || view.renderState.size.h !== bufferSize.h) {
        view.renderState = H264ViewState.create(this.gl, bufferSize)
      }

      // updates the renderState's yuv textures
      view.renderState.decode(browserRtcDcBuffer.h264Nal)
      // paint the textures
      this.yuvSurfaceShader.setSize(view.renderState.size)
      this.yuvSurfaceShader.setTexture(view.renderState.YTexture, view.renderState.UTexture, view.renderState.VTexture)
      this.yuvSurfaceShader.setProjection(this.projectionTransform)
      this.yuvSurfaceShader.setTransform(view.getTransform())
      this.yuvSurfaceShader.draw()
    })
  }
}
