'use strict'

import ViewState from './ViewState'
import JpegAlphaSurfaceShader from './JpegAlphaSurfaceShader'

export default class Renderer {
  /**
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
    const jpegAlphaSurfaceShader = JpegAlphaSurfaceShader.create(gl)

    return new Renderer(browserSession, gl, jpegAlphaSurfaceShader, canvas)
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
   * @param {JpegAlphaSurfaceShader}jpegAlphaSurfaceShader
   * @param {HTMLCanvasElement}canvas
   */
  constructor (browserSession, gl, jpegAlphaSurfaceShader, canvas) {
    /**
     * @type {BrowserSession}
     */
    this.browserSession = browserSession
    /**
     * @type {WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {JpegAlphaSurfaceShader}
     */
    this.jpegAlphaSurfaceShader = jpegAlphaSurfaceShader
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
   * @param {{bufferContents: {type: string, syncSerial: number, geo: Size, yuvContent: Uint8Array, yuvWidth: number, yuvHeight: number, alphaYuvContent: Uint8Array, alphaYuvWidth: number, alphaYuvHeight: number, pngImage: HTMLImageElement}|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
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
      views.forEach((browserSurfaceView) => {
        browserSurfaceView.drawImage(this._emptyImage)
      })
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, pngImage: HTMLImageElement, content: HTMLImageElement, alphaContent: HTMLImageElement}}bufferContents
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @private
   */
  _draw (bufferContents, viewState, views) {
    // update textures or image
    viewState.update(bufferContents)
    // paint the textures
    if (bufferContents.type === 'jpeg') {
      this._drawJpeg(bufferContents, viewState, views)
    } else { // if (browserRtcDcBuffer.type === 'png')
      this._drawImage(viewState, views)
    }
  }

  /**
   * @param {{type: string, syncSerial: number, geo: Size, pngImage: HTMLImageElement, content: HTMLImageElement, alphaContent: HTMLImageElement}}bufferContents
   * @param {ViewState}viewState
   * @param {BrowserSurfaceView[]}views
   * @private
   */
  _drawJpeg (bufferContents, viewState, views) {
    const bufferSize = bufferContents.geo
    const viewPortUpdate = this.canvas.width !== bufferSize.w || this.canvas.height !== bufferSize.h
    this.canvas.width = bufferSize.w
    this.canvas.height = bufferSize.h

    if (bufferContents.alphaContent != null) {
      this.jpegAlphaSurfaceShader.use()
      this.jpegAlphaSurfaceShader.draw(viewState.opaqueTexture, viewState.alphaTexture, bufferSize, viewPortUpdate)
      // blit rendered texture from render canvas into view canvasses
      views.forEach((view) => {
        view.drawCanvas(this.canvas)
      })
    } else {
      views.forEach((view) => {
        view.drawImage(bufferContents.content)
      })
    }
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
