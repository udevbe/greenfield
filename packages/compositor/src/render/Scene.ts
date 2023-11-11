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
import Output from '../Output'
import { createPixmanRegion, initRect } from '../Region'
import { DecodedFrame } from '../remote/DecodedFrame'
import Session from '../Session'
import View from '../View'
import RenderState from './RenderState'
import { RGBXandA2RGBA } from './RGBXandAToRGBA'
import SceneShader from './SceneShader'
import { YUVA2RGBA } from './YUVA2RGBA'
import { ImageBitmapBufferContents } from '../ImageBitmapBuffer'

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
    needRender: () => void,
  ) {
    this._destroyPromise = new Promise<void>((resolve) => {
      this._destroyResolve = resolve
    })
    this.ensureResolution(needRender)
  }

  static create(
    session: Session,
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    output: Output,
    sceneId: string,
    needRenderCallback: () => void,
  ): Scene {
    const sceneShader = SceneShader.create(gl)
    const yuvaToRgba = YUVA2RGBA.create(session, gl)
    const rgbaAnda2RGBA = RGBXandA2RGBA.create(session, gl)
    return new Scene(session, canvas, gl, sceneShader, yuvaToRgba, rgbaAnda2RGBA, output, sceneId, needRenderCallback)
  }

  render(viewStack: View[]): void {
    // render view texture
    this.sceneShader.use()
    this.sceneShader.updateSceneData(this.canvas)
    viewStack.forEach((view) => this.renderView(view))
    this.sceneShader.release()

    this.session.userShell.events.sceneRefreshed?.(this.id)
  }

  destroy(): void {
    this._destroyResolve()
  }

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  ['image/bitmap'](webBufferContents: ImageBitmapBufferContents, renderState: RenderState) {
    const { width, height } = webBufferContents.size
    renderState.size = { width, height }
    renderState.texture.setContent(webBufferContents.pixelContent, renderState.size)
  }

  ['video/h264'](decodedFrame: DecodedFrame, renderState: RenderState): void {
    if (decodedFrame.pixelContent.type === 'DualPlaneYUVAArrayBuffer') {
      this.yuvaToRGBA.convertYUVAArrayBufferInto(decodedFrame.pixelContent, decodedFrame.size, renderState)
    } else if (decodedFrame.pixelContent.type === 'DualPlaneYUVASplitBuffer') {
      this.yuvaToRGBA.convertYUVASplitBufferInto(decodedFrame.pixelContent, decodedFrame.size, renderState)
    } else if (
      decodedFrame.pixelContent.type === 'DualPlaneRGBAImageBitmap' ||
      decodedFrame.pixelContent.type === 'DualPlaneRGBAVideoFrame' ||
      decodedFrame.pixelContent.type === 'DualPlaneRGBAArrayBuffer'
    ) {
      this.rgbaAnda2RGBA.convertInto(decodedFrame.pixelContent, decodedFrame.size, renderState)
    } else {
      throw new Error(`BUG. Unsupported decoded frame type ${decodedFrame.pixelContent.type} for video/h264`)
    }
  }

  ['image/png'](decodedFrame: DecodedFrame, renderState: RenderState): void {
    const { bitmap } = decodedFrame.pixelContent as { bitmap: ImageBitmap }
    const { width, height } = bitmap
    renderState.size = { width, height }
    renderState.texture.setContent(bitmap, { width, height })
    bitmap.close()
  }

  private ensureResolution(needRender: () => void) {
    const resizeTheCanvasToDisplaySize: ResizeObserverCallback = (_entries) => {
      // TODO make scaling work for HiDPI devices
      // const entry = entries[0]
      // let width
      // let height
      // if (entry.devicePixelContentBoxSize) {
      //   width = entry.devicePixelContentBoxSize[0].inlineSize
      //   height = entry.devicePixelContentBoxSize[0].blockSize
      //   this.canvas.width = width
      //   this.canvas.height = height
      // } else if (entry.contentBoxSize) {
      //   // fallback for Safari that will not always be correct
      //   width = Math.round(entry.contentBoxSize[0].inlineSize * devicePixelRatio)
      //   height = Math.round(entry.contentBoxSize[0].blockSize * devicePixelRatio)
      //   this.canvas.width = width
      //   this.canvas.height = height
      // }

      this.canvas.width = this.canvas.clientWidth
      this.canvas.height = this.canvas.clientHeight

      initRect(this.region, createRect(this.output, this.canvas))
      needRender()
    }

    const observer = new ResizeObserver(resizeTheCanvasToDisplaySize)
    observer.observe(this.canvas)
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
