'use strict'

import WlBufferRequests from './protocol/WlBufferRequests'

// TODO create a wl_offscreen_webgl protocol so clients can talk to the compositor to setup an offscreen webgl canvas
/**
 *
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
   * @param commitSerial
   * @return {!Promise<*>}
   */
  async getContents (commitSerial) {
    return Promise.resolve(this.imageBitmap)
  }
}
