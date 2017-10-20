'use strict'

import YUVSurfaceShader from './YUVSurfaceShader'
import H264ViewState from './H264ViewState'
import BrowserDcBufferFactory from '../BrowserDcBufferFactory'

export default class GLRenderer {
  /**
   *
   * @param {HTMLCanvasElement} canvas
   * @param browserScene
   * @param browserSession
   * @returns {GLRenderer}
   */
  static create (canvas, browserScene, browserSession) {
    // const gl = window.WebGLDebugUtils.makeDebugContext(canvas.getContext('webgl'))
    // function logGLCall (functionName, args) {
    //   console.log('gl.' + functionName + '(' +
    //     window.WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ')')
    // }

    let gl = canvas.getContext('webgl')
    // gl = window.WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall)

    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL!')
    }

    this._initViewport(gl, canvas)
    // TODO this needs to be updated each time the canvas changes it's dimensions
    const projectionTransform = [
      2.0 / canvas.width, 0, 0, 0,
      0, 2.0 / -canvas.height, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1
    ]

    const yuvSurfaceShader = YUVSurfaceShader.create(gl)
    return new GLRenderer(gl, projectionTransform, yuvSurfaceShader, browserScene, browserSession)
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
   * @param {YUVSurfaceShader} yuvSurfaceShader
   * @param browserScene
   * @param browserSession
   */
  constructor (gl, projectionTransform, yuvSurfaceShader, browserScene, browserSession) {
    this.gl = gl
    this.projectionTransform = projectionTransform
    this.yuvSurfaceShader = yuvSurfaceShader
    this.browserScene = browserScene
    this.browserSession = browserSession
    this._renderBusy = false

    // TODO introduce a cursor layer and handle blob images that are placed above the rendered canvas. This allows
    // to implement a mouse cursor that can be moved without the main canvas scene to be updated
  }

  renderAll () {
    if (!this._renderBusy) {
      this._renderBusy = true
      window.requestAnimationFrame(() => {
        this._renderBusy = false
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        const browserSurfaceViewStack = this.browserScene.createBrowserSurfaceViewStack()
        browserSurfaceViewStack.forEach((view) => {
          this._render(view)
        })

        this.browserSession.flush()
      })
    }
  }

  /**
   *
   * @param {BrowserSurfaceView} view
   */
  _render (view) {
    const grBuffer = view.browserSurface.browserBuffer
    const browserRtcDcBuffer = BrowserDcBufferFactory.get(grBuffer)

    const drawSyncSerial = browserRtcDcBuffer.syncSerial

    if (browserRtcDcBuffer.isComplete(drawSyncSerial)) {
      const bufferSize = browserRtcDcBuffer.geo
      if (!view.renderState || view.renderState.size.w !== bufferSize.w || view.renderState.size.h !== bufferSize.h) {
        view.renderState = H264ViewState.create(this.gl, bufferSize)
      }
      // we have all required information to draw the view
      view.renderState.update(browserRtcDcBuffer.yuvContent, browserRtcDcBuffer.yuvWidth, browserRtcDcBuffer.yuvHeight)
      if (view.browserSurface.frameCallback) {
        const time = (new Date().getTime() | 0)
        view.browserSurface.frameCallback.done(time) // | 0 is js' way of casting to an int...
        view.browserSurface.frameCallback = null
      }
    } else {
      // buffer contents have not yet arrived, reschedule a scene repaint as soon as the buffer arrives.
      // The old state will be used to draw the view
      browserRtcDcBuffer.whenComplete(drawSyncSerial).then(() => {
        this.renderAll()
      }).catch((error) => {
        console.log(error)
      })
    }

    // paint the textures
    if (view.renderState) {
      const projectionTransform = this.projectionTransform
      const viewTransform = view.getTransform()

      this.yuvSurfaceShader.setSize(view.renderState.size)
      this.yuvSurfaceShader.setProjection(projectionTransform)
      this.yuvSurfaceShader.setTransform(viewTransform)
      this.yuvSurfaceShader.setTexture(view.renderState.YTexture, view.renderState.UTexture, view.renderState.VTexture)
      this.yuvSurfaceShader.draw()
    }
  }
}
