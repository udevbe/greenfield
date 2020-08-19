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
  GrWebShmBufferResource,
  GrWebShmRequests,
  GrWebShmResource,
  Registry,
  WlBufferResource
} from 'westfield-runtime-server'
import WebShmBuffer from './WebShmBuffer'

export default class WebShm implements GrWebShmRequests {
  private _global?: Global

  static create(): WebShm {
    return new WebShm()
  }

  private constructor() {
  }

  registerGlobal(registry: Registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, GrWebShmResource.protocolName, 1, (client, id, version) => {
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
    const webShmResource = new GrWebShmResource(client, id, version)
    webShmResource.implementation = this
  }

  async createBuffer(resource: GrWebShmResource, id: number, grWebShmBufferResource: GrWebShmBufferResource, width: number, height: number) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)
    const webArrayBuffer = await WebShmBuffer.create(grWebShmBufferResource, wlBufferResource, width, height)

    wlBufferResource.implementation = webArrayBuffer
    grWebShmBufferResource.implementation = webArrayBuffer
  }

  createWebArrayBuffer(resource: GrWebShmResource, id: number) {
    const grWebShmBufferResource = new GrWebShmBufferResource(resource.client, id, resource.version)
    // FIXME use protocol error instead of exception
    grWebShmBufferResource.implementation = {
      attach: () => {
        throw new Error('web shm buffer not wrapped.')
      }
    }
  }
}
