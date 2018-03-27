'use strict'

import ViewState from './ViewState'
import BrowserRtcBufferFactory from '../BrowserRtcBufferFactory'
import YUVASurfaceShader from './YUVASurfaceShader'
import YUVSurfaceShader from './YUVSurfaceShader'
import Size from '../Size'

export default class Renderer {
  /**
   *
   * @param {BrowserSession} browserSession
   * @returns {Renderer}
   */
  static create (browserSession) {
    // create offscreen gl context
    const canvas = document.createElement('canvas')
    let gl = canvas.getContext('webgl2', {
      antialias: false,
      depth: false,
      alpha: true,
      preserveDrawingBuffer: false
    })
    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL2!')
    }

    gl.clearColor(0, 0, 0, 0)
    const yuvaShader = YUVASurfaceShader.create(gl)
    const yuvShader = YUVSurfaceShader.create(gl)

    return new Renderer(browserSession, gl, yuvaShader, yuvShader, canvas)
  }

  /**
   * @param {GrBuffer}grBuffer
   * @return Size
   */
  static bufferSize (grBuffer) {
    if (grBuffer === null) {
      return Size.create(0, 0)
    }
    // TODO we could check for null here in case we are dealing with a different kind of buffer
    const browserRtcDcBuffer = BrowserRtcBufferFactory.get(grBuffer)
    return browserRtcDcBuffer.geo
  }

  /**
   * @name RenderFrame
   * @type{Promise<number>}
   * @property {Function} fire
   * @property {Function} then
   */
  /**
   * @return {RenderFrame}
   */
  static createRenderFrame () {
    let animationResolve = null
    const animationPromise = new Promise((resolve) => {
      animationResolve = resolve
    })
    animationPromise._animationResolve = animationResolve
    animationPromise.fire = () => {
      window.requestAnimationFrame((time) => {
        animationPromise._animationResolve(time)
      })
    }
    return animationPromise
  }

  /**
   * Use Renderer.create(..) instead.
   * @private
   * @param {BrowserSession}browserSession
   * @param {WebGLRenderingContext}gl
   * @param {YUVASurfaceShader}yuvaShader
   * @param {YUVSurfaceShader}yuvShader
   * @param {HTMLCanvasElement}canvas
   */
  constructor (browserSession, gl, yuvaShader, yuvShader, canvas) {
    /**
     * @type {BrowserSession}
     */
    this.browserSession = browserSession
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {YUVASurfaceShader}
     */
    this.yuvaShader = yuvaShader
    /**
     * @type {YUVSurfaceShader}
     */
    this.yuvShader = yuvShader
    /**
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @return Size
   */
  surfaceSize (browserSurface) {
    const grBuffer = browserSurface.state.grBuffer
    const bufferSize = Renderer.bufferSize(grBuffer)
    if (browserSurface.state.bufferScale === 1) {
      return bufferSize
    }
    const surfaceWidth = bufferSize.w / browserSurface.state.bufferScale
    const surfaceHeight = bufferSize.h / browserSurface.state.bufferScale
    return Size.create(surfaceWidth, surfaceHeight)
  }

  /**
   * @param {BrowserSurface}browserSurface
   */
  async renderBackBuffer (browserSurface) {
    const renderStart = Date.now()

    const grBuffer = browserSurface.shadowState.grBuffer
    const views = browserSurface.browserSurfaceViews

    if (grBuffer) {
      let viewState = browserSurface.renderState
      if (!viewState) {
        viewState = ViewState.create(this.gl)
        browserSurface.renderState = viewState
      }

      const browserRtcDcBuffer = BrowserRtcBufferFactory.get(grBuffer)
      const syncSerial = await browserRtcDcBuffer.whenComplete()

      browserSurface.size = this.surfaceSize(browserSurface)
      browserSurface.bufferSize = browserRtcDcBuffer.geo

      await this._draw(browserRtcDcBuffer, viewState, views)

      const renderDuration = Date.now() - renderStart
      browserRtcDcBuffer.resource.latency(syncSerial, renderDuration)
    } else {
      await window.Promise.all(views.map(async (browserSurfaceView) => {
        const emptyImage = new window.Image()
        emptyImage.src = '//:0'
        await browserSurfaceView.drawPNG(emptyImage)
      }))
      browserSurface.size = Size.create(0, 0)
      browserSurface.bufferSize = Size.create(0, 0)
    }
  }

  /**
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @return {Promise<void>}
   * @private
   */
  async _draw (browserRtcDcBuffer, viewState, views) {
    // update textures or image
    viewState.update(browserRtcDcBuffer)
    // paint the textures
    if (browserRtcDcBuffer.type === 'h264') {
      this._drawH264(browserRtcDcBuffer, viewState, views)
    } else { // if (browserRtcDcBuffer.type === 'png')
      await this._drawPNG(viewState, views)
    }
  }

  /**
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @private
   */
  _drawH264 (browserRtcDcBuffer, viewState, views) {
    const bufferSize = browserRtcDcBuffer.geo
    const viewPortUpdate = this.canvas.width !== bufferSize.w || this.canvas.height !== bufferSize.h
    this.canvas.width = bufferSize.w
    this.canvas.height = bufferSize.h

    if (browserRtcDcBuffer.alphaYuvContent != null) {
      this.yuvaShader.use()
      this.yuvaShader.draw(viewState.yTexture, viewState.uTexture, viewState.vTexture, viewState.alphaYTexture, bufferSize, viewPortUpdate)
    } else {
      this.yuvShader.use()
      this.yuvShader.draw(viewState.yTexture, viewState.uTexture, viewState.vTexture, bufferSize, viewPortUpdate)
    }

    // blit rendered texture from render canvas into view canvasses
    views.forEach((view) => {
      view.drawCanvas(this.canvas)
    })
  }

  /**
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @private
   */
  async _drawPNG (viewState, views) {
    await window.Promise.all(views.map(async (view) => {
      await view.drawPNG(viewState.pngImage)
    }))
  }
}
/**
 * @type {Promise<number>}
 * @private
 */
Renderer._animationPromise = null
/**
 * @type {Function}
 * @private
 */
Renderer._animationResolve = null
