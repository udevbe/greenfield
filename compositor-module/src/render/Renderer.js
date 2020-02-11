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
import Scene from './Scene'
import Size from '../Size'

export default class Renderer {
  /**
   * @returns {Renderer}
   */
  static create () {
    return new Renderer()
  }

  /**
   * Use Renderer.create(..) instead.
   * @private
   */
  constructor () {
    /**
     * @type {Object.<number, Scene>}
     */
    this.scenes = {}
    /**
     * @type {HTMLImageElement}
     * @private
     */
    this._emptyImage = new Image(0, 0)
    /**
     * @type {string}
     * @private
     */
    this._emptyImage.src = '//:0'
  }

  /**
   * @param {View}view
   * @param {!ImageBitmap | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas}buffer
   * @param {number}width
   * @param {number}height
   * @private
   */
  _updateRenderState (view, buffer, width, height) {
    const { texture, size: { w, h } } = view.renderState
    if (width === w && height === h) {
      texture.subImage2dBuffer(buffer, 0, 0, w, h)
    } else {
      view.renderState.size = Size.create(width, height)
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
      const renderStateUpdates = []
      views.forEach(view => {
        renderStateUpdates.push(this[bufferContents.mimeType](bufferContents, view))
        view.mapped = true
      })
      await Promise.all(renderStateUpdates)
    } else {
      views.forEach(view => { view.mapped = false })
    }
  }

  render () {
    this.scenes.forEach(scene => scene.render())
  }

  /**
   * @param {string}sceneId
   * @param {HTMLCanvasElement|OffscreenCanvas}canvas
   * @return {Scene|null}
   */
  initScene (sceneId, canvas) {
    let scene = this.scenes[sceneId] || null
    if (scene) {
      return scene
    } else {
      const gl = canvas.getContext('webgl', {
        antialias: false,
        depth: false,
        alpha: false,
        preserveDrawingBuffer: false,
        desynchronized: true
      })
      if (!gl) {
        throw new Error('This browser doesn\'t support WebGL!')
      }
      scene = Scene.create(gl, canvas)
      this.scenes = { ...this.scenes, [sceneId]: scene }
      scene.onDestroy().then(() => {
        this.scenes = this.scenes.filter(otherScene => otherScene !== scene)
        scene.topLevelViews.forEach(view => view.destroy())
      })
    }
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @param {View}view
   * @return {Promise<void>}
   * @private
   */
  async ['image/png'] (encodedFrame, view) {
    const fullFrame = EncodingOptions.fullFrame(encodedFrame.encodingOptions)
    const splitAlpha = EncodingOptions.splitAlpha(encodedFrame.encodingOptions)

    if (fullFrame && !splitAlpha) {
      // Full frame without a separate alpha. Let the browser do all the drawing.
      const frame = encodedFrame.pixelContent[0]
      const opaqueImageBlob = new Blob([frame.opaque], { type: 'image/png' })
      const imageBitmap = await createImageBitmap(opaqueImageBlob, 0, 0, frame.geo.width, frame.geo.height)

      this._updateRenderState(view, imageBitmap, imageBitmap.width, imageBitmap.height)
    } else {
      // we don't support/care about fragmented pngs (and definitely not with a separate alpha channel as png has it internal)
      throw new Error(`Unsupported buffer. Encoding type: ${encodedFrame.mimeType}, full frame:${fullFrame}, split alpha: ${splitAlpha}`)
    }
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @param {View}view
   * @return {Promise<void>}
   * @private
   */
  ['video/h264'] (encodedFrame, view) {
    return view.scene.h264ToRGBA.decodeInto(encodedFrame, view.renderState.texture)
  }

  /**
   * @param {WebShmFrame}shmFrame
   * @param {View}view
   * @return {Promise<void>}
   */
  ['image/rgba'] (shmFrame, view) {
    const imageData = shmFrame.pixelContent
    this._updateRenderState(view, imageData, imageData.width, imageData.height)
  }

  /**
   * @param {WebGLFrame}webGLFrame
   * @param {View}view
   * @return {Promise<void>}
   */
  ['image/canvas'] (webGLFrame, view) {
    const canvas = webGLFrame.pixelContent
    this._updateRenderState(view, canvas, canvas.width, canvas.height)
  }
}
