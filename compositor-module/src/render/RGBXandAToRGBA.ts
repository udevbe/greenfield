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

import { Size, sizeEquals } from '../math/Size'
import {
  DualPlaneRGBAArrayBuffer,
  DualPlaneRGBAImageBitmap,
  DualPlaneRGBAVideoFrame,
} from '../remotestreaming/DecodedFrame'
import Session from '../Session'
import RenderState from './RenderState'
import { RGBandA2RGBAShader } from './RGBandA2RGBAShader'
import Texture from './Texture'

export class RGBXandA2RGBA {
  static create(session: Session, gl: WebGLRenderingContext): RGBXandA2RGBA {
    gl.clearColor(0, 0, 0, 0)

    const rgbTexture = Texture.create(gl, gl.RGBA)
    const alphaTexture = Texture.create(gl, gl.RGBA)

    const rgbaSurfaceShader = RGBandA2RGBAShader.create(gl)

    const framebuffer = gl.createFramebuffer()
    if (framebuffer === null) {
      throw new Error('Failed to create webgl framebuffer')
    }

    return new RGBXandA2RGBA(session, gl, rgbaSurfaceShader, framebuffer, rgbTexture, alphaTexture)
  }

  private constructor(
    private readonly _session: Session,
    public readonly gl: WebGLRenderingContext,
    public readonly rgbaSurfaceShader: RGBandA2RGBAShader,
    public readonly framebuffer: WebGLFramebuffer,
    public readonly rgbTexture: Texture,
    public readonly alphaTexture: Texture,
  ) {}

  convertInto(
    rgba: DualPlaneRGBAImageBitmap | DualPlaneRGBAArrayBuffer | DualPlaneRGBAVideoFrame,
    frameSize: Size,
    renderState: RenderState,
  ): void {
    if (!sizeEquals(renderState.size, frameSize)) {
      renderState.size = frameSize
      renderState.texture.setContentBuffer(null, frameSize)
    }

    // the width & height returned are actually padded, so we have to use the frame size to get the real image dimension
    // when uploading to texture
    const opaqueStride = rgba.opaque.width // stride
    const opaqueHeight = rgba.opaque.height // padded with filler rows
    if (rgba.alpha) {
      const maxXTexCoord = frameSize.width / opaqueStride
      const maxYTexCoord = frameSize.height / opaqueHeight

      if (rgba.type === 'DualPlaneRGBAVideoFrame') {
        this.rgbTexture.setContent(rgba.opaque.buffer, rgba.opaque)
        this.alphaTexture.setContent(rgba.alpha.buffer, rgba.alpha)
      } else if (rgba.type === 'DualPlaneRGBAImageBitmap') {
        this.rgbTexture.setContent(rgba.opaque.buffer, rgba.opaque)
        this.alphaTexture.setContent(rgba.alpha.buffer, rgba.alpha)
      } else {
        this.rgbTexture.setContentBuffer(rgba.opaque.buffer, rgba.opaque)
        this.alphaTexture.setContentBuffer(rgba.alpha.buffer, rgba.alpha)
      }

      this.rgbxAnda2rgba(renderState, maxXTexCoord, maxYTexCoord)
    } else {
      if (rgba.type === 'DualPlaneRGBAImageBitmap' || rgba.type === 'DualPlaneRGBAVideoFrame') {
        this.rgbTexture.setContent(rgba.opaque.buffer, rgba.opaque)
      } else {
        renderState.texture.setContentBuffer(rgba.opaque.buffer, rgba.opaque)
      }
    }
  }

  private rgbxAnda2rgba(renderState: RenderState, maxXTexCoord: number, maxYTexCoord: number) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.COLOR_ATTACHMENT0,
      this.gl.TEXTURE_2D,
      renderState.texture.texture,
      0,
    )

    this.rgbaSurfaceShader.use()
    this.rgbaSurfaceShader.setTexture(this.rgbTexture, this.alphaTexture)
    this.rgbaSurfaceShader.updateShaderData(renderState.size, maxXTexCoord, maxYTexCoord)
    this.rgbaSurfaceShader.draw()
    this.rgbaSurfaceShader.release()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }
}
