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

import { WlBufferResource } from 'westfield-runtime-server'
import BufferImplementation from '../BufferImplementation'
import Surface from '../Surface'
import { createFrameDecoder } from './buffer-decoder'
import BufferStream from './BufferStream'
import { DecodedFrame } from './DecodedFrame'

const frameDecoder = createFrameDecoder()

/**
 *
 *            A buffer provides the content for a wl_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 */
export default class StreamingBuffer implements BufferImplementation<Promise<DecodedFrame | undefined>> {
  static create(wlBufferResource: WlBufferResource): StreamingBuffer {
    const bufferStream = BufferStream.create(wlBufferResource)
    const buffer = new StreamingBuffer(wlBufferResource, bufferStream)
    wlBufferResource.implementation = buffer
    return buffer
  }

  private constructor(
    public readonly resource: WlBufferResource,
    public readonly bufferStream: BufferStream,
    public released = false,
  ) {}

  destroy(resource: WlBufferResource): void {
    this.bufferStream.destroy()
    resource.destroy()
  }

  async getContents(surface: Surface, commitSerial: number): Promise<DecodedFrame | undefined> {
    const encodedFrame = await this.bufferStream.onFrameAvailable(commitSerial)
    return encodedFrame ? frameDecoder.decode(surface, encodedFrame) : undefined
  }

  release(): void {
    if (this.released) {
      throw new Error('double release')
    }
    this.resource.release()
    this.released = true
  }
}
