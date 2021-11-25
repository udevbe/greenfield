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
import { DecodedFrame, OpaqueAndAlphaPlanes } from '../remotestreaming/DecodedFrame'
import Session from '../Session'
import View from '../View'
import RenderState from './RenderState'
import SceneShader from './SceneShader'
import YUVAToRGBA from './YUVAToRGBA'

function updateViewRenderStateWithTexImageSource(buffer: TexImageSource, renderState: RenderState) {
  const {
    texture,
    size: { width, height },
  } = renderState
  if (buffer.width === width && buffer.height === height) {
    texture.subImage2d(buffer, 0, 0)
  } else {
    renderState.size = buffer
    texture.image2d(buffer)
  }
}

class Scene {
  // @ts-ignore
  private _destroyResolve: (value?: void | PromiseLike<void>) => void
  private readonly _destroyPromise: Promise<void>
  public region = createPixmanRegion()

  static create(
    session: Session,
    gl: WebGLRenderingContext,
    canvas: HTMLCanvasElement,
    output: Output,
    sceneId: string,
  ): Scene {
    const sceneShader = SceneShader.create(gl)
    const yuvaToRgba = YUVAToRGBA.create(session, gl)
    return new Scene(session, canvas, gl, sceneShader, yuvaToRgba, output, sceneId)
  }

  private constructor(
    public readonly session: Session,
    public readonly canvas: HTMLCanvasElement,
    public readonly gl: WebGLRenderingContext,
    public readonly sceneShader: SceneShader,
    public readonly yuvaToRGBA: YUVAToRGBA,
    public readonly output: Output,
    public readonly id: string,
    public resolution: Size | 'auto' = 'auto',
  ) {
    this._destroyPromise = new Promise<void>((resolve) => {
      this._destroyResolve = resolve
    })
    // this.ensureResolution()
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

  render(viewStack: View[]): void {
    this.ensureResolution()

    // render view texture
    this.sceneShader.use()
    this.sceneShader.updateSceneData(this.canvas)
    viewStack.forEach((view) => this.renderView(view))
    this.sceneShader.release()

    this.session.userShell.events.sceneRefresh?.(this.id)
  }

  private renderView(view: View) {
    const renderState = view.renderStates[this.id]
    if (renderState && view.mapped) {
      view.prepareRender?.(renderState)
      this.sceneShader.updateViewData(view, renderState)
      this.sceneShader.draw()
    }
  }

  destroy(): void {
    this._destroyResolve()
  }

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  ['video/h264'](decodedFrame: DecodedFrame, renderState: RenderState): void {
    this.yuvaToRGBA.convertInto(decodedFrame.pixelContent as OpaqueAndAlphaPlanes, decodedFrame.size, renderState)
  }

  ['image/png'](decodedFrame: DecodedFrame, renderState: RenderState): void {
    const { bitmap } = decodedFrame.pixelContent as { bitmap: ImageBitmap; blob: Blob }
    updateViewRenderStateWithTexImageSource(bitmap, renderState)
  }
}

export default Scene
