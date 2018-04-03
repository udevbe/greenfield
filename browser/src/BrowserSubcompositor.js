'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserSubsurface from './BrowserSubsurface'

export default class BrowserSubcompositor extends westfield.Global {
  /**
   * @return {BrowserSubcompositor}
   */
  static create () {
    return new BrowserSubcompositor()
  }

  constructor () {
    super(greenfield.GrSubcompositor.name, 1)
  }

  /**
   * @param {Client}client
   * @param {number}id
   * @param {number}version
   */
  bindClient (client, id, version) {
    const grSubcompositorResource = new greenfield.GrSubcompositor(client, id, version)
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

    const grSubsurface = new greenfield.GrSubsurface(resource.client, id, resource.version)
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
