'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserSurface from './BrowserSurface'
import BrowserRegion from './BrowserRegion'
import GLRenderer from './render/Renderer'

export default class BrowserCompositor extends westfield.Global {
  /**
   *
   * @param {BrowserSession} browserSession
   * @returns {BrowserCompositor}
   */
  static create (browserSession) {
    const glCanvasRenderer = GLRenderer.create(browserSession)

    const browserCompositor = new BrowserCompositor(browserSession, glCanvasRenderer)
    browserSession.wfsServer.registry.register(browserCompositor)
    return browserCompositor
  }

  /**
   * Use BrowserCompositor.create(server) instead.
   * @param {BrowserSession} browserSession
   * @param {Renderer} renderer
   * @private
   */
  constructor (browserSession, renderer) {
    super(greenfield.GrCompositor.name, 4)
    this.browserSession = browserSession
    this.renderer = renderer
  }

  bindClient (client, id, version) {
    const grCompositorResource = new greenfield.GrCompositor(client, id, version)
    grCompositorResource.implementation = this
  }

  /**
   *
   * Ask the compositor to create a new surface.
   *
   *
   * @param {GrCompositor} resource
   * @param {*} id undefined
   *
   * @since 1
   *
   */
  createSurface (resource, id) {
    const grSurfaceResource = new greenfield.GrSurface(resource.client, id, resource.version)
    BrowserSurface.create(grSurfaceResource, this.renderer)
  }

  /**
   *
   * Ask the compositor to create a new region.
   *
   *
   * @param {GrCompositor} resource
   * @param {*} id undefined
   *
   * @since 1
   *
   */
  createRegion (resource, id) {
    const grRegionResource = new greenfield.GrRegion(resource.client, id, 1)
    BrowserRegion.create(grRegionResource)
  }
}
