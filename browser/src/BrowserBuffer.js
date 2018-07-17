'use strict'

/**
 *
 *            A buffer provides the content for a gr_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 *
 */
export default class BrowserBuffer {
  /**
   *
   * @param {!GrBuffer} grBufferResource
   * @return {!BrowserBuffer}
   */
  static create (grBufferResource) {
    const browserBuffer = new BrowserBuffer(grBufferResource)
    grBufferResource.implementation = browserBuffer
    return browserBuffer
  }

  /**
   * Instead use BrowserBuffer.create(..)
   * @private
   * @param {!GrBuffer}grBufferResource
   */
  constructor (grBufferResource) {
    /**
     * @type {!GrBuffer}
     * @const
     */
    this.resource = grBufferResource
  }

  /**
   *
   * @param {!GrBuffer} resource
   *
   * @since 1
   *
   */
  destroy (resource) {
    resource.destroy()
  }
}
