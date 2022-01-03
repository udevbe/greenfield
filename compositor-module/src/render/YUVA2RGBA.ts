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
import { DualPlaneYUVAArrayBuffer } from '../remotestreaming/DecodedFrame'
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

  convertInto(yuva: DualPlaneYUVAArrayBuffer, frameSize: Size, renderState: RenderState): void {
    if (!sizeEquals(renderState.size, frameSize)) {
      renderState.size = frameSize
      renderState.texture.setContentBuffer(null, frameSize)
    }
    const { alpha, opaque } = yuva

    // the width & height returned are actually padded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueBuffer = opaque.buffer
    const opaqueStride = opaque.width // stride
    const opaqueHeight = opaque.height // padded with filler rows

    const maxXTexCoord = frameSize.width / opaqueStride
    const maxYTexCoord = frameSize.height / opaqueHeight

    const lumaSize = opaqueStride * opaqueHeight
    const chromaSize = lumaSize >> 2

    const yBuffer = opaqueBuffer.subarray(0, lumaSize)
    const uBuffer = opaqueBuffer.subarray(lumaSize, lumaSize + chromaSize)
    const vBuffer = opaqueBuffer.subarray(lumaSize + chromaSize, lumaSize + 2 * chromaSize)

    const chromaHeight = opaqueHeight >> 1
    const chromaStride = opaqueStride >> 1

    const lumaDimension = { width: opaqueStride, height: opaqueHeight }
    const chromaDimension = { width: chromaStride, height: chromaHeight }

    this.yTexture.setContentBuffer(yBuffer, lumaDimension)
    this.uTexture.setContentBuffer(uBuffer, chromaDimension)
    this.vTexture.setContentBuffer(vBuffer, chromaDimension)

    if (alpha) {
      const alphaStride = alpha.width // stride
      const alphaHeight = alpha.height // padded with filler rows
      const alphaLumaSize = alphaStride * alphaHeight

      const alphaBuffer = alpha.buffer.subarray(0, alphaLumaSize)
      this.alphaTexture.setContentBuffer(alphaBuffer, { width: alphaStride, height: alphaHeight })

      this.yuva2rgba(renderState, maxXTexCoord, maxYTexCoord)
    } else {
      this.yuv2rgb(renderState, maxXTexCoord, maxYTexCoord)
    }
  }

  private yuv2rgb(renderState: RenderState, maxXTexCoord: number, maxYTexCoord: number) {
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

  private yuva2rgba(renderState: RenderState, maxXTexCoord: number, maxYTexCoord: number) {
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
