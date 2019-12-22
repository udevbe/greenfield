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

import { WlSubcompositorRequests, WlSubcompositorResource, WlSubsurfaceResource } from 'westfield-runtime-server'

import Subsurface from './Subsurface'

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
 * @import {WlSubcompositorRequests}
 */
export default class Subcompositor extends WlSubcompositorRequests {
  /**
   * @return {Subcompositor}
   */
  static create () {
    return new Subcompositor()
  }

  constructor () {
    super()
    /**
     * @type {Global}
     * @private
     */
    this._global = null
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    if (this._global) {
      return
    }
    this._global = registry.createGlobal(this, WlSubcompositorResource.protocolName, 1, (client, id, version) => {
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
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const grSubcompositorResource = new WlSubcompositorResource(client, id, version)
    grSubcompositorResource.implementation = this
  }

  /**
   *
   *                Create a sub-surface interface for the given surface, and
   *                associate it with the given parent surface. This turns a
   *                plain wl_surface into a sub-surface.
   *
   *                The to-be sub-surface must not already have another role, and it
   *                must not have an existing wl_subsurface object. Otherwise a protocol
   *                error is raised.
   *
   *
   * @param {WlSubcompositorResource} resource
   * @param {number} id the new sub-surface object ID
   * @param {WlSurfaceResource} wlSurfaceResource the surface to be turned into a sub-surface
   * @param {WlSurfaceResource} wlParentSurfaceResource the parent surface
   *
   * @since 1
   *
   */
  getSubsurface (resource, id, wlSurfaceResource, wlParentSurfaceResource) {
    const surface = /** @type {Surface} */wlSurfaceResource.implementation
    if (surface.role) {
      resource.postError(WlSubcompositorResource.Error.badSurface, 'Given surface has another role.')
      window.GREENFIELD_DEBUG && console.log('[client-protocol-error] - Given surface has another role.')
      return
    }

    const wlSubsurfaceResource = new WlSubsurfaceResource(resource.client, id, resource.version)
    Subsurface.create(wlParentSurfaceResource, wlSurfaceResource, wlSubsurfaceResource)

    const parentSurface = wlParentSurfaceResource.implementation

    // having added this sub-surface to a parent will have it create a view for each parent view
    const views = parentSurface.addSubsurface(surface.surfaceChildSelf)
    const onNewView = (view) => {
      view.onDestroy().then(() => {
        view.detach()
      })
    }
    views.forEach(onNewView)
    // this handles the case where a view is created later on (ie if a new parent view is created)
    surface.onViewCreated = onNewView
  }
}
