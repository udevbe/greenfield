'use strict'

import { Global } from 'westfield-runtime-server'
import { GrSubcompositor, GrSubsurface } from './protocol/greenfield-browser-protocol'
import BrowserSubsurface from './BrowserSubsurface'

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
 */
export default class BrowserSubcompositor extends Global {
  /**
   * @return {BrowserSubcompositor}
   */
  static create () {
    return new BrowserSubcompositor()
  }

  constructor () {
    super(GrSubcompositor.name, 1)
  }

  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const grSubcompositorResource = new GrSubcompositor(client, id, version)
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
   * @param {GrSubcompositor} resource
   * @param {number} id the new sub-surface object ID
   * @param {GrSurface} surface the surface to be turned into a sub-surface
   * @param {GrSurface} parent the parent surface
   *
   * @since 1
   *
   */
  getSubsurface (resource, id, surface, parent) {
    const browserSurface = surface.implementation
    if (browserSurface.role) {
      // TODO protocol error
    }

    const grSubsurface = new GrSubsurface(resource.client, id, resource.version)
    BrowserSubsurface.create(parent, surface, grSubsurface)

    const parentBrowserSurface = parent.implementation

    // having added this sub-surface to a parent will have it create a view for each parent view
    const views = parentBrowserSurface.addSubsurface(browserSurface.browserSurfaceChildSelf)
    const onNewView = (view) => {
      view.onDestroy().then(() => {
        view.detach()
      })
    }
    views.forEach(onNewView)
    // this handles the case where a view is created later on (ie if a new parent view is created)
    browserSurface.onViewCreated = onNewView
  }
}
