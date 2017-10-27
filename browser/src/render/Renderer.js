'use strict'

import ViewState from './ViewState'
import BrowserDcBufferFactory from '../BrowserDcBufferFactory'
import YUVSurfaceShader from './YUVSurfaceShader'

export default class Renderer {
  /**
   *
   * @param browserScene
   * @param browserSession
   * @returns {Renderer}
   */
  static create (browserScene, browserSession) {
    // create offscreen gl context
    const canvas = document.createElement('canvas')
    let gl = canvas.getContext('webgl')
    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL!')
    }

    gl.clearColor(0, 0, 0, 0)
    const yuvShader = YUVSurfaceShader.create(gl)
    yuvShader.use()
    return new Renderer(browserScene, browserSession, gl, yuvShader, canvas)
  }

  /**
   *
   * @param browserScene
   * @param browserSession
   * @param gl
   * @param yuvShader
   * @param canvas
   */
  constructor (browserScene, browserSession, gl, yuvShader, canvas) {
    this.browserScene = browserScene
    this.browserSession = browserSession
    this.gl = gl
    this.yuvShader = yuvShader
    this.canvas = canvas

    this._renderBusy = false
    this._timeOffset = new Date().getTime()
  }

  renderAll () {
    if (!this._renderBusy) {
      this._renderBusy = true
      window.requestAnimationFrame(() => {
        this._renderBusy = false
        const browserSurfaceViewStack = this.browserScene.createBrowserSurfaceViewStack()
        browserSurfaceViewStack.forEach((view) => { this._render(view) })
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
    if (grBuffer === null) {
      view.renderState = null
      return
    }

    const gl = this.gl
    const browserRtcDcBuffer = BrowserDcBufferFactory.get(grBuffer)

    const drawSyncSerial = browserRtcDcBuffer.syncSerial

    if (browserRtcDcBuffer.isComplete(drawSyncSerial)) {
      const bufferSize = browserRtcDcBuffer.geo
      view.canvas.width = bufferSize.w
      view.canvas.height = bufferSize.h
      if (!view.renderState) {
        view.renderState = ViewState.create(gl)
        view.unfade()
      }
      // we have all required information to draw the view
      view.renderState.update(browserRtcDcBuffer.yuvContent, browserRtcDcBuffer.yuvWidth, browserRtcDcBuffer.yuvHeight)
      this._nextFrame(view)
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
      this._paint(view)
      view.context2d.drawImage(this.canvas, 0, 0)
    }
  }

  _paint (view) {
    const gl = this.gl

    gl.viewport(0, 0, view.canvas.width, view.canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    this.canvas.width = view.canvas.width
    this.canvas.height = view.canvas.height

    this.yuvShader.setProjection([
      2.0 / view.canvas.width, 0, 0, 0,
      0, 2.0 / -view.canvas.height, 0, 0,
      0, 0, 1, 0,
      -1, 1, 0, 1
    ])
    this.yuvShader.setTexture(view.renderState.YTexture, view.renderState.UTexture, view.renderState.VTexture)
    this.yuvShader.draw({w: view.canvas.width, h: view.canvas.height})
  }

  _nextFrame (view) {
    if (view.browserSurface.frameCallback) {
      const time = new Date().getTime() - this._timeOffset
      view.browserSurface.frameCallback.done(time)
      view.browserSurface.frameCallback = null
    }
  }
}
