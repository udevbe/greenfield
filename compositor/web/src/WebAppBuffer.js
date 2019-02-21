'use strict'

import WlBufferRequests from './protocol/WlBufferRequests'

// TODO create a wl_offscreen_webgl protocol so clients can talk to the compositor to setup an offscreen webgl canvas
/**
 *
 *            A buffer provides the content for a wl_surface. Buffers are
 *            created through factory interfaces such as gr_drm, gr_shm or
 *            similar. It has a width and a height and can be attached to a
 *            gr_surface, but the mechanism by which a client provides and
 *            updates the contents is defined by the buffer factory interface.
 * @implements WlBufferRequests
 * @implements GreenfieldBuffer
 */
export default class WebAppBuffer extends WlBufferRequests {
  /**
   *
   * @param {!WlBufferResource} wlBufferResource
   * @param {ImageBitmap}imageBitmap
   * @return {!WebAppBuffer}
   */
  static create (wlBufferResource, imageBitmap) {
    return new WebAppBuffer(wlBufferResource, imageBitmap)
  }

  /**
   * @param {!WlBufferResource} wlBufferResource
   * @param {ImageBitmap}imageBitmap
   */
  constructor (wlBufferResource, imageBitmap) {
    super()
    /**
     * @type {!WlBufferResource}
     */
    this.resource = wlBufferResource
    /**
     * @type {ImageBitmap}
     */
    this.imageBitmap = imageBitmap
  }

  /**
   *
   * @param {!WlBufferResource} resource
   *
   * @since 1
   * @override
   */
  destroy (resource) {
    this.imageBitmap.close()
    resource.destroy()
  }

  /**
   * @param commitSerial
   * @return {!Promise<*>}
   */
  async getContents (commitSerial) {
    return Promise.resolve(this.imageBitmap)
  }
}
