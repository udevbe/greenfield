'use strict'

import GrBufferRequests from './protocol/GrBufferRequests'

/**
 *
 *            A buffer provides the content for a gr_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 * @implements GrBufferRequests
 */
export default class Buffer extends GrBufferRequests {
  /**
   *
   * @param {!GrBufferResource} grBufferResource
   * @return {!Buffer}
   */
  static create (grBufferResource) {
    const buffer = new Buffer(grBufferResource)
    grBufferResource.implementation = buffer
    return buffer
  }

  /**
   * Instead use Buffer.create(..)
   * @private
   * @param {!GrBufferResource}grBufferResource
   */
  constructor (grBufferResource) {
    super()
    /**
     * @type {!GrBufferResource}
     * @const
     */
    this.resource = grBufferResource
  }

  /**
   *
   * @param {!GrBufferResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    resource.destroy()
  }
}
