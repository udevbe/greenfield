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

import EncodingOptions from '../remotestreaming/EncodingOptions'
import H264ToRGBA from './H264ToRGBA'
import Scene from './Scene'
import Size from '../Size'
import RenderState from './RenderState'

export default class Renderer {
  /**
   * @returns {Renderer}
   */
  static create (canvas, gl) {
    const scene = Scene.create(canvas, gl)
    const h264ToRGBA = H264ToRGBA.create(gl)
    return new Renderer(gl, h264ToRGBA, scene)
  }

  /**
   * Use Renderer.create(..) instead.
   * @private
   * @param {WebGLRenderingContext}gl
   * @param {H264ToRGBA}h264ToRGBA
   * @param {Scene}scene
   */
  constructor (gl, h264ToRGBA, scene) {
    /**
     * @type {WebGLRenderingContext}
     * @private
     */
    this._gl = gl
    /**
     * @type {H264ToRGBA}
     * @private
     */
    this._h264ToRGBA = h264ToRGBA
    /**
     * @type {Scene}
     */
    this.scene = scene
    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._emptyImage = new window.Image(0, 0)
    /**
     * @type {string}
     * @private
     */
    this._emptyImage.src = '//:0'
  }

  /**
   * @param {Surface}surface
   * @return {RenderState}
   * @private
   */
  _ensureRenderState (surface) {
    let renderState = surface.renderState
    if (!renderState) {
      renderState = RenderState.create(this._gl)
      surface.renderState = renderState
    }
    return renderState
  }

  /**
   * @param {Surface}surface
   * @param {!ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas}buffer
   * @param {number}width
   * @param {number}height
   * @private
   */
  _updateRenderState (surface, buffer, width, height) {
    const renderState = this._ensureRenderState(surface)
    const { texture, size: { w, h } } = renderState
    if (width === w && height === h) {
      texture.subImage2dBuffer(buffer, 0, 0, w, h)
    } else {
      renderState.size = Size.create(width, height)
      texture.image2dBuffer(buffer, width, height)
    }
  }

  /**
   * @param {Surface}surface
   * @param {SurfaceState}newState
   */
  async updateSurfaceRenderState (surface, newState) {
    const views = surface.views
    const bufferContents = newState.bufferContents

    if (bufferContents) {
      // window.GREENFIELD_DEBUG && console.log('|- Awaiting surface views draw.')
      // invokes mime type named drawing methods
      await this[bufferContents.mimeType](bufferContents, surface)
      views.forEach((view) => { view.mapped = true })
    } else {
      views.forEach((view) => { view.mapped = false })
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
      const frame = encodedFrame.pixelContent[0]
      const opaqueImageBlob = new window.Blob([frame.opaque], { type: 'image/png' })
      const imageBitmap = await window.createImageBitmap(opaqueImageBlob, 0, 0, frame.geo.width, frame.geo.height)

      this._updateRenderState(surface, imageBitmap, imageBitmap.width, imageBitmap.height)
    } else {
      // we don't support/care about fragmented pngs (and definitely not with a separate alpha channel as png has it internal)
      throw new Error(`Unsupported buffer. Encoding type: ${encodedFrame.mimeType}, full frame:${fullFrame}, split alpha: ${splitAlpha}`)
    }
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @param {Surface}surface
   * @return {Promise<void>}
   * @private
   */
  async ['video/h264'] (encodedFrame, surface) {
    const renderState = this._ensureRenderState(surface)
    await this._h264ToRGBA.decodeInto(encodedFrame, renderState.texture)
  }

  /**
   * @param {WebShmFrame}shmFrame
   * @param {Surface}surface
   * @return {Promise<void>}
   */
  ['image/rgba'] (shmFrame, surface) {
    const imageData = shmFrame.pixelContent
    this._updateRenderState(surface, imageData, imageData.width, imageData.height)
  }

  /**
   * @param {WebGLFrame}webGLFrame
   * @param surface
   * @return {Promise<void>}
   */
  ['image/canvas'] (webGLFrame, surface) {
    const canvas = webGLFrame.pixelContent
    this._updateRenderState(surface, canvas, canvas.width, canvas.height)
  }
}
