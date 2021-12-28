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
import { RemoteOutOfBandSendOpcode } from '../RemoteOutOfBandChannel'
import Surface from '../Surface'
import BufferStream from './BufferStream'
import { DecodedFrame } from './DecodedFrame'

/**
 *
 *            A buffer provides the content for a wl_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 */
export default class StreamingBuffer implements BufferImplementation<Promise<DecodedFrame | undefined>> {
  private constructor(
    public readonly resource: WlBufferResource,
    public readonly bufferStream: BufferStream,
    public released = false,
    private decodedFrame?: DecodedFrame,
  ) {}

  static create(wlBufferResource: WlBufferResource): StreamingBuffer {
    const bufferStream = BufferStream.create(wlBufferResource)
    const buffer = new StreamingBuffer(wlBufferResource, bufferStream)
    wlBufferResource.implementation = buffer
    return buffer
  }

  destroy(resource: WlBufferResource): void {
    this.bufferStream.destroy()
    this.decodedFrame?.pixelContent.close?.()
    this.decodedFrame = undefined
    resource.destroy()
  }

  async getContents(surface: Surface, commitSerial: number): Promise<DecodedFrame | undefined> {
    if (commitSerial === this.decodedFrame?.serial) {
      return this.decodedFrame
    }

    const encodedFrame = await this.bufferStream.onFrameAvailable(commitSerial)
    if (encodedFrame) {
      try {
        const oldDecodedFrame = this.decodedFrame
        this.decodedFrame = await surface.session.frameDecoder.decode(surface, encodedFrame)
        oldDecodedFrame?.pixelContent.close?.()
      } catch (e: unknown) {
        surface.session.logger.warn('Get error during decode, requesting new keyframe.')
        surface.session
          .getRemoteClientConnection(surface.resource.client)
          .remoteOutOfBandChannel.send(
            RemoteOutOfBandSendOpcode.ForceKeyFrameNow,
            new Uint32Array([surface.resource.id, commitSerial]),
          )
        const encodedFrame = await this.bufferStream.onFrameAvailable(commitSerial)
        if (encodedFrame) {
          const oldDecodedFrame = this.decodedFrame
          this.decodedFrame = await surface.session.frameDecoder.decode(surface, encodedFrame)
          oldDecodedFrame?.pixelContent.close?.()
        }
      }

      return this.decodedFrame
    } else {
      return undefined
    }
  }

  release(): void {
    if (this.released) {
      throw new Error('BUG. Double buffer release.')
    }
    this.resource.release()
    this.released = true
  }
}
