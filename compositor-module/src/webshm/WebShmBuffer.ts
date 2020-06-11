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
import {
  GrWebShmBufferRequests,
  GrWebShmBufferResource,
  WlBufferRequests,
  WlBufferResource
} from 'westfield-runtime-server'
import BufferImplementation from '../BufferImplementation'
import Surface from '../Surface'
import WebShmFrame from './WebShmFrame'

export default class WebShmBuffer implements GrWebShmBufferRequests, BufferImplementation<WebShmFrame> {
  readonly resource: GrWebShmBufferResource
  readonly bufferResource: WlBufferResource
  private readonly _webShmFrame: WebShmFrame
  private _pixelContent?: WebFD
  captured: boolean = false

  static create(
    resource: GrWebShmBufferResource,
    bufferResource: WlBufferResource,
    width: number,
    height: number
  ): WebShmBuffer {
    const webShmFrame = WebShmFrame.create(width, height)
    const webArrayBuffer = new WebShmBuffer(resource, bufferResource, webShmFrame)
    resource.implementation = webArrayBuffer
    return webArrayBuffer
  }

  private constructor(resource: GrWebShmBufferResource, bufferResource: WlBufferResource, webShmFrame: WebShmFrame) {
    this.resource = resource
    this.bufferResource = bufferResource
    this._webShmFrame = webShmFrame
  }

  /**
   *
   *  Destroy a buffer. If and how you need to release the backing
   *  storage is defined by the buffer factory interface.
   *
   *  For possible side-effects to a surface, see wl_surface.attach.
   *
   *
   * @param {WlBufferResource} resource
   *
   * @since 1
   * @override
   *
   */
  destroy(resource: WlBufferResource) {
    // TODO what to do here?
    resource.destroy()
  }

  /**
   *
   *
   *
   * @param {GrWebShmBufferResource} resource
   * @param {WebFD} pixelContent HTML5 array buffer to attach to the compositor.
   *
   * @since 1
   *
   */
  async attach(resource: GrWebShmBufferResource, pixelContent: WebFD) {
    this._pixelContent = pixelContent
    await this._webShmFrame.attach(pixelContent)
  }

  /**
   * @param {Surface}surface
   * @param {number}serial
   * @return {Promise<WebShmFrame>}
   */
  async getContents(surface: Surface, serial: number) {
    return Promise.resolve(this._webShmFrame)
  }

  release() {
    if (this._pixelContent !== undefined) {
      this.resource.detach(this._pixelContent)
    }
    this.bufferResource.release()
    this.captured = false
  }

  capture() {
    this.captured = true
  }
}
