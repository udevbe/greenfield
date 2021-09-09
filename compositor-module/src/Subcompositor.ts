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
  WlSubcompositorError,
  WlSubcompositorRequests,
  WlSubcompositorResource,
  WlSubsurfaceResource,
  WlSurfaceResource,
} from 'westfield-runtime-server'
import Session from './Session'

import Subsurface from './Subsurface'
import Surface from './Surface'

export default class Subcompositor implements WlSubcompositorRequests {
  static create(session: Session): Subcompositor {
    return new Subcompositor(session)
  }

  constructor(public readonly session: Session) {}

  private global?: Global

  registerGlobal(registry: Registry): void {
    if (this.global) {
      return
    }
    this.global = registry.createGlobal(this, WlSubcompositorResource.protocolName, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
  }

  unregisterGlobal(): void {
    if (!this.global) {
      return
    }
    this.global.destroy()
    this.global = undefined
  }

  bindClient(client: Client, id: number, version: number): void {
    const grSubcompositorResource = new WlSubcompositorResource(client, id, version)
    grSubcompositorResource.implementation = this
  }

  getSubsurface(
    resource: WlSubcompositorResource,
    id: number,
    wlSurfaceResource: WlSurfaceResource,
    wlParentSurfaceResource: WlSurfaceResource,
  ): void {
    const surface = wlSurfaceResource.implementation as Surface
    if (surface.role) {
      resource.postError(WlSubcompositorError.badSurface, 'Given surface has another role.')
      this.session.logger.warn('[client-protocol-error] - Given surface has another role.')
      return
    }

    const wlSubsurfaceResource = new WlSubsurfaceResource(resource.client, id, resource.version)
    Subsurface.create(this.session, wlParentSurfaceResource, wlSurfaceResource, wlSubsurfaceResource)

    const parentSurface = wlParentSurfaceResource.implementation as Surface

    // having added this sub-surface to a parent will have it create a view for each parent view
    parentSurface.addSubsurface(surface.surfaceChildSelf)
  }

  destroy(resource: WlSubcompositorResource): void {
    resource.destroy()
  }
}
