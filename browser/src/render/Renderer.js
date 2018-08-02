'use strict'

import ViewState from './ViewState'
import JpegAlphaSurfaceShader from './JpegAlphaSurfaceShader'
import BrowserEncodingOptions from '../BrowserEncodingOptions'
import JpegSurfaceShader from './JpegSurfaceShader'

export default class Renderer {
  /**
   * @returns {Renderer}
   */
  static create () {
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
    const jpegSurfaceShader = JpegSurfaceShader.create(gl)
    return new Renderer(gl, jpegAlphaSurfaceShader, jpegSurfaceShader, canvas)
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
   * @param {WebGLRenderingContext}gl
   * @param {JpegAlphaSurfaceShader}jpegAlphaSurfaceShader
   * @param {JpegSurfaceShader}jpegSurfaceShader
   * @param {HTMLCanvasElement}canvas
   */
  constructor (gl, jpegAlphaSurfaceShader, jpegSurfaceShader, canvas) {
    /**
     * @type {WebGLRenderingContext}
     */
    this._gl = gl
    /**
     * @type {JpegAlphaSurfaceShader}
     * @private
     */
    this._jpegAlphaSurfaceShader = jpegAlphaSurfaceShader
    /**
     * @type {JpegSurfaceShader}
     * @private
     */
    this._jpegSurfaceShader = jpegSurfaceShader
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._canvas = canvas

    this._viewDrawTotal = 0
    this._textureUpdateTotal = 0
    this._shaderInvocationTotal = 0
    this._count = 0
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
        viewState = ViewState.create(this._gl)
        browserSurface.renderState = viewState
      }
      await this._draw(bufferContents, viewState, views)
    } else {
      const emptyImage = new window.Image(0, 0)
      emptyImage.onload = async () => {
        const emptyImageBitmap = await window.createImageBitmap(this._canvas)
        views.forEach((view) => { view.draw(emptyImageBitmap) })
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
    this._count++

    const fullFrame = BrowserEncodingOptions.fullFrame(bufferContents.encodingOptions)
    const splitAlpha = BrowserEncodingOptions.splitAlpha(bufferContents.encodingOptions)
    const isJpeg = bufferContents.encodingType === 'image/jpeg'

    if (fullFrame && !splitAlpha && !isJpeg) {
      // Full frame, non-jpeg image without a separate alpha. Let the browser do all the drawing.
      const opaqueImageBitmap = await bufferContents.fragments[0].opaqueImageBitmap
      views.forEach((view) => { view.draw(opaqueImageBitmap) })
    } else if (isJpeg) {
      const {
        /**
         * @type {number}
         */
        w: frameWidth,
        /**
         * @type {number}
         */
        h: frameHeight
      } = bufferContents.size

      // We update the texture with the fragments as early as possible, this is to avoid gl state mixup with other
      // calls to _draw() while we're in await. If we were to do this call later, this.canvas will have state specifically
      // for our _draw() call, yet because we are in (a late) await, another call might adjust our canvas, which results
      // in bad draws/flashing/flickering/...
      let start = Date.now()
      await Promise.all(bufferContents.fragments.map(async (fragment) => {
        await viewState.updateFragment(bufferContents.size, fragment)
      }))
      this._textureUpdateTotal += Date.now() - start
      console.log('updating textures avg', this._textureUpdateTotal / this._count)

      if (BrowserEncodingOptions.splitAlpha(bufferContents.encodingOptions)) {
        // Image is in jpeg format with a separate alpha channel, shade & decode alpha & opaque fragments together using webgl.

        this._jpegAlphaSurfaceShader.use()
        this._jpegAlphaSurfaceShader.setTexture(viewState.opaqueTexture, viewState.alphaTexture)

        start = Date.now()
        const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
        if (canvasSizeChanged) {
          this._canvas.width = frameWidth
          this._canvas.height = frameHeight
          this._jpegAlphaSurfaceShader.updatePerspective(bufferContents.size)
        }

        // TODO we could try to optimize and only shade the fragments of the texture that were updated
        this._jpegAlphaSurfaceShader.draw(bufferContents.size, canvasSizeChanged)
        this._jpegAlphaSurfaceShader.release()
        this._shaderInvocationTotal += (Date.now() - start)
        console.log('shader invocation avg', this._shaderInvocationTotal / this._count)

        start = Date.now()
        const image = await window.createImageBitmap(this._canvas)
        views.forEach((view) => { view.draw(image) })
        this._viewDrawTotal += Date.now() - start
        console.log('drawing views avg', this._viewDrawTotal / this._count)
      } else {
        // Image is in jpeg format with no separate alpha channel, shade & decode opaque fragments using webgl.
        this._jpegSurfaceShader.use()
        this._jpegSurfaceShader.setTexture(viewState.opaqueTexture)

        const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
        if (canvasSizeChanged) {
          this._canvas.width = frameWidth
          this._canvas.height = frameHeight
          this._jpegSurfaceShader.updatePerspective(bufferContents.size)
        }

        this._jpegSurfaceShader.draw(bufferContents.size, canvasSizeChanged)
        this._jpegSurfaceShader.release()

        const image = await window.createImageBitmap(this._canvas)
        views.forEach((view) => { view.draw(image) })
      }
    } else {
      throw new Error(`Unsupported buffer. Encoding type: ${bufferContents.encodingType}, full frame:${fullFrame}, split alpha: ${splitAlpha}`)
    }
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
