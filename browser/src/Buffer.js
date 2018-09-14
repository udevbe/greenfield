'use strict'

import WlBufferRequests from './protocol/WlBufferRequests'

/**
 *
 *            A buffer provides the content for a gr_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 * @implements WlBufferRequests
 */
export default class Buffer extends WlBufferRequests {
  /**
   *
   * @param {!WlBufferResource} wlBufferResource
   * @return {!Buffer}
   */
  static create (wlBufferResource) {
    const buffer = new Buffer(wlBufferResource)
    wlBufferResource.implementation = buffer
    return buffer
  }

  /**
   * Instead use Buffer.create(..)
   * @private
   * @param {!WlBufferResource}wlBufferResource
   */
  constructor (wlBufferResource) {
    super()
    /**
     * @type {!WlBufferResource}
     * @const
     */
    this.resource = wlBufferResource
  }

  /**
   *
   * @param {!WlBufferResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    resource.destroy()
  }
}
