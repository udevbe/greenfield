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
  WlSurfaceResource,
} from 'westfield-runtime-server'
import Region from './Region'
import Session from './Session'

import Surface from './Surface'

export default class Compositor implements WlCompositorRequests {
  private surfaceCreationListeners: ((surface: Surface) => void)[] = []
  private global?: Global

  static create(session: Session): Compositor {
    return new Compositor(session)
  }

  private constructor(private readonly session: Session) {}

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, WlCompositorResource.protocolName, 4, (client, id, version) =>
      this.bindClient(client, id, version),
    )
  }

  unregisterGlobal(): void {
    if (!this.global) {
      return
    }
    this.global.destroy()
    this.global = undefined
  }

  bindClient(client: Client, id: number, version: number): void {
    const wlCompositorResource = new WlCompositorResource(client, id, version)
    wlCompositorResource.implementation = this
  }

  async createSurface(resource: WlCompositorResource, id: number): Promise<void> {
    const wlSurfaceResource = new WlSurfaceResource(resource.client, id, resource.version)
    const surface = Surface.create(wlSurfaceResource, this.session)
    for (const surfaceCreationListener of this.surfaceCreationListeners) {
      await surfaceCreationListener(surface)
    }
  }

  createRegion(resource: WlCompositorResource, id: number): void {
    const wlRegionResource = new WlRegionResource(resource.client, id, resource.version)
    Region.create(wlRegionResource)
  }

  removeSurfaceCreationListener(listener: (surface: Surface) => void): void {
    this.surfaceCreationListeners = this.surfaceCreationListeners.filter((value) => value !== listener)
  }

  addSurfaceCreationListener(listener: (surface: Surface) => void): void {
    this.surfaceCreationListeners = [...this.surfaceCreationListeners, listener]
  }
}
