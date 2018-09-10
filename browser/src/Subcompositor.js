'use strict'

import GrSubcompositorRequests from './protocol/GrSubcompositorRequests'
import GrSubcompositorResource from './protocol/GrSubcompositorResource'
import GrSubsurfaceResource from './protocol/GrSubsurfaceResource'

import Subsurface from './Subsurface'

/**
 *
 *            The global interface exposing sub-surface compositing capabilities.
 *            A gr_surface, that has sub-surfaces associated, is called the
 *            parent surface. Sub-surfaces can be arbitrarily nested and create
 *            a tree of sub-surfaces.
 *
 *            The root surface in a tree of sub-surfaces is the main
 *            surface. The main surface cannot be a sub-surface, because
 *            sub-surfaces must always have a parent.
 *
 *            A main surface with its sub-surfaces forms a (compound) window.
 *            For window management purposes, this set of gr_surface objects is
 *            to be considered as a single window, and it should also behave as
 *            such.
 *
 *            The aim of sub-surfaces is to offload some of the compositing work
 *            within a window from clients to the compositor. A prime example is
 *            a video player with decorations and video in separate gr_surface
 *            objects. This should allow the compositor to pass YUV video buffer
 *            processing to dedicated overlay hardware when possible.
 *
 * @import {GrSubcompositorRequests}
 */
export default class Subcompositor extends GrSubcompositorRequests {
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
    this._global = registry.createGlobal(this, GrSubcompositorRequests.name, 1, (client, id, version) => {
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
    const grSubcompositorResource = new GrSubcompositorResource(client, id, version)
    grSubcompositorResource.implementation = this
  }

  /**
   *
   *                Create a sub-surface interface for the given surface, and
   *                associate it with the given parent surface. This turns a
   *                plain gr_surface into a sub-surface.
   *
   *                The to-be sub-surface must not already have another role, and it
   *                must not have an existing gr_subsurface object. Otherwise a protocol
   *                error is raised.
   *
   *
   * @param {GrSubcompositorResource} resource
   * @param {number} id the new sub-surface object ID
   * @param {GrSurfaceResource} grSurfaceResource the surface to be turned into a sub-surface
   * @param {GrSurfaceResource} grParentSurfaceResource the parent surface
   *
   * @since 1
   *
   */
  getSubsurface (resource, id, grSurfaceResource, grParentSurfaceResource) {
    const surface = /** @type {Surface} */grSurfaceResource.implementation
    if (surface.role) {
      resource.postError(GrSubcompositorResource.Error.badSurface, 'Given surface has another role.')
      DEBUG && console.log('Protocol error. Given surface has another role.')
      return
    }

    const grSubsurface = new GrSubsurfaceResource(resource.client, id, resource.version)
    Subsurface.create(grParentSurfaceResource, grSurfaceResource, grSubsurface)

    const parentSurface = grParentSurfaceResource.implementation

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
