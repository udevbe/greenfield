// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

'use strict'

import EncodingOptions from '../remotestreaming/EncodingOptions'
import H264RenderState from './H264RenderState'
import YUVASurfaceShader from './YUVASurfaceShader'
import YUVSurfaceShader from './YUVSurfaceShader'
import VideoAlphaSurfaceShader from './VideoAlphaSurfaceShader'

export default class Renderer {
  /**
   * @returns {Renderer}
   */
  static create () {
    // create offscreen gl context
    const canvas = /** @type{HTMLCanvasElement} */document.createElement('canvas')
    const gl = canvas.getContext('webgl', {
      antialias: false,
      depth: false,
      alpha: true,
      preserveDrawingBuffer: false
    })
    if (!gl) {
      throw new Error('This browser doesn\'t support WebGL!')
    }

    gl.clearColor(0, 0, 0, 0)
    const yuvaSurfaceShader = YUVASurfaceShader.create(gl)
    const yuvSurfaceShader = YUVSurfaceShader.create(gl)
    const videoAlphaSurfaceShader = VideoAlphaSurfaceShader.create(gl)

    return new Renderer(gl, yuvaSurfaceShader, yuvSurfaceShader, videoAlphaSurfaceShader, canvas)
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
    const animationPromise = new Promise((resolve) => { animationResolve = resolve })
    animationPromise._animationResolve = animationResolve
    animationPromise.fire = () => window.requestAnimationFrame(time => animationPromise._animationResolve(time))
    return animationPromise
  }

  /**
   * Use Renderer.create(..) instead.
   * @private
   * @param {WebGLRenderingContext}gl
   * @param {YUVASurfaceShader}yuvaSurfaceShader
   * @param {YUVSurfaceShader}yuvSurfaceShader
   * @param {HTMLCanvasElement}canvas
   */
  constructor (gl, yuvaSurfaceShader, yuvSurfaceShader, videoAlphaSurfaceShader, canvas) {
    /**
     * @type {WebGLRenderingContext}
     */
    this._gl = gl
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

    this._videoAlphaSurfaceShader = videoAlphaSurfaceShader
    /**
     * @type {HTMLCanvasElement}
     * @private
     */
    this._canvas = canvas

    this._emptyImage = new window.Image(0, 0)
    this._emptyImage.src = '//:0'
  }

  /**
   * @param {Surface}surface
   * @param {SurfaceState}newState
   */
  async render (surface, newState) {
    const views = surface.views
    const bufferContents = newState.bufferContents

    if (bufferContents) {
      await this._draw(bufferContents, surface, views)
    } else {
      views.forEach((view) => { view.draw(this._emptyImage) })
    }
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @param {Surface}surface
   * @param {Array<View>}views
   * @return {Promise<void>}
   * @private
   */
  async ['image/png'] (encodedFrame, surface, views) {
    const fullFrame = EncodingOptions.fullFrame(encodedFrame.encodingOptions)
    const splitAlpha = EncodingOptions.splitAlpha(encodedFrame.encodingOptions)

    if (fullFrame && !splitAlpha) {
      // Full frame without a separate alpha. Let the browser do all the drawing.
      const img = new window.Image()
      img.src = URL.createObjectURL(new window.Blob([encodedFrame.pixelContent[0].opaque], { type: 'image/png' }))
      await new Promise(resolve => {
        img.onload = () => {
          resolve()
          URL.revokeObjectURL(img.src)
        }
      })
      views.forEach(view => view.draw(img))
    } else {
      // we don't support/care about fragmented pngs (and definitely not with a separate alpha channel as png has it internal)
      throw new Error(`Unsupported buffer. Encoding type: ${encodedFrame.mimeType}, full frame:${fullFrame}, split alpha: ${splitAlpha}`)
    }
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @param {Surface}surface
   * @param {Array<View>}views
   * @return {Promise<void>}
   * @private
   */
  async ['video/h264'] (encodedFrame, surface, views) {
    let renderState = surface.renderState
    if (!renderState) {
      renderState = H264RenderState.create(this._gl)
      surface.renderState = renderState
    }
    const h264RenderState = /** @type H264RenderState */ renderState

    const {
      /** @type {number} */ w: frameWidth,
      /** @type {number} */ h: frameHeight
    } = encodedFrame.size

    // We update the texture with the fragments as early as possible, this is to avoid gl state mixup with other
    // calls to _draw() while we're in await. If we were to do this call later, this.canvas will have state specifically
    // for our _draw() call, yet because we are in (a late) await, another call might adjust our canvas, which results
    // in bad draws/flashing/flickering/...
    await h264RenderState.update(encodedFrame)

    if (EncodingOptions.splitAlpha(encodedFrame.encodingOptions)) {
      // Image is in h264 format with a separate alpha channel, color convert alpha & yuv fragments to rgba using webgl.
      this._yuvaSurfaceShader.use()
      this._yuvaSurfaceShader.setTexture(h264RenderState.yTexture, h264RenderState.uTexture, h264RenderState.vTexture, h264RenderState.alphaTexture)

      const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
      if (canvasSizeChanged) {
        this._canvas.width = frameWidth
        this._canvas.height = frameHeight
        this._yuvaSurfaceShader.updateShaderData(encodedFrame.size, h264RenderState)
      }

      // TODO we could try to optimize and only shade the fragments of the texture that were updated
      this._yuvaSurfaceShader.draw()
      this._yuvaSurfaceShader.release()
      const imageBitmapStart = Date.now()
      const image = await window.createImageBitmap(this._canvas)
      console.log(`|- Create image bitmap took ${Date.now() - imageBitmapStart}ms`)
      views.forEach(view => view.draw(image))
    } else {
      // Image is in h264 format with no separate alpha channel, color convert yuv fragments to rgb using webgl.
      this._yuvSurfaceShader.use()
      this._yuvSurfaceShader.setTexture(h264RenderState.yTexture, h264RenderState.uTexture, h264RenderState.vTexture)

      const canvasSizeChanged = (this._canvas.width !== frameWidth) || (this._canvas.height !== frameHeight)
      if (canvasSizeChanged) {
        this._canvas.width = frameWidth
        this._canvas.height = frameHeight
        this._yuvSurfaceShader.updatePerspective(encodedFrame.size)
      }

      this._yuvSurfaceShader.draw(encodedFrame.size, canvasSizeChanged)
      this._yuvSurfaceShader.release()

      views.forEach(view => view.draw(this._canvas))
    }
  }

  /**
   * @param {WebShmFrame}shmFrame
   * @param surface
   * @param views
   * @return {Promise<void>}
   */
  ['image/rgba'] (shmFrame, surface, views) {
    const imageData = shmFrame.pixelContent
    views.forEach(view => view.draw(imageData))
  }

  /**
   * @param {WebGLFrame}webGLFrame
   * @param surface
   * @param views
   * @return {Promise<void>}
   */
  ['image/canvas'] (webGLFrame, surface, views) {
    // TODO if the source canvas is updated using an offscreen canvas, we can directly use the source canvas as the
    // front buffer and avoid doing a copy here. This is possible as the offscreen canvas will use double buffering to
    // update the source canvas and as such we don't have to use our own double buffering solution.
    const canvas = webGLFrame.pixelContent
    views.forEach(view => view.draw(canvas))
  }

  /**
   * @param {!BufferContents}bufferContents
   * @param {Surface}surface
   * @param {Array<View>}views
   * @private
   */

  async _draw (bufferContents, surface, views) {
    // invokes mime type named drawing methods
    await this[bufferContents.mimeType](bufferContents, surface, views)
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
