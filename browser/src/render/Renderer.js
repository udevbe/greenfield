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
  }

  /**
   * @param {BrowserSurface}browserSurface
   * @param {{bufferContents: BrowserEncodedFrame|null, bufferDamageRects: Array<Rect>, opaquePixmanRegion: number, inputPixmanRegion: number, dx: number, dy: number, bufferTransform: number, bufferScale: number, frameCallbacks: Array<BrowserCallback>, roleState: *}}newState
   */
  async renderBackBuffer (browserSurface, newState) {
    const views = browserSurface.browserSurfaceViews
    const bufferContents = newState.bufferContents

    if (bufferContents) {
      let viewState = browserSurface.renderState
      if (!viewState) {
        viewState = ViewState.create(this.gl)
        browserSurface.renderState = viewState
      }
      await this._draw(bufferContents, viewState, views)
    } else {
      const emptyImage = new window.Image(0, 0)
      emptyImage.onload = async () => {
        const image = await window.createImageBitmap(this.canvas)
        await this._drawViews(image, views)
      }
      emptyImage.src = '//:0'
    }
  }

  /**
   * @param {BrowserEncodedFrame}bufferContents
   * @param {ViewState}viewState
   * @param {Array<BrowserSurfaceView>}views
   * @private
   */
  async _draw (bufferContents, viewState, views) {
    const {w: frameWidth, h: frameHeight} = bufferContents.size

    if (bufferContents.encodingType === 'image/jpeg') {
      const canvasSizeChanged = (this.canvas.width !== frameWidth) || (this.canvas.height !== frameHeight)
      if (canvasSizeChanged) {
        this.canvas.width = frameWidth
        this.canvas.height = frameHeight
      }

      for (let i = 0; i < bufferContents.fragments.length; i++) {
        const fragment = bufferContents.fragments[i]
        // if (fragment.alpha.length) {
        await viewState.updateFragment(bufferContents.size, fragment)

        this.jpegAlphaSurfaceShader.use()
        this.jpegAlphaSurfaceShader.draw(viewState.opaqueTexture, viewState.alphaTexture, bufferContents.size, canvasSizeChanged)
      }
      const image = await window.createImageBitmap(this.canvas)
      await this._drawViews(image, views)
    } else { // if (browserRtcDcBuffer.type === 'png')
      await this._drawViews(await bufferContents.fragments[0].opaqueImageBitmap, views)
    }
  }

  /**
   * @param {ImageBitmap|HTMLCanvasElement|HTMLImageElement}image
   * @param {Array<BrowserSurfaceView>}views
   * @private
   */
  async _drawViews (image, views) {
    await Promise.all(views.map(async (view) => {
      await view.draw(image)
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
