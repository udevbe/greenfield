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
    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._emptyImage = new window.Image()
    this._emptyImage.src = '//:0'
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamage: Number, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number}} newState
   */
  renderBackBuffer (browserSurface, newState) {
    const views = browserSurface.browserSurfaceViews
    const bufferContents = newState.bufferContents

    if (bufferContents) {
      let viewState = browserSurface.renderState
      if (!viewState) {
        viewState = ViewState.create(this.gl)
        browserSurface.renderState = viewState
      }

      this._draw(bufferContents, viewState, views)
    } else {
      console.trace('rendering empty surface')
      views.forEach((browserSurfaceView) => {
        browserSurfaceView.drawImage(this._emptyImage)
      })
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}}bufferContents
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @private
   */
  _draw (bufferContents, viewState, views) {
    // update textures or image
    viewState.update(bufferContents)
    // paint the textures
    if (bufferContents.type === 'h264') {
      this._drawH264(bufferContents, viewState, views)
    } else { // if (browserRtcDcBuffer.type === 'png')
      this._drawImage(viewState, views)
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}}bufferContents
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @private
   */
  _drawH264 (bufferContents, viewState, views) {
    const bufferSize = bufferContents.geo
    const viewPortUpdate = this.canvas.width !== bufferSize.w || this.canvas.height !== bufferSize.h
    this.canvas.width = bufferSize.w
    this.canvas.height = bufferSize.h

    if (bufferContents.alphaYuvContent != null) {
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
  _drawImage (viewState, views) {
    views.forEach((view) => {
      view.drawImage(viewState.image)
    })
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
