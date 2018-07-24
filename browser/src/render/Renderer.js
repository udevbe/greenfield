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
    this._emptyImage = new window.Image(0, 0)
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
      views.forEach((view) => {
        view.draw(this._emptyImage, 0, 0, 0, 0)
      })
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
      for (let i = 0; i < bufferContents.fragments.length; i++) {
        const fragment = bufferContents.fragments[i]
        const {w: frameWidth, h: frameHeight} = bufferContents.size
        const {x0: fragmentX, y0: fragmentY} = fragment.geo

        if (fragment.alpha.length) {
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
          const imageBitmap = await window.createImageBitmap(this.canvas)
          views.forEach((view) => {
            view.draw(imageBitmap, frameWidth, frameHeight, fragmentX, fragmentY)
          })
        } else {
          const opaqueImageBlob = new window.Blob([fragment.opaque], {'type': bufferContents.encodingType})
          await this._drawImage(
            opaqueImageBlob, views,
            frameWidth, frameHeight, fragmentX, fragmentY,
            fragment.geo.width, fragment.geo.height
          )
        }
      }
    } else { // if (browserRtcDcBuffer.type === 'png')
      const opaqueImageBlob = new window.Blob([bufferContents.fragments[0].opaque], {'type': bufferContents.encodingType})
      await this._drawImage(
        opaqueImageBlob,
        views,
        bufferContents.size.w, bufferContents.size.h,
        0, 0,
        bufferContents.size.w, bufferContents.size.h
      )
    }
  }

  /**
   * @param {Blob}imageBlob
   * @param {Array<BrowserSurfaceView>}views
   * @param {number}frameWidth
   * @param {number}frameHeight
   * @param {number}fragmentX
   * @param {number}fragmentY
   * @param {number}fragmentWidth
   * @param {number}fragmentHeight
   * @private
   */
  async _drawImage (imageBlob, views, frameWidth, frameHeight, fragmentX, fragmentY, fragmentWidth, fragmentHeight) {
    const imageBitmap = await window.createImageBitmap(imageBlob)
    views.forEach((view) => {
      view.draw(imageBitmap, frameWidth, frameHeight, fragmentX, fragmentY)
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
