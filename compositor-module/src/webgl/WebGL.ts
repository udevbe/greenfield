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

import {
  Client,
  Global,
  GrWebGlBufferResource,
  GrWebGlRequests,
  GrWebGlResource,
  Registry,
  WlBufferResource
} from 'westfield-runtime-server'
import Session from '../Session'
import WebFS from '../WebFS'
import WebGLBuffer from './WebGLBuffer'

/**
 * @implements GrWebGlRequests
 */
export default class WebGL implements GrWebGlRequests {
  private _global?: Global
  private readonly _webFS: WebFS

  static create(session: Session): WebGL {
    return new WebGL(session.webFS)
  }

  private constructor(webFS: WebFS) {
    this._webFS = webFS
  }

  registerGlobal(registry: Registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, GrWebGlResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal() {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = undefined
  }

  bindClient(client: Client, id: number, version: number) {
    const webGlResource = new GrWebGlResource(client, id, version)
    webGlResource.implementation = this
  }

  createBuffer(resource: GrWebGlResource, id: number, grWebGlBuffer: GrWebGlBufferResource) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)

    const webGLBuffer = WebGLBuffer.create(grWebGlBuffer, wlBufferResource, this._webFS)

    grWebGlBuffer.implementation = webGLBuffer
    wlBufferResource.implementation = webGLBuffer
  }

  createWebGlBuffer(resource: GrWebGlResource, id: number) {
    const grWebGlBufferResource = new GrWebGlBufferResource(resource.client, id, resource.version)
    // FIXME use protocol error instead of exception
    grWebGlBufferResource.implementation = {
      transfer: () => {
        throw new Error('web gl buffer not wrapped.')
      }
    }
  }
}
