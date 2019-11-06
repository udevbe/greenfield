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

import { GrWebShmBufferRequests } from 'westfield-runtime-server'
import WebShmFrame from './WebShmFrame'

/**
 * @implements WlBufferRequests
 * @implements GrWebShmBufferRequests
 * @implements BufferImplementation
 */
export default class WebShmBuffer extends GrWebShmBufferRequests {
  /**
   * @param {GrWebShmBufferResource}resource
   * @param {WlBufferResource}bufferResource
   * @param {number}width
   * @param {number}height
   */
  static async create (resource, bufferResource, width, height) {
    const webShmFrame = WebShmFrame.create(width, height)
    const webArrayBuffer = new WebShmBuffer(resource, bufferResource, webShmFrame)
    resource.implementation = webArrayBuffer
    return webArrayBuffer
  }

  /**
   * @param {GrWebShmBufferResource}resource
   * @param {WlBufferResource}bufferResource
   * @param {WebShmFrame}webShmFrame
   */
  constructor (resource, bufferResource, webShmFrame) {
    super()
    /**
     * @type {GrWebShmBufferResource}
     */
    this.resource = resource
    /**
     * @type {WlBufferResource}
     */
    this.bufferResource = bufferResource
    /**
     * @type {WebFD|null}
     * @private
     */
    this._pixelContent = null
    /**
     * @type {WebShmFrame}
     */
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
  destroy (resource) {
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
  async attach (resource, pixelContent) {
    this._pixelContent = pixelContent
    await this._webShmFrame.attach(pixelContent)
  }

  /**
   * @param {number}serial
   * @return {Promise<WebShmFrame>}
   */
  async getContents (serial) {
    return Promise.resolve(this._webShmFrame)
  }

  release () {
    this.resource.detach(this._pixelContent)
    this.bufferResource.release()
  }
}
