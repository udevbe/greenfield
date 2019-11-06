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

import { GrWebGlRequests, GrWebGlResource, GrWebGlBufferResource, WlBufferResource } from 'westfield-runtime-server'
import WebGLBuffer from './WebGLBuffer'

/**
 * @implements GrWebGlRequests
 */
export default class WebGL extends GrWebGlRequests {
  /**
   * @param {Session}session
   * @return {WebGL}
   */
  static create (session) {
    return new WebGL(session.webFS)
  }

  /**
   * @param {WebFS}webFS
   */
  constructor (webFS) {
    super()
    /**
     * @type {Global}
     * @private
     */
    this._global = null
    /**
     * @type {WebFS}
     * @private
     */
    this._webFS = webFS
    /**
     * @type {Array<GrWebGlResource>}
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
    this._global = registry.createGlobal(this, GrWebGlResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal () {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = null
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
    const webGlResource = new GrWebGlResource(client, id, version)
    webGlResource.implementation = this
    this._resources.push(webGlResource)
  }

  createBuffer (resource, id, grWebGlBuffer) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)

    const webGLBuffer = WebGLBuffer.create(grWebGlBuffer, wlBufferResource, this._webFS)

    grWebGlBuffer.implementation = webGLBuffer
    wlBufferResource.implementation = webGLBuffer
  }

  createWebGlBuffer (resource, id) {
    const grWebGlBufferResource = new GrWebGlBufferResource(resource.client, id, resource.version)
    // FIXME use protocol error instead of exception
    grWebGlBufferResource.implementation = { transfer: () => { throw new Error('web gl buffer not wrapped.') } }
  }
}
