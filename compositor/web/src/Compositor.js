'use strict'

import WlCompositorRequests from './protocol/WlCompositorRequests'
import WlCompositorResource from './protocol/WlCompositorResource'
import WlSurfaceResource from './protocol/WlSurfaceResource'
import WlRegionResource from './protocol/WlRegionResource'

import Surface from './Surface'
import Region from './Region'
import GLRenderer from './render/Renderer'

/**
 *
 *            A compositor.  This object is a singleton global.  The
 *            compositor is in charge of combining the contents of multiple
 *            surfaces into one displayable output.
 * @implements WlCompositorRequests
 */
export default class Compositor extends WlCompositorRequests {
  /**
   * @param {!Session} session
   * @param {!Seat} seat
   * @returns {!Compositor}
   */
  static create (session, seat) {
    const glCanvasRenderer = GLRenderer.create()
    return new Compositor(session, glCanvasRenderer, seat)
  }

  /**
   * Use Compositor.create(server) instead.
   * @param {!Session} session
   * @param {!Renderer} renderer
   * @param {!Seat} seat
   * @private
   */
  constructor (session, renderer, seat) {
    super()
    /**
     * @type {!Session}
     * @const
     * @private
     */
    this._session = session
    /**
     * @type {!Renderer}
     * @const
     * @private
     */
    this._renderer = renderer
    /**
     * @type {!Seat}
     * @const
     * @private
     */
    this._seat = seat
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
    this._global = registry.createGlobal(this, WlCompositorResource.protocolName, 4, (client, id, version) => {
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
   *
   * Invoked when a client binds to this global.
   *
   * @param {!Client} client
   * @param {!number} id
   * @param {!number} version
   */
  bindClient (client, id, version) {
    const wlCompositorResource = new WlCompositorResource(client, id, version)
    wlCompositorResource.implementation = this
  }

  /**
   *
   * Ask the compositor to create a new surface.
   *
   *
   * @param {!WlCompositorResource} resource
   * @param {!number} id
   *
   * @since 1
   * @override
   */
  createSurface (resource, id) {
    const wlSurfaceResource = new WlSurfaceResource(resource.client, id, resource.version)
    Surface.create(wlSurfaceResource, this._renderer, this._seat, this._session)
  }

  /**
   *
   * Ask the compositor to create a new region.
   *
   *
   * @param {!WlCompositorResource} resource
   * @param {!number} id
   *
   * @since 1
   *
   */
  createRegion (resource, id) {
    const wlRegionResource = new WlRegionResource(resource.client, id, resource.version)
    Region.create(wlRegionResource)
  }
}
