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
// You should have received a copy of the GNU Affero General Public Licensef
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import { createRect } from '../math/Rect'
import { Size } from '../math/Size'
import Output from '../Output'
import { createPixmanRegion, initRect } from '../Region'
import { DecodedFrame } from '../remotestreaming/DecodedFrame'
import Session from '../Session'
import View from '../View'
import RenderState from './RenderState'
import { RGBXandA2RGBA } from './RGBXandAToRGBA'
import SceneShader from './SceneShader'
import { YUVA2RGBA } from './YUVA2RGBA'

export class Scene {
  public region = createPixmanRegion()
  // @ts-ignore
  private _destroyResolve: (value?: void | PromiseLike<void>) => void
  private readonly _destroyPromise: Promise<void>

  private constructor(
    public readonly session: Session,
    public readonly canvas: HTMLCanvasElement,
    public readonly gl: WebGLRenderingContext,
    public readonly sceneShader: SceneShader,
    public readonly yuvaToRGBA: YUVA2RGBA,
    public readonly rgbaAnda2RGBA: RGBXandA2RGBA,
    public readonly output: Output,
    public readonly id: string,
    public resolution: Size | 'auto' = 'auto',
  ) {
    this._destroyPromise = new Promise<void>((resolve) => {
      this._destroyResolve = resolve
    })
    // this.ensureResolution()
  }

  static create(
    session: Session,
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    output: Output,
    sceneId: string,
  ): Scene {
    const sceneShader = SceneShader.create(gl)
    const yuvaToRgba = YUVA2RGBA.create(session, gl)
    const rgbaAnda2RGBA = RGBXandA2RGBA.create(session, gl)
    return new Scene(session, canvas, gl, sceneShader, yuvaToRgba, rgbaAnda2RGBA, output, sceneId)
  }

  render(viewStack: View[]): void {
    this.ensureResolution()

    // render view texture
    this.sceneShader.use()
    this.sceneShader.updateSceneData(this.canvas)
    viewStack.forEach((view) => this.renderView(view))
    this.sceneShader.release()

    this.session.userShell.events.sceneRefresh?.(this.id)
  }

  destroy(): void {
    this._destroyResolve()
  }

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  ['video/h264'](decodedFrame: DecodedFrame, renderState: RenderState): void {
    if (decodedFrame.pixelContent.type === 'DualPlaneYUVAArrayBuffer') {
      this.yuvaToRGBA.convertInto(decodedFrame.pixelContent, decodedFrame.size, renderState)
    } else if (
      decodedFrame.pixelContent.type === 'DualPlaneRGBAImageBitmap' ||
      decodedFrame.pixelContent.type === 'DualPlaneRGBAVideoFrame' ||
      decodedFrame.pixelContent.type === 'DualPlaneRGBAArrayBuffer'
    ) {
      this.rgbaAnda2RGBA.convertInto(decodedFrame.pixelContent, decodedFrame.size, renderState)
    } else {
      throw new Error(`BUG. Unsupported type ${decodedFrame.pixelContent.type} for video/h264`)
    }
  }

  ['image/png'](decodedFrame: DecodedFrame, renderState: RenderState): void {
    const { bitmap } = decodedFrame.pixelContent as { bitmap: ImageBitmap; blob: Blob }
    renderState.size = { width: bitmap.width, height: bitmap.height }
    renderState.texture.setContent(bitmap, bitmap)
    bitmap.close()
  }

  private ensureResolution() {
    if (this.resolution === 'auto') {
      if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
        this.canvas.width = this.canvas.clientWidth
        this.canvas.height = this.canvas.clientHeight
      }
    } else if (this.canvas.width !== this.resolution.width || this.canvas.height !== this.resolution.height) {
      this.canvas.width = this.resolution.width
      this.canvas.height = this.resolution.height
    }

    initRect(this.region, createRect(this.output, this.canvas))
  }

  private renderView(view: View) {
    const renderState = view.renderStates[this.id]
    if (renderState && view.mapped) {
      view.prepareRender?.(renderState)
      this.sceneShader.updateViewData(view, renderState)
      this.sceneShader.draw()
    }
  }
}
