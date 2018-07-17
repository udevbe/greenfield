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
      this._drawImage(this._emptyImage, views, 0, 0)
    }
  }

  /**
   * @param {BrowserEncodedFrame}bufferContents
   * @param {ViewState}viewState
   * @param {Array<BrowserSurfaceView>}views
   * @private
   */
  async _draw (bufferContents, viewState, views) {
    if (bufferContents.encodingType === 'jpeg') {
      await Promise.all(bufferContents.fragments.map(async (fragment) => {
        if (fragment.alpha.length) {
          await this._drawJpegFragment(viewState, views, fragment)
        } else {
          this._drawImage(await fragment.asOpaqueImageElement(), views, fragment.geo.x0, fragment.geo.y0)
        }
      }))
    } else { // if (browserRtcDcBuffer.type === 'png')
      this._drawImage(await bufferContents.fragments[0].asOpaqueImageElement(), views, 0, 0)
    }
  }

  /**
   * @param {ViewState}viewState
   * @param {Array<BrowserSurfaceView>}views
   * @param {BrowserEncodedFrameFragment}fragment
   * @private
   */
  async _drawJpegFragment (viewState, views, fragment) {
    await viewState.updateFragment(fragment)
    if (this.canvas.width !== fragment.geo.width) {
      this.canvas.width = fragment.geo.width
    }
    if (this.canvas.height !== fragment.geo.height) {
      this.canvas.height = fragment.geo.height
    }

    this.jpegAlphaSurfaceShader.use()
    this.jpegAlphaSurfaceShader.draw(viewState.opaqueTexture, viewState.alphaTexture, fragment.geo)
    // blit rendered texture from render canvas into view canvasses
    views.forEach((view) => {
      view.drawCanvas(this.canvas, fragment.geo.x0, fragment.geo.y0)
    })
  }

  /**
   * @param {HTMLImageElement}image
   * @param {Array<BrowserSurfaceView>}views
   * @param {number}destinationX
   * @param {number}destinationY
   * @private
   */
  _drawImage (image, views, destinationX, destinationY) {
    views.forEach((view) => {
      view.drawImage(image, destinationX, destinationY)
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
