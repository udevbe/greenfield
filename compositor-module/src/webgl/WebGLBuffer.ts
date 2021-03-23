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

import { GrWebGlBufferResource, WlBufferResource } from 'westfield-runtime-server'
import BufferImplementation from '../BufferImplementation'
import Surface from '../Surface'
import WebFS from '../WebFS'
import WebGLFrame from './WebGLFrame'

export default class WebGLBuffer implements BufferImplementation<WebGLFrame> {
  released = false

  static create(resource: GrWebGlBufferResource, bufferResource: WlBufferResource, webFS: WebFS): WebGLBuffer {
    const canvas = window.document.createElement('canvas')
    const offscreenCanvas = canvas.transferControlToOffscreen()
    resource.offscreenCanvas(webFS.fromOffscreenCanvas(offscreenCanvas))
    return new WebGLBuffer(resource, bufferResource, canvas)
  }

  constructor(
    public readonly resource: GrWebGlBufferResource,
    public readonly bufferResource: WlBufferResource,
    public readonly canvas: HTMLCanvasElement,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  destroy(resource: WlBufferResource): void {
    this.resource.destroy()
    this.bufferResource.destroy()
    // TODO what more to do here?
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getContents(surface: Surface, serial: number): WebGLFrame {
    return WebGLFrame.create(this.canvas)
  }

  release(): void {
    if (this.released) {
      throw new Error('BUG. Buffer already released.')
    }
    this.bufferResource.release()
    this.bufferResource.client.connection.flush()
    this.released = true
  }
}
