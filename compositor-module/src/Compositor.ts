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
  Registry,
  WlCompositorRequests,
  WlCompositorResource,
  WlRegionResource,
  WlSurfaceResource
} from 'westfield-runtime-server'
import Region from './Region'
import Session from './Session'

import Surface from './Surface'

/**
 *
 *            A compositor.  This object is a singleton global.  The
 *            compositor is in charge of combining the contents of multiple
 *            surfaces into one displayable output.
 */
export default class Compositor implements WlCompositorRequests {
  private readonly _session: Session
  private _global?: Global

  static create(session: Session): Compositor {
    return new Compositor(session)
  }

  private constructor(session: Session) {
    this._session = session
  }

  registerGlobal(registry: Registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlCompositorResource.protocolName, 4, (client, id, version) => this.bindClient(client, id, version))
  }

  unregisterGlobal() {
    if (!this._global) {
      return
    }
    this._global.destroy()
    this._global = undefined
  }

  bindClient(client: Client, id: number, version: number) {
    const wlCompositorResource = new WlCompositorResource(client, id, version)
    wlCompositorResource.implementation = this
  }

  createSurface(resource: WlCompositorResource, id: number) {
    const wlSurfaceResource = new WlSurfaceResource(resource.client, id, resource.version)
    Surface.create(wlSurfaceResource, this._session)
  }

  createRegion(resource: WlCompositorResource, id: number) {
    const wlRegionResource = new WlRegionResource(resource.client, id, resource.version)
    Region.create(wlRegionResource)
  }
}
