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

import { sizeEquals, Size } from '../math/Size'
import { DualPlaneYUVAArrayBuffer, DualPlaneYUVASplitBuffer } from '../remote/DecodedFrame'
import Session from '../Session'
import RenderState from './RenderState'
import Texture from './Texture'
import YUV2RGBShader from './YUV2RGBShader'
import YUVA2RGBAShader from './YUVA2RGBAShader'

export class YUVA2RGBA {
  static create(session: Session, gl: WebGLRenderingContext): YUVA2RGBA {
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

    return new YUVA2RGBA(
      session,
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
    private readonly session: Session,
    public readonly gl: WebGLRenderingContext,
    public readonly yuvaSurfaceShader: YUVA2RGBAShader,
    public readonly yuvSurfaceShader: YUV2RGBShader,
    public readonly framebuffer: WebGLFramebuffer,
    public readonly yTexture: Texture,
    public readonly uTexture: Texture,
    public readonly vTexture: Texture,
    public readonly alphaTexture: Texture,
  ) {}

  convertYUVASplitBufferInto(yuva: DualPlaneYUVASplitBuffer, frameSize: Size, renderState: RenderState): void {
    renderState.size = frameSize

    const { alpha, opaque } = yuva

    // the width & height returned are actually padded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueCodedWidth = opaque.codedSize.width
    const opaqueCodedHeight = opaque.codedSize.height

    if (!sizeEquals(renderState.texture.size, opaque.codedSize)) {
      renderState.texture.setContentBuffer(null, opaque.codedSize)
    }
    const yBuffer = yuva.opaque.buffer.yPlane
    const uBuffer = yuva.opaque.buffer.uPlane
    const vBuffer = yuva.opaque.buffer.vPlane

    const chromaWidth = opaqueCodedWidth >> 1
    const chromaHeight = opaqueCodedHeight >> 1

    const lumaDimension = { width: opaqueCodedWidth, height: opaqueCodedHeight }
    const chromaDimension = { width: chromaWidth, height: chromaHeight }

    this.yTexture.setContentBuffer(yBuffer, lumaDimension)
    this.uTexture.setContentBuffer(uBuffer, chromaDimension)
    this.vTexture.setContentBuffer(vBuffer, chromaDimension)

    if (alpha) {
      const alphaCodedWidth = alpha.codedSize.width
      const alphaCodedHeight = alpha.codedSize.height
      const alphaBuffer = alpha.buffer.yPlane
      this.alphaTexture.setContentBuffer(alphaBuffer, { width: alphaCodedWidth, height: alphaCodedHeight })

      this.yuva2rgba(renderState)
    } else {
      this.yuv2rgb(renderState)
    }
  }

  convertYUVAArrayBufferInto(yuva: DualPlaneYUVAArrayBuffer, frameSize: Size, renderState: RenderState): void {
    renderState.size = frameSize

    const { alpha, opaque } = yuva

    // the width & height returned are actually padded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueBuffer = opaque.buffer
    const opaqueCodedWidth = opaque.codedSize.width
    const opaqueCodedHeight = opaque.codedSize.height

    if (!sizeEquals(renderState.texture.size, opaque.codedSize)) {
      renderState.texture.setContentBuffer(null, opaque.codedSize)
    }

    const lumaSize = opaqueCodedWidth * opaqueCodedHeight
    const chromaSize = lumaSize >> 2

    const yBuffer = opaqueBuffer.subarray(0, lumaSize)
    const uBuffer = opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize)
    const vBuffer = opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + 2 * chromaSize)

    const chromaWidth = opaqueCodedWidth >> 1
    const chromaHeight = opaqueCodedHeight >> 1

    const lumaDimension = { width: opaqueCodedWidth, height: opaqueCodedHeight }
    const chromaDimension = { width: chromaWidth, height: chromaHeight }

    this.yTexture.setContentBuffer(yBuffer, lumaDimension)
    this.uTexture.setContentBuffer(uBuffer, chromaDimension)
    this.vTexture.setContentBuffer(vBuffer, chromaDimension)

    if (alpha) {
      const alphaCodedWidth = alpha.codedSize.width
      const alphaCodedHeight = alpha.codedSize.height
      const alphaLumaSize = alphaCodedWidth * alphaCodedHeight

      const alphaBuffer = alpha.buffer.subarray(0, alphaLumaSize)
      this.alphaTexture.setContentBuffer(alphaBuffer, { width: alphaCodedWidth, height: alphaCodedHeight })

      this.yuva2rgba(renderState)
    } else {
      this.yuv2rgb(renderState)
    }
  }

  private yuv2rgb(renderState: RenderState) {
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
    this.yuvSurfaceShader.updateShaderData(renderState)
    this.yuvSurfaceShader.draw()
    this.yuvSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }

  private yuva2rgba(renderState: RenderState) {
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
    this.yuvaSurfaceShader.updateShaderData(renderState)
    this.yuvaSurfaceShader.draw()
    this.yuvaSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }
}
