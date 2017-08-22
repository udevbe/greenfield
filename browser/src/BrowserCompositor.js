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
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
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
    super(greenfield.GrCompositorName, 4)
    this.browserScene = browserScene
    this.glRenderer = glRenderer
    this._renderBusy = false
  }

  bindClient (client, id, version) {
    let grCompositorResource
    switch (version) {
      case 1:
        grCompositorResource = new greenfield.GrCompositor(client, id, 1)
        break
      case 2:
        grCompositorResource = new greenfield.GrCompositorV2(client, id, 2)
        break
      case 3:
        grCompositorResource = new greenfield.GrCompositorV3(client, id, 3)
        break
      default:
        grCompositorResource = new greenfield.GrCompositorV4(client, id, 4)
    }
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
    let grSurfaceResource
    switch (resource.version) {
      case 1:
        grSurfaceResource = new greenfield.GrSurface(resource.client, id, 1)
        break
      case 2:
        grSurfaceResource = new greenfield.GrSurfaceV2(resource.client, id, 2)
        break
      case 3:
        grSurfaceResource = new greenfield.GrSurfaceV3(resource.client, id, 3)
        break
      default:
        grSurfaceResource = new greenfield.GrSurfaceV4(resource.client, id, 4)
    }
    BrowserSurface.create(grSurfaceResource, this)
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
