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
   * @param {BrowserEncodedFrame}browserEncodedFrame
   * @return {Promise<void>}
   * @override
   */
  async update (browserEncodedFrame) {
    const {alpha, opaque} = (await this._h264BufferContentDecoder.decode(browserEncodedFrame)).result

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

    const isSubImage = browserEncodedFrame.size.equals(this.size)

    const chromaWidth = browserEncodedFrame.size.w >> 1
    const chromaHeight = browserEncodedFrame.size.h >> 1
    const chromaStride = opaqueWidth >> 1
    if (isSubImage) {
      this.yTexture.subImage2dBuffer(yBuffer, Rect.create(0, 0, browserEncodedFrame.size.w, browserEncodedFrame.size.h), opaqueWidth)
      this.uTexture.subImage2dBuffer(uBuffer, Rect.create(0, 0, chromaWidth, chromaHeight), chromaStride)
      this.vTexture.subImage2dBuffer(vBuffer, Rect.create(0, 0, chromaWidth, chromaHeight), chromaStride)
    } else {
      this.yTexture.image2dBuffer(yBuffer, browserEncodedFrame.size.w, browserEncodedFrame.size.h, opaqueWidth)
      this.uTexture.image2dBuffer(uBuffer, chromaWidth, chromaHeight, chromaStride)
      this.vTexture.image2dBuffer(vBuffer, chromaWidth, chromaHeight, chromaStride)
    }

    if (alpha) {
      const alphaWidth = alpha.width // stride
      const alphaHeight = alpha.height // padded with filler rows
      const alphaLumaSize = alphaWidth * alphaHeight

      const alphaBuffer = alpha.buffer.subarray(0, alphaLumaSize)
      if (isSubImage) {
        this.alphaTexture.subImage2dBuffer(alphaBuffer, Rect.create(0, 0, browserEncodedFrame.size.w, browserEncodedFrame.size.h), alphaWidth)
      } else {
        this.alphaTexture.image2dBuffer(alphaBuffer, browserEncodedFrame.size.w, browserEncodedFrame.size.h, alphaWidth)
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
  }
}
