'use strict'

import JpegRenderState from './JpegRenderState'
import JpegAlphaSurfaceShader from './JpegAlphaSurfaceShader'
import BrowserEncodingOptions from '../BrowserEncodingOptions'
import JpegSurfaceShader from './JpegSurfaceShader'
import H264RenderState from './H264RenderState'
import YUVASurfaceShader from './YUVASurfaceShader'
import YUVSurfaceShader from './YUVSurfaceShader'

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

    const yuvaSurfaceShader = YUVASurfaceShader.create(gl)
    const yuvSurfaceShader = YUVSurfaceShader.create(gl)

    return new Renderer(gl, jpegAlphaSurfaceShader, jpegSurfaceShader, yuvaSurfaceShader, yuvSurfaceShader, canvas)
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
   * @param {YUVASurfaceShader}yuvaSurfaceShader
   * @param {YUVSurfaceShader}yuvSurfaceShader
   * @param {HTMLCanvasElement}canvas
   */
  constructor (gl, jpegAlphaSurfaceShader, jpegSurfaceShader, yuvaSurfaceShader, yuvSurfaceShader, canvas) {
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
     * @type {YUVASurfaceShader}
     * @private
     */
    this._yuvaSurfaceShader = yuvaSurfaceShader
    /**
     * @type {YUVSurfaceShader}
     * @private
     */
    this._yuvSurfaceShader = yuvSurfaceShader
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
  async render (browserSurface, newState) {
    const views = browserSurface.browserSurfaceViews
    const bufferContents = newState.bufferContents

    if (bufferContents) {
      await this._draw(bufferContents, browserSurface, views)
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
   * @param {BrowserEncodedFrame}browserEncodedFrame
   * @param {BrowserSurface}browserSurface
   * @param {Array<BrowserSurfaceView>}views
   * @return {Promise<void>}
   * @private
   */
  async ['image/jpeg'] (browserEncodedFrame, browserSurface, views) {
    let renderState = browserSurface.renderState
    if (!(renderState instanceof JpegRenderState)) {
      if (renderState) {
        renderState.destroy()
      }
      renderState = JpegRenderState.create(this._gl)
      browserSurface.renderState = renderState
    }
    const jpegRenderState = /** @type JpegRenderState */ renderState

    const {
      /** @type {number} */ w: frameWidth, /** @type {number} */ h: frameHeight
    } = browserEncodedFrame.size

    // We update the texture with the fragments as early as possible, this is to avoid gl state mixup with other
    // calls to _draw() while we're in await. If we were to do this call later, this.canvas will have state specifically
    // for our _draw() call, yet because we are in (a late) await, another call might adjust our canvas, which results
    // in bad draws/flashing/flickering/...
    let start = Date.now()
    await jpegRenderState.update(browserEncodedFrame)
    this._textureUpdateTotal += Date.now() - start
    console.log('updating textures avg', this._textureUpdateTotal / this._count)

    if (BrowserEncodingOptions.splitAlpha(browserEncodedFrame.encodingOptions)) {
      // Image is in jpeg format with a separate alpha channel, shade & decode alpha & opaque fragments together using webgl.

      this._jpegAlphaSurfaceShader.use()
      this._jpegAlphaSurfaceShader.setTexture(jpegRenderState.opaqueTexture, jpegRenderState.alphaTexture)

      start = Date.now()
      const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
      if (canvasSizeChanged) {
        this._canvas.width = frameWidth
        this._canvas.height = frameHeight
        this._jpegAlphaSurfaceShader.updatePerspective(browserEncodedFrame.size)
      }

      // TODO we could try to optimize and only shade the fragments of the texture that were updated
      this._jpegAlphaSurfaceShader.draw(browserEncodedFrame.size, canvasSizeChanged)
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
      this._jpegSurfaceShader.setTexture(jpegRenderState.opaqueTexture)

      const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
      if (canvasSizeChanged) {
        this._canvas.width = frameWidth
        this._canvas.height = frameHeight
        this._jpegSurfaceShader.updatePerspective(browserEncodedFrame.size)
      }

      this._jpegSurfaceShader.draw(browserEncodedFrame.size, canvasSizeChanged)
      this._jpegSurfaceShader.release()

      const image = await window.createImageBitmap(this._canvas)
      views.forEach((view) => { view.draw(image) })
    }
  }

  /**
   * @param {BrowserEncodedFrame}browserEncodedFrame
   * @param {BrowserSurface}browserSurface
   * @param {Array<BrowserSurfaceView>}views
   * @return {Promise<void>}
   * @private
   */
  async ['image/png'] (browserEncodedFrame, browserSurface, views) {
    const fullFrame = BrowserEncodingOptions.fullFrame(browserEncodedFrame.encodingOptions)
    const splitAlpha = BrowserEncodingOptions.splitAlpha(browserEncodedFrame.encodingOptions)

    if (fullFrame && !splitAlpha) {
      // Full frame without a separate alpha. Let the browser do all the drawing.
      const frame = browserEncodedFrame.fragments[0]
      const opaqueImageBlob = new window.Blob([frame.opaque], {'type': 'image/png'})
      const opaqueImageBitmap = await window.createImageBitmap(opaqueImageBlob, 0, 0, frame.geo.width, frame.geo.height)
      views.forEach((view) => { view.draw(opaqueImageBitmap) })
    } else {
      // we don't support/care about fragmented pngs (and definitely not with a separate alpha channel as png has it internal)
      throw new Error(`Unsupported buffer. Encoding type: ${browserEncodedFrame.encodingType}, full frame:${fullFrame}, split alpha: ${splitAlpha}`)
    }
  }

  /**
   * @param {BrowserEncodedFrame}browserEncodedFrame
   * @param {BrowserSurface}browserSurface
   * @param {Array<BrowserSurfaceView>}views
   * @return {Promise<void>}
   * @private
   */
  async ['video/h264'] (browserEncodedFrame, browserSurface, views) {
    let renderState = browserSurface.renderState
    if (!(renderState instanceof H264RenderState)) {
      if (renderState) {
        renderState.destroy()
      }
      renderState = H264RenderState.create(this._gl)
      browserSurface.renderState = renderState
    }
    const h264RenderState = /** @type H264RenderState */ renderState

    const {/** @type {number} */ w: frameWidth, /** @type {number} */ h: frameHeight} = browserEncodedFrame.size

    // We update the texture with the fragments as early as possible, this is to avoid gl state mixup with other
    // calls to _draw() while we're in await. If we were to do this call later, this.canvas will have state specifically
    // for our _draw() call, yet because we are in (a late) await, another call might adjust our canvas, which results
    // in bad draws/flashing/flickering/...
    let start = Date.now()
    await h264RenderState.update(browserEncodedFrame)

    if (BrowserEncodingOptions.splitAlpha(browserEncodedFrame.encodingOptions)) {
      // Image is in h264 format with a separate alpha channel, color convert alpha & yuv fragments to rgba using webgl.
      this._yuvaSurfaceShader.use()
      this._yuvaSurfaceShader.setTexture(h264RenderState.yTexture, h264RenderState.uTexture, h264RenderState.vTexture, h264RenderState.alphaTexture)

      start = Date.now()
      const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
      if (canvasSizeChanged) {
        this._canvas.width = frameWidth
        this._canvas.height = frameHeight
        this._yuvaSurfaceShader.updatePerspective(browserEncodedFrame.size)
      }

      // TODO we could try to optimize and only shade the fragments of the texture that were updated
      this._yuvaSurfaceShader.draw(browserEncodedFrame.size, canvasSizeChanged)
      this._yuvaSurfaceShader.release()
      this._shaderInvocationTotal += (Date.now() - start)
      console.log('shader invocation avg', this._shaderInvocationTotal / this._count)

      start = Date.now()
      const image = await window.createImageBitmap(this._canvas)
      views.forEach((view) => { view.draw(image) })
      this._viewDrawTotal += Date.now() - start
      console.log('drawing views avg', this._viewDrawTotal / this._count)
    } else {
      // Image is in h264 format with no separate alpha channel, color convert yuv fragments to rgb using webgl.
      this._yuvSurfaceShader.use()
      this._yuvSurfaceShader.setTexture(h264RenderState.yTexture, h264RenderState.uTexture, h264RenderState.vTexture)

      const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
      if (canvasSizeChanged) {
        this._canvas.width = frameWidth
        this._canvas.height = frameHeight
        this._yuvSurfaceShader.updatePerspective(browserEncodedFrame.size)
      }

      this._yuvSurfaceShader.draw(browserEncodedFrame.size, canvasSizeChanged)
      this._yuvSurfaceShader.release()

      const image = await window.createImageBitmap(this._canvas)
      views.forEach((view) => { view.draw(image) })
    }
  }

  /**
   * @param {BrowserEncodedFrame}bufferContents
   * @param {BrowserSurface}browserSurface
   * @param {Array<BrowserSurfaceView>}views
   * @private
   */
  async _draw (bufferContents, browserSurface, views) {
    this._count++
    // invokes mime type named drawing methods
    await this[bufferContents.encodingType](bufferContents, browserSurface, views)
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
