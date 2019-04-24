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
import EncodingOptions from '../remotestreaming/EncodingOptions'

/**
 * @implements RenderState
 */
export default class JpegRenderState extends RenderState {
  /**
   * @param {!WebGLRenderingContext}gl
   * @returns {!JpegRenderState}
   */
  static create (gl) {
    return new JpegRenderState(gl)
  }

  /**
   * Use ViewState.create(..) instead.
   * @param {!WebGLRenderingContext}gl
   * @private
   */
  constructor (gl) {
    super()
    /**
     * @type {!WebGLRenderingContext}
     */
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
     * @type {!Size}
     */
    this.size = Size.create(0, 0)
  }

  /**
   * @param {EncodedFrame}encodedFrame
   * @return {Promise<void>}
   * @override
   */
  async update (encodedFrame) {
    const hasAlpha = EncodingOptions.splitAlpha(encodedFrame.encodingOptions)
    const sizeChanged = !this.size.equals(encodedFrame.size)
    if (sizeChanged) {
      this.size = encodedFrame.size
    }

    await Promise.all(encodedFrame.pixelContent.map(async (fragment) => {
      const opaqueImageBitmapPromise = window.createImageBitmap(new window.Blob([fragment.opaque], { 'type': 'image/jpeg' }), 0, 0, fragment.geo.width, fragment.geo.height)
      let alphaImageBitmapPromise = null
      if (hasAlpha) {
        alphaImageBitmapPromise = window.createImageBitmap(new window.Blob([fragment.alpha], { 'type': 'image/jpeg' }), 0, 0, fragment.geo.width, fragment.geo.height)
      }

      if (sizeChanged) {
        this.opaqueTexture.image2dElement(await opaqueImageBitmapPromise)
        if (hasAlpha) {
          this.alphaTexture.image2dElement(await alphaImageBitmapPromise)
        }
      } else {
        this.opaqueTexture.subImage2dElement(await opaqueImageBitmapPromise, fragment.geo)
        if (hasAlpha) {
          this.alphaTexture.subImage2dElement(await alphaImageBitmapPromise, fragment.geo)
        }
      }
    }))
  }

  /**
   * @override
   */
  destroy () {
    this.opaqueTexture.delete()
    this.alphaTexture.delete()
  }
}
