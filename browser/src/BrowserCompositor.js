'use strict'

import { Global } from 'westfield-runtime-server'
import { GrCompositor, GrSurface, GrRegion } from './protocol/greenfield-browser-protocol'
import BrowserSurface from './BrowserSurface'
import BrowserRegion from './BrowserRegion'
import GLRenderer from './render/Renderer'

/**
 *
 *            A compositor.  This object is a singleton global.  The
 *            compositor is in charge of combining the contents of multiple
 *            surfaces into one displayable output.
 *
 */
export default class BrowserCompositor extends Global {
  /**
   * @param {!BrowserSession} browserSession
   * @param {!BrowserSeat} browserSeat
   * @returns {!BrowserCompositor}
   */
  static create (browserSession, browserSeat) {
    const glCanvasRenderer = GLRenderer.create(browserSession)
    return new BrowserCompositor(browserSession, glCanvasRenderer, browserSeat)
  }

  /**
   * Use BrowserCompositor.create(server) instead.
   * @param {!BrowserSession} browserSession
   * @param {!Renderer} renderer
   * @param {!BrowserSeat} browserSeat
   * @private
   */
  constructor (browserSession, renderer, browserSeat) {
    super(GrCompositor.name, 4)
    /**
     * @type {!BrowserSession}
     * @const
     * @private
     */
    this._browserSession = browserSession
    /**
     * @type {!Renderer}
     * @const
     * @private
     */
    this._renderer = renderer
    /**
     * @type {!BrowserSeat}
     * @const
     * @private
     */
    this._browserSeat = browserSeat
  }

  /**
   * @param {!Client}client
   * @param {!number}id
   * @param {!number}version
   */
  bindClient (client, id, version) {
    const grCompositorResource = new GrCompositor(client, id, version)
    grCompositorResource.implementation = this
  }

  /**
   *
   * Ask the compositor to create a new surface.
   *
   *
   * @param {!GrCompositor} resource
   * @param {!number} id undefined
   *
   * @since 1
   *
   */
  createSurface (resource, id) {
    const grSurfaceResource = new GrSurface(resource.client, id, resource.version)
    BrowserSurface.create(grSurfaceResource, this._renderer, this._browserSeat, this._browserSession)
  }

  /**
   *
   * Ask the compositor to create a new region.
   *
   *
   * @param {!GrCompositor} resource
   * @param {!number} id undefined
   *
   * @since 1
   *
   */
  createRegion (resource, id) {
    const grRegionResource = new GrRegion(resource.client, id, resource.version)
    BrowserRegion.create(grRegionResource)
  }
}
