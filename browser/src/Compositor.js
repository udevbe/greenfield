'use strict'

import GrCompositorRequests from './protocol/GrCompositorRequests'
import GrCompositorResource from './protocol/GrCompositorResource'
import GrSurfaceResource from './protocol/GrSurfaceResource'
import GrRegionResource from './protocol/GrRegionResource'

import Surface from './Surface'
import Region from './Region'
import GLRenderer from './render/Renderer'

/**
 *
 *            A compositor.  This object is a singleton global.  The
 *            compositor is in charge of combining the contents of multiple
 *            surfaces into one displayable output.
 * @implements GrCompositorRequests
 */
export default class Compositor extends GrCompositorRequests {
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
    this._global = registry.createGlobal(this, GrCompositorResource.name, 4, (client, id, version) => {
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
    const grCompositorResource = new GrCompositorResource(client, id, version)
    grCompositorResource.implementation = this
  }

  /**
   *
   * Ask the compositor to create a new surface.
   *
   *
   * @param {!GrCompositorResource} resource
   * @param {!number} id
   *
   * @since 1
   * @override
   */
  createSurface (resource, id) {
    const grSurfaceResource = new GrSurfaceResource(resource.client, id, resource.version)
    Surface.create(grSurfaceResource, this._renderer, this._seat, this._session)
  }

  /**
   *
   * Ask the compositor to create a new region.
   *
   *
   * @param {!GrCompositorResource} resource
   * @param {!number} id
   *
   * @since 1
   *
   */
  createRegion (resource, id) {
    const grRegionResource = new GrRegionResource(resource.client, id, resource.version)
    Region.create(grRegionResource)
  }
}
