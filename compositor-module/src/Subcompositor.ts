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
  WlSubcompositorRequests,
  WlSubcompositorResource,
  WlSubcompositorResourceError,
  WlSubsurfaceResource,
  WlSurfaceResource
} from 'westfield-runtime-server'

import Subsurface from './Subsurface'
import Surface from './Surface'

/**
 *
 *            The global interface exposing sub-surface compositing capabilities.
 *            A wl_surface, that has sub-surfaces associated, is called the
 *            parent surface. Sub-surfaces can be arbitrarily nested and create
 *            a tree of sub-surfaces.
 *
 *            The root surface in a tree of sub-surfaces is the main
 *            surface. The main surface cannot be a sub-surface, because
 *            sub-surfaces must always have a parent.
 *
 *            A main surface with its sub-surfaces forms a (compound) window.
 *            For window management purposes, this set of wl_surface objects is
 *            to be considered as a single window, and it should also behave as
 *            such.
 *
 *            The aim of sub-surfaces is to offload some of the compositing work
 *            within a window from clients to the compositor. A prime example is
 *            a video player with decorations and video in separate wl_surface
 *            objects. This should allow the compositor to pass YUV video buffer
 *            processing to dedicated overlay hardware when possible.
 *
 */
export default class Subcompositor implements WlSubcompositorRequests {
  private _global?: Global

  static create(): Subcompositor {
    return new Subcompositor()
  }

  private constructor() {
  }

  registerGlobal(registry: Registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlSubcompositorResource.protocolName, 1, (client, id, version) => {
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
    const grSubcompositorResource = new WlSubcompositorResource(client, id, version)
    grSubcompositorResource.implementation = this
  }

  getSubsurface(resource: WlSubcompositorResource, id: number, wlSurfaceResource: WlSurfaceResource, wlParentSurfaceResource: WlSurfaceResource) {
    const surface = wlSurfaceResource.implementation as Surface
    if (surface.role) {
      resource.postError(WlSubcompositorResourceError.badSurface, 'Given surface has another role.')
      console.log('[client-protocol-error] - Given surface has another role.')
      return
    }

    const wlSubsurfaceResource = new WlSubsurfaceResource(resource.client, id, resource.version)
    Subsurface.create(wlParentSurfaceResource, wlSurfaceResource, wlSubsurfaceResource)

    const parentSurface = wlParentSurfaceResource.implementation as Surface

    // having added this sub-surface to a parent will have it create a view for each parent view
    const views = parentSurface.addSubsurface(surface.surfaceChildSelf)
  }

  destroy(resource: WlSubcompositorResource): void {
    resource.destroy()
  }
}
