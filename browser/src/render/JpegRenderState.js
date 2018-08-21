'use strict'

import Texture from './Texture'
import Size from '../Size'
import RenderState from './RenderState'
import BrowserEncodingOptions from '../BrowserEncodingOptions'

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
   * @param {BrowserEncodedFrame}browserEncodedFrame
   * @return {Promise<void>}
   * @override
   */
  async update (browserEncodedFrame) {
    const hasAlpha = BrowserEncodingOptions.splitAlpha(browserEncodedFrame.encodingOptions)
    const sizeChanged = !this.size.equals(browserEncodedFrame.size)
    if (sizeChanged) {
      this.size = browserEncodedFrame.size
    }

    await Promise.all(browserEncodedFrame.fragments.map(async (fragment) => {
      const opaqueImageBitmapPromise = window.createImageBitmap(new window.Blob([fragment.opaque], {'type': 'image/jpeg'}), 0, 0, fragment.geo.width, fragment.geo.height)
      let alphaImageBitmapPromise = null
      if (hasAlpha) {
        alphaImageBitmapPromise = window.createImageBitmap(new window.Blob([fragment.alpha], {'type': 'image/jpeg'}), 0, 0, fragment.geo.width, fragment.geo.height)
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
