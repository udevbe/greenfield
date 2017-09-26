'use strict'

import westfield from 'westfield-runtime-server'
import greenfield from './protocol/greenfield-browser-protocol'
import BrowserSurface from './BrowserSurface'
import BrowserRegion from './BrowserRegion'
import BrowserScene from './BrowserScene'
import GLRenderer from './render/GLRenderer'

export default class BrowserCompositor extends westfield.Global {
  /**
   *
   * @param {Server} server
   * @returns {BrowserCompositor}
   */
  static create (server) {
    const browserScene = BrowserScene.create()
    const glRenderer = GLRenderer.create(this._createCanvas())

    const browserCompositor = new BrowserCompositor(browserScene, glRenderer)
    server.registry.register(browserCompositor)
    return browserCompositor
  }

  /**
   * @returns {HTMLCanvasElement}
   * @private
   */
  static _createCanvas () {
    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    document.body.appendChild(canvas)
    return canvas
  }

  /**
   * Use BrowserCompositor.create(server) instead.
   * @param {BrowserScene} browserScene
   * @param {GLRenderer} glRenderer
   * @private
   */
  constructor (browserScene, glRenderer) {
    super(greenfield.GrCompositor.name, 4)
    this.browserScene = browserScene
    this.glRenderer = glRenderer
    this._renderBusy = false
  }

  bindClient (client, id, version) {
    const grCompositorResource = new greenfield.GrCompositor(client, id, version)
    grCompositorResource.implementation = this
  }

  onClientConnection (clientConnection) {}

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
    if (!this._renderBusy) {
      this._renderBusy = true
      setTimeout(() => {
        const browserSurfaceViewStack = this.browserScene.createBrowserSurfaceViewStack()
        browserSurfaceViewStack.forEach((browserSurfaceView) => {
          this.glRenderer.render(browserSurfaceView)
        })
        this._renderBusy = false
      }, 0)
    }
  }
}
