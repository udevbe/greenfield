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
   * @param {BrowserSession} browserSession
   * @returns {BrowserCompositor}
   */
  static create (browserSession) {
    const browserScene = BrowserScene.create()
    const glRenderer = GLRenderer.create(this._createCanvas())

    const browserCompositor = new BrowserCompositor(browserSession, browserScene, glRenderer)
    browserSession.wfsServer.registry.register(browserCompositor)
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
   * @param {BrowserSession} browserSession
   * @param {BrowserScene} browserScene
   * @param {GLRenderer} glRenderer
   * @private
   */
  constructor (browserSession, browserScene, glRenderer) {
    super(greenfield.GrCompositor.name, 4)
    this.browserSession = browserSession
    this.browserScene = browserScene
    this.glRenderer = glRenderer
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
    if (!this._renderBusy) {
      this._renderBusy = true
      const browserSurfaceViewStack = this.browserScene.createBrowserSurfaceViewStack()

      browserSurfaceViewStack.forEach((view) => {
        this.glRenderer.render(view)

        if (view.browserSurface.frameCallback) {
          view.browserSurface.frameCallback.done(new Date().getTime() | 0) // | 0 is js' way of casting to an int...
          view.browserSurface.frameCallback = null
        }
      })

      window.requestAnimationFrame(() => {
        this.browserSession.flush()
      })

      this._renderBusy = false
    }
  }
}
