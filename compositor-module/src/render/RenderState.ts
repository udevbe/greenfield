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

import Size from "../Size";
import Texture from './Texture'

class RenderState {
  readonly texture: Texture;
  size: Size;

  static create (gl: WebGLRenderingContext, size: Size): RenderState {
    const texture = Texture.create(gl, gl.RGBA)
    texture.image2dBuffer(null, size.w === 0 ? 2 : size.w, size.h === 0 ? 2 : size.h)
    return new RenderState(texture, size)
  }

  private constructor (texture: Texture, size: Size) {
    this.texture = texture
    this.size = size
  }

  destroy () {
    this.texture.delete()
  }
}

export default RenderState
