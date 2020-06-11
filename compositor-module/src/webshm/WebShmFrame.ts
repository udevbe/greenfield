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

import { WebFD } from 'westfield-runtime-common'
import BufferContents from '../BufferContents'
import Size from '../Size'

export default class WebShmFrame implements BufferContents<ImageData> {
  readonly size: Size
  pixelContent: ImageData
  readonly mimeType: 'image/rgba' = 'image/rgba'
  readonly serial: 0 = 0

  static create(width: number, height: number): WebShmFrame {
    return new WebShmFrame(width, height)
  }

  private constructor(width: number, height: number) {
    this.size = Size.create(width, height)
    this.pixelContent = new ImageData(new Uint8ClampedArray(new ArrayBuffer(width * height * 4)), width, height)
  }

  async attach(pixelContent: WebFD) {
    const arrayBuffer = await pixelContent.getTransferable()
    if (!(arrayBuffer instanceof ArrayBuffer)) {
      throw new Error('web fd attached to web shm frame is not an array buffer.')
    }
    this.pixelContent = new ImageData(new Uint8ClampedArray(arrayBuffer), this.size.w, this.size.h)
  }

  validateSize() { /* NOOP */
  }
}
