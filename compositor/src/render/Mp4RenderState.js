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

import RenderState from './RenderState'
import Texture from './Texture'
import Size from '../Size'

class Mp4RenderState extends RenderState {
  /**
   * @param {WebGLRenderingContext}gl
   * @param {String}mime
   * @return {Promise<Mp4RenderState>}
   */
  static async create (gl, mime) {
    // TODO check for media source support first
    const opaqueVideoElement = document.createElement('video')
    const alphaVideoElement = document.createElement('video')

    const opaqueMediaSource = new window.MediaSource()
    const alphaMediaSource = new window.MediaSource()

    opaqueVideoElement.src = URL.createObjectURL(opaqueMediaSource)
    alphaVideoElement.src = URL.createObjectURL(alphaMediaSource)

    const [opaqueSourceBuffer, alphaSourceBuffer] = await Promise.all([
      new Promise(resolve => {
        opaqueMediaSource.addEventListener('sourceopen', event => {
          URL.revokeObjectURL(opaqueVideoElement.src)
          const opaqueMediaSource = event.target
          const opaqueSourceBuffer = opaqueMediaSource.addSourceBuffer(mime)
          resolve(opaqueSourceBuffer)
        })
      }),
      new Promise(resolve => {
        alphaMediaSource.addEventListener('sourceopen', event => {
          URL.revokeObjectURL(alphaVideoElement.src)
          const alphaMediaSource = event.target
          const alphaSourceBuffer = alphaMediaSource.addSourceBuffer(mime)
          resolve(alphaSourceBuffer)
        })
      })
    ])

    return new Mp4RenderState(gl, opaqueVideoElement, alphaVideoElement, opaqueSourceBuffer, alphaSourceBuffer)
  }

  /**
   * @param {WebGLRenderingContext}gl
   * @param {HTMLVideoElement}opaqueVideoElement
   * @param {HTMLVideoElement}alphaVideoElement
   * @param {SourceBuffer}opaqueSourceBuffer
   * @param {SourceBuffer}alphaSourceBuffer
   */
  constructor (gl, opaqueVideoElement, alphaVideoElement, opaqueSourceBuffer, alphaSourceBuffer) {
    super()
    this.gl = gl
    /**
     * @type {!Texture}
     */
    this.opaqueTexture = Texture.create(this.gl, this.gl.RGBA)
    /**
     * @type {!Texture}
     */
    this.alphaTexture = Texture.create(this.gl, this.gl.RGBA)
    /**
     * @type {HTMLVideoElement}
     */
    this.opaqueVideoElement = opaqueVideoElement
    /**
     * @type {HTMLVideoElement}
     */
    this.alphaVideoElement = alphaVideoElement
    /**
     * @type {SourceBuffer}
     * @private
     */
    this._opaqueSourceBuffer = opaqueSourceBuffer
    /**
     * @type {SourceBuffer}
     * @private
     */
    this._alphaSourceBuffer = alphaSourceBuffer
    /**
     * @type {!Size}
     */
    this.size = Size.create(0, 0)
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @override
   */
  async update (encodedFrame) {
    const fragment = encodedFrame.pixelContent[0]

    const opaqueData = fragment.opaque
    const alphaData = fragment.alpha

    const start = Date.now()
    await Promise.all([
      new Promise(resolve => {
        this._opaqueSourceBuffer.onupdateend = resolve
        this._opaqueSourceBuffer.appendBuffer(opaqueData)
      }),
      alphaData ? new Promise(resolve => {
        this._alphaSourceBuffer.onupdateend = resolve
        this._alphaSourceBuffer.appendBuffer(alphaData)
      }) : Promise.resolve()
    ])
    console.log(`|- Decoding took ${Date.now() - start}ms`)
    this._opaqueSourceBuffer.onupdateend = null
    this._alphaSourceBuffer.onupdateend = null

    const videoWidth = this.opaqueVideoElement.videoWidth
    const videoHeight = this.opaqueVideoElement.videoHeight

    const isSubImage = this.size.w === videoWidth && this.size.h === videoHeight

    if (isSubImage) {
      this.opaqueTexture.subImage2dBuffer(this.opaqueVideoElement, 0, 0, videoWidth, videoHeight)
    } else {
      this.size = Size.create(videoWidth, videoHeight)
      this.opaqueTexture.image2dBuffer(this.opaqueVideoElement, videoWidth, videoHeight)
    }

    if (alphaData) {
      if (isSubImage) {
        this.alphaTexture.subImage2dBuffer(this.alphaVideoElement, 0, 0, videoWidth, videoHeight)
      } else {
        this.alphaTexture.image2dBuffer(this.alphaVideoElement, videoWidth, videoHeight)
      }
    }
  }
}

export default Mp4RenderState
