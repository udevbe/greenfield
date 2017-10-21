'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserSurface from './BrowserSurface'
import BrowserRegion from './BrowserRegion'
import BrowserScene from './BrowserScene'
import GLRenderer from './render/Renderer'

export default class BrowserCompositor extends westfield.Global {
  /**
   *
   * @param {BrowserSession} browserSession
   * @returns {BrowserCompositor}
   */
  static create (browserSession) {
    const browserScene = BrowserScene.create()
    const glCanvasRenderer = GLRenderer.create(browserScene, browserSession)

    const browserCompositor = new BrowserCompositor(browserSession, browserScene, glCanvasRenderer)
    browserSession.wfsServer.registry.register(browserCompositor)
    return browserCompositor
  }

  /**
   * Use BrowserCompositor.create(server) instead.
   * @param {BrowserSession} browserSession
   * @param {BrowserScene} browserScene
   * @param {Renderer} renderer
   * @private
   */
  constructor (browserSession, browserScene, renderer) {
    super(greenfield.GrCompositor.name, 4)
    this.browserSession = browserSession
    this.browserScene = browserScene
    this.renderer = renderer
    this._renderBusy = false
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
    const browserSurface = BrowserSurface.create(grSurfaceResource, this)
    this.browserScene.browserSurfaces.push(browserSurface)
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

  requestRender () {
    this.renderer.renderAll()
  }
}
