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
import { BufferStream } from './BufferStream'
import { DecodedFrame } from './DecodedFrame'

/**
 *
 *            A buffer provides the content for a wl_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 */
export class StreamingBuffer implements BufferImplementation<Promise<DecodedFrame | undefined>> {
  private constructor(
    public readonly resource: WlBufferResource,
    public readonly bufferStream: BufferStream,
    public released = false,
    private decodedFrame?: DecodedFrame,
  ) {}

  static create(wlBufferResource: WlBufferResource, creationSerial: number): StreamingBuffer {
    const bufferStream = BufferStream.create(wlBufferResource, creationSerial)
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

  async getContents(surface: Surface, bufferContentSerial: number): Promise<DecodedFrame | undefined> {
    if (bufferContentSerial === this.decodedFrame?.contentSerial) {
      return this.decodedFrame
    }

    const encodedFrameContent = this.bufferStream.onFrameAvailable(bufferContentSerial)
    const encodedFrame = encodedFrameContent instanceof Promise ? await encodedFrameContent : encodedFrameContent

    if (encodedFrame) {
      // console.log(`Found encoded buffer content ${bufferContentSerial}. Attempting to decode it.`)
      try {
        const oldDecodedFrame = this.decodedFrame
        this.decodedFrame = await surface.session.frameDecoder.decode(surface, encodedFrame)
        oldDecodedFrame?.pixelContent.close?.()
      } catch (e: unknown) {
        console.log(
          `Error: ${(e as Error).message} while decoding buffer ${
            this.resource.id
          } with content: ${bufferContentSerial}`,
        )
        console.log(`${JSON.stringify(encodedFrame)}`)
        surface.session.logger.warn('Get error during decode, resetting decoder.')
        surface.resource.client.userData.encoderApi?.keyframe({
          clientId: surface.resource.client.id,
          surfaceId: surface.resource.id,
          inlineObject: {
            bufferId: this.resource.id,
            bufferContentSerial,
            bufferCreationSerial: this.bufferStream.creationSerial,
          },
        })
      }

      return this.decodedFrame
    } else {
      console.log(`Found undefined buffer content ${bufferContentSerial}. Returning empty buffer content.`)
      return undefined
    }
  }

  release(): void {
    if (this.released) {
      throw new Error('BUG. Double buffer release.')
    }
    // resource is released by the proxy
    // this.resource.release()
    this.released = true
  }
}
