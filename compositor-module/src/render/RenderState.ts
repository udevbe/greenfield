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

import { copyTo, createPixmanRegion, destroyPixmanRegion, fini } from '../Region'
import { Size } from '../math/Size'
import { Scene } from './Scene'
import Texture from './Texture'

class RenderState {
  static create(gl: WebGLRenderingContext, size: Size, scene: Scene, visibleSceneRegion: number): RenderState {
    const texture = Texture.create(gl, gl.RGBA)
    texture.image2dBuffer(null, size.width === 0 ? 2 : size.width, size.height === 0 ? 2 : size.height)
    return new RenderState(texture, size, scene, visibleSceneRegion)
  }

  readonly visibleRegion = createPixmanRegion()

  private constructor(
    public readonly texture: Texture,
    public size: Size,
    public readonly scene: Scene,
    public readonly visibleSceneRegion: number,
  ) {
    copyTo(this.visibleRegion, visibleSceneRegion)
  }

  destroy(): void {
    this.texture.delete()
    fini(this.visibleRegion)
    destroyPixmanRegion(this.visibleRegion)
  }

  updateWithTexImageSource(buffer: TexImageSource) {
    if (buffer.width === this.size.width && buffer.height === this.size.height) {
      this.texture.subImage2d(buffer, 0, 0)
    } else {
      this.size = buffer
      this.texture.image2d(buffer)
    }
  }
}

export default RenderState
