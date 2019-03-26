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

'use strict'

import GrWebShmRequests from '../protocol/GrWebShmRequests'
import GrWebShmResource from '../protocol/GrWebShmResource'
import GrWebShmBufferResource from '../protocol/GrWebShmBufferResource'
import WebShmBuffer from './WebShmBuffer'
import WlBufferResource from '../protocol/WlBufferResource'

/**
 * @implements GrWebShmRequests
 */
export default class WebShm extends GrWebShmRequests {
  /**
   * @return {WebShm}
   */
  static create () {
    return new WebShm()
  }

  constructor () {
    super()
    /**
     * @type {Global}
     * @private
     */
    this._global = null
    /**
     * @type {Array<GrWebShmResource>}
     * @private
     */
    this._resources = []
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, GrWebShmResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  /**
   *
   * Invoked when a client binds to this global.
   *
   * @param {!Client} client
   * @param {!number} id
   * @param {!number} version
   */
  bindClient (client, id, version) {
    const webShmResource = new GrWebShmResource(client, id, version)
    webShmResource.implementation = this
    this._resources.push(webShmResource)
  }

  /**
   *
   *                Create a wl_buffer object from a web_array_buffer so it can be used with a surface.
   *
   *
   * @param {GrWebShmResource} resource
   * @param {number} id buffer to create
   * @param {*} webArrayBufferResource web_array_buffer to wrap
   * @param {number} width buffer width, in pixels
   * @param {number} height buffer height, in pixels
   *
   * @since 1
   *
   */
  async createBuffer (resource, id, webArrayBufferResource, width, height) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)
    const webArrayBuffer = await WebShmBuffer.create(webArrayBufferResource, wlBufferResource, width, height)

    wlBufferResource.implementation = webArrayBuffer
    webArrayBufferResource.implementation = webArrayBuffer
  }

  /**
   *
   *                Create a web_array_buffer object.
   *
   *                The buffer is created using width and height as specified.
   *                The format of the attached buffer is always rgba8888.
   *
   *                A compositor will emit the detach event in conjunction with a wl_buffer release event.
   *
   *
   * @param {GrWebShmResource} resource
   * @param {number} id array buffer to create
   *
   * @since 1
   *
   */
  createWebArrayBuffer (resource, id) {
    const grWebShmBufferResource = new GrWebShmBufferResource(resource.client, id, resource.version)
    // FIXME use protocol error instead of exception
    grWebShmBufferResource.implementation = { attach: () => { throw new Error('web shm buffer not wrapped.') } }
  }
}
