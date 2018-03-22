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

  static onAnimationFrame () {
    if (this._animationPromise === null) {
      this._armAnimationFramePromise()
    }
    return this._animationPromise
  }

  static _armAnimationFramePromise () {
    this._animationPromise = new Promise((resolve) => {
      window.requestAnimationFrame((time) => {
        this._animationPromise = null
        resolve(time)
      })
    })
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
   * @return {Promise<number[]>}
   */
  async requestRender (browserSurface) {
    const renderStart = Date.now()

    const grBuffer = browserSurface.state.grBuffer
    const views = browserSurface.browserSurfaceViews

    if (grBuffer === null) {
      views.forEach((browserSurfaceView) => {
        const emptyImage = new window.Image()
        emptyImage.src = '//:0'
        browserSurfaceView.drawPNG(emptyImage)
      })
    } else {
      let viewState = browserSurface.renderState
      if (!viewState) {
        viewState = ViewState.create(this.gl)
        browserSurface.renderState = viewState
      }

      const browserRtcDcBuffer = BrowserRtcBufferFactory.get(grBuffer)

      const syncSerial = await browserRtcDcBuffer.whenComplete()

      browserSurface.size = this.surfaceSize(browserSurface)
      browserSurface.bufferSize = browserRtcDcBuffer.geo

      this._draw(browserRtcDcBuffer, viewState, views)

      const renderDuration = Date.now() - renderStart
      browserRtcDcBuffer.resource.latency(syncSerial, renderDuration)
    }

    const drawPromises = []
    views.forEach(browserSurfaceView => {
      drawPromises.push(browserSurfaceView.onDraw())
    })

    return window.Promise.all(drawPromises)
  }

  /**
   * @param {BrowserRtcDcBuffer}browserRtcDcBuffer
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @private
   */
  _draw (browserRtcDcBuffer, viewState, views) {
    // update textures or image
    viewState.update(browserRtcDcBuffer)
    // paint the textures
    if (browserRtcDcBuffer.type === 'h264') {
      this._drawH264(browserRtcDcBuffer, viewState, views)
    } else { // if (browserRtcDcBuffer.type === 'png')
      this._drawPNG(viewState, views)
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
  _drawPNG (viewState, views) {
    views.forEach((view) => {
      view.drawPNG(viewState.pngImage)
    })
  }
}
/**
 * @type {Promise<number>}
 * @private
 */
Renderer._animationPromise = null
