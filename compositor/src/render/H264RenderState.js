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

import Texture from './Texture'
import Size from '../Size'
import RenderState from './RenderState'
import H264BufferContentDecoder from './H264BufferContentDecoder'
import Rect from '../math/Rect'

/**
 * @implements RenderState
 */
export default class H264RenderState extends RenderState {
  /**
   * @param {!WebGLRenderingContext}gl
   * @returns {!H264RenderState}
   */
  static create (gl) {
    const h264BufferContentDecoder = H264BufferContentDecoder.create()
    return new H264RenderState(gl, h264BufferContentDecoder)
  }

  /**
   * Use ViewState.create(..) instead.
   * @param {!WebGLRenderingContext}gl
   * @param {!H264BufferContentDecoder}h264BufferContentDecoder
   * @private
   */
  constructor (gl, h264BufferContentDecoder) {
    super()
    /**
     * @type {!WebGLRenderingContext}
     */
    this.gl = gl
    /**
     * @type {!Texture}
     */
    this.yTexture = Texture.create(this.gl, this.gl.LUMINANCE)
    /**
     * @type {!Texture}
     */
    this.uTexture = Texture.create(this.gl, this.gl.LUMINANCE)
    /**
     * @type {!Texture}
     */
    this.vTexture = Texture.create(this.gl, this.gl.LUMINANCE)
    /**
     * @type {!Texture}
     */
    this.alphaTexture = Texture.create(this.gl, this.gl.LUMINANCE)
    /**
     * @type {!Size}
     */
    this.size = Size.create(0, 0)
    /**
     * @type {!H264BufferContentDecoder}
     * @private
     */
    this._h264BufferContentDecoder = h264BufferContentDecoder
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @return {Promise<void>}
   * @override
   */
  async update (encodedFrame) {
    const { alpha, opaque } = await this._h264BufferContentDecoder.decode(encodedFrame)

    // the width & height returned are actually paddded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueBuffer = opaque.buffer
    const opaqueWidth = opaque.width // stride
    const opaqueHeight = opaque.height // padded with filler rows

    const lumaSize = opaqueWidth * opaqueHeight
    const chromaSize = lumaSize >> 2

    const yBuffer = opaqueBuffer.subarray(0, lumaSize)
    const uBuffer = opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize)
    const vBuffer = opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + (2 * chromaSize))

    const isSubImage = encodedFrame.size.equals(this.size)

    const chromaWidth = encodedFrame.size.w >> 1
    const chromaHeight = encodedFrame.size.h >> 1
    const chromaStride = opaqueWidth >> 1
    if (isSubImage) {
      this.yTexture.subImage2dBuffer(yBuffer, Rect.create(0, 0, encodedFrame.size.w, encodedFrame.size.h), opaqueWidth)
      this.uTexture.subImage2dBuffer(uBuffer, Rect.create(0, 0, chromaWidth, chromaHeight), chromaStride)
      this.vTexture.subImage2dBuffer(vBuffer, Rect.create(0, 0, chromaWidth, chromaHeight), chromaStride)
    } else {
      this.yTexture.image2dBuffer(yBuffer, encodedFrame.size.w, encodedFrame.size.h, opaqueWidth)
      this.uTexture.image2dBuffer(uBuffer, chromaWidth, chromaHeight, chromaStride)
      this.vTexture.image2dBuffer(vBuffer, chromaWidth, chromaHeight, chromaStride)
    }

    if (alpha) {
      const alphaWidth = alpha.width // stride
      const alphaHeight = alpha.height // padded with filler rows
      const alphaLumaSize = alphaWidth * alphaHeight

      const alphaBuffer = alpha.buffer.subarray(0, alphaLumaSize)
      if (isSubImage) {
        this.alphaTexture.subImage2dBuffer(alphaBuffer, Rect.create(0, 0, encodedFrame.size.w, encodedFrame.size.h), alphaWidth)
      } else {
        this.alphaTexture.image2dBuffer(alphaBuffer, encodedFrame.size.w, encodedFrame.size.h, alphaWidth)
      }
    }
  }

  /**
   * @override
   */
  destroy () {
    this.yTexture.delete()
    this.uTexture.delete()
    this.vTexture.delete()
    this.alphaTexture.delete()
    this._h264BufferContentDecoder.destroy()
  }
}
