// Copyright 2020 Erik De Rijcke
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

import { OpaqueAndAlphaPlanes } from '../remotestreaming/DecodedFrame'
import Size from '../Size'
import View from '../View'
import RenderState from './RenderState'
import Texture from './Texture'
import YUV2RGBShader from './YUV2RGBShader'
import YUVA2RGBAShader from './YUVA2RGBAShader'

class YUVAToRGBA {
  readonly yTexture: Texture
  readonly uTexture: Texture
  readonly vTexture: Texture
  readonly alphaTexture: Texture
  readonly gl: WebGLRenderingContext
  readonly framebuffer: WebGLFramebuffer
  readonly yuvaSurfaceShader: YUVA2RGBAShader
  readonly yuvSurfaceShader: YUV2RGBShader

  static create(gl: WebGLRenderingContext): YUVAToRGBA {
    gl.clearColor(0, 0, 0, 0)

    const yTexture = Texture.create(gl, gl.LUMINANCE)
    const uTexture = Texture.create(gl, gl.LUMINANCE)
    const vTexture = Texture.create(gl, gl.LUMINANCE)
    const alphaTexture = Texture.create(gl, gl.LUMINANCE)

    const yuvaSurfaceShader = YUVA2RGBAShader.create(gl)
    const yuvSurfaceShader = YUV2RGBShader.create(gl)

    const framebuffer = gl.createFramebuffer()
    if (framebuffer === null) {
      throw new Error('Failed to create webgl framebuffer')
    }

    return new YUVAToRGBA(
      gl,
      yuvaSurfaceShader,
      yuvSurfaceShader,
      framebuffer,
      yTexture,
      uTexture,
      vTexture,
      alphaTexture,
    )
  }

  private constructor(
    gl: WebGLRenderingContext,
    yuvaSurfaceShader: YUVA2RGBAShader,
    yuvSurfaceShader: YUV2RGBShader,
    framebuffer: WebGLFramebuffer,
    yTexture: Texture,
    uTexture: Texture,
    vTexture: Texture,
    alphaTexture: Texture,
  ) {
    this.yTexture = yTexture
    this.uTexture = uTexture
    this.vTexture = vTexture
    this.alphaTexture = alphaTexture
    this.gl = gl
    this.framebuffer = framebuffer
    this.yuvaSurfaceShader = yuvaSurfaceShader
    this.yuvSurfaceShader = yuvSurfaceShader
  }

  convertInto(yuva: OpaqueAndAlphaPlanes, frameSize: Size, view: View) {
    const { alpha, opaque } = yuva
    // const start = Date.now()
    if (view.destroyed) {
      return
    }
    const renderState = view.renderState
    // console.log(`|--> Decoding took ${Date.now() - start}ms`)

    // the width & height returned are actually padded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueBuffer = opaque.buffer
    const opaqueStride = opaque.width // stride
    const opaqueHeight = opaque.height // padded with filler rows

    const maxXTexCoord = frameSize.w / opaqueStride
    const maxYTexCoord = frameSize.h / opaqueHeight

    const lumaSize = opaqueStride * opaqueHeight
    const chromaSize = lumaSize >> 2

    const yBuffer = opaqueBuffer.subarray(0, lumaSize)
    const uBuffer = opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize)
    const vBuffer = opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + 2 * chromaSize)

    const chromaHeight = opaqueHeight >> 1
    const chromaStride = opaqueStride >> 1

    this.yTexture.image2dBuffer(yBuffer, opaqueStride, opaqueHeight)
    this.uTexture.image2dBuffer(uBuffer, chromaStride, chromaHeight)
    this.vTexture.image2dBuffer(vBuffer, chromaStride, chromaHeight)

    if (!renderState.size.equals(frameSize)) {
      renderState.size = frameSize
      renderState.texture.image2dBuffer(null, frameSize.w, frameSize.h)
    }
    if (alpha) {
      const alphaStride = alpha.width // stride
      const alphaHeight = alpha.height // padded with filler rows
      const alphaLumaSize = alphaStride * alphaHeight

      const alphaBuffer = alpha.buffer.subarray(0, alphaLumaSize)
      this.alphaTexture.image2dBuffer(alphaBuffer, alphaStride, alphaHeight)

      this._yuva2rgba(renderState, maxXTexCoord, maxYTexCoord)
    } else {
      this._yuv2rgb(renderState, maxXTexCoord, maxYTexCoord)
    }
  }

  private _yuv2rgb(renderState: RenderState, maxXTexCoord: number, maxYTexCoord: number) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    const attachmentPoint = this.gl.COLOR_ATTACHMENT0
    const level = 0
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      attachmentPoint,
      this.gl.TEXTURE_2D,
      renderState.texture.texture,
      level,
    )

    this.yuvSurfaceShader.use()
    this.yuvSurfaceShader.setTexture(this.yTexture, this.uTexture, this.vTexture)
    this.yuvSurfaceShader.updateShaderData(renderState.size, maxXTexCoord, maxYTexCoord)
    this.yuvSurfaceShader.draw()
    this.yuvSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  private _yuva2rgba(renderState: RenderState, maxXTexCoord: number, maxYTexCoord: number) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    const attachmentPoint = this.gl.COLOR_ATTACHMENT0
    const level = 0
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      attachmentPoint,
      this.gl.TEXTURE_2D,
      renderState.texture.texture,
      level,
    )

    this.yuvaSurfaceShader.use()
    this.yuvaSurfaceShader.setTexture(this.yTexture, this.uTexture, this.vTexture, this.alphaTexture)
    this.yuvaSurfaceShader.updateShaderData(renderState.size, maxXTexCoord, maxYTexCoord)
    this.yuvaSurfaceShader.draw()
    this.yuvaSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }
}

export default YUVAToRGBA
