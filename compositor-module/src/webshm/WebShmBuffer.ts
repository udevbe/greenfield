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
import { GrWebShmBufferRequests, GrWebShmBufferResource, WlBufferResource } from 'westfield-runtime-server'
import BufferImplementation from '../BufferImplementation'
import Surface from '../Surface'
import WebShmFrame from './WebShmFrame'

export default class WebShmBuffer implements GrWebShmBufferRequests, BufferImplementation<WebShmFrame> {
  private pixelContent?: WebFD
  released = false

  static create(
    resource: GrWebShmBufferResource,
    bufferResource: WlBufferResource,
    width: number,
    height: number,
  ): WebShmBuffer {
    const webShmFrame = WebShmFrame.create(width, height)
    const webArrayBuffer = new WebShmBuffer(resource, bufferResource, webShmFrame)
    resource.implementation = webArrayBuffer
    return webArrayBuffer
  }

  private constructor(
    public readonly resource: GrWebShmBufferResource,
    public readonly bufferResource: WlBufferResource,
    private readonly webShmFrame: WebShmFrame,
  ) {}

  destroy(resource: WlBufferResource): void {
    // TODO what to do here?
    resource.destroy()
  }

  async attach(resource: GrWebShmBufferResource, pixelContent: WebFD): Promise<void> {
    this.pixelContent = pixelContent
    await this.webShmFrame.attach(pixelContent)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getContents(surface: Surface, serial: number): WebShmFrame {
    return this.webShmFrame
  }

  release(): void {
    if (this.released) {
      throw new Error('BUG. Buffer already released.')
    }
    if (this.pixelContent) {
      this.resource.detach(this.pixelContent)
    }
    this.bufferResource.release()
    this.bufferResource.client.connection.flush()
    this.released = true
  }
}
