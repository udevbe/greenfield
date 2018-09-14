'use strict'

import RtcBufferFactoryRequests from './protocol/RtcBufferFactoryRequests'
import WlBufferResource from './protocol/WlBufferResource'
import RtcDcBufferResource from './protocol/RtcDcBufferResource'

import Buffer from './Buffer'
import RtcDcBuffer from './RtcDcBuffer'

/**
 * @implements {RtcBufferFactoryRequests}
 */
export default class RtcBufferFactory extends RtcBufferFactoryRequests {
  /**
   *
   * @param {!WlBufferResource} wlBufferResource
   * @returns {!RtcDcBuffer}
   */
  static get (wlBufferResource) {
    // TODO do some kind of type check magic and return null if the implementation is not of the expected type
    return wlBufferResource.implementation.rtcDcBuffer
  }

  /**
   * @returns {!RtcBufferFactory}
   */
  static create () {
    return new RtcBufferFactory()
  }

  /**
   * Use DcBufferFactory.create instead.
   * @private
   */
  constructor () {
    super()
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
    this._global = registry.createGlobal(this, RtcBufferFactory.name, 1, (client, id, version) => {
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
   * Invoked when a client binds to this global. Subclasses implement this method so they can instantiate a
   * corresponding Resource subtype.
   *
   * @param {!Client} client
   * @param {!number} id
   * @param {!number} version
   */
  bindClient (client, id, version) {
    const rtcBufferFactoryResource = new RtcBufferFactory(client, id, version)
    rtcBufferFactoryResource.implementation = this
  }

  /**
   *
   * @param {!RtcBufferFactoryResource} resource
   * @param {!number} id A new generic buffer
   *
   * @since 1
   *
   */
  createBuffer (resource, id) {
    const wlBufferResource = new WlBufferResource(resource.client, id, resource.version)
    Buffer.create(wlBufferResource)
  }

  /**
   *
   * @param {!RtcBufferFactoryResource} resource
   * @param {!number} id A new datachannel buffer
   * @param {!GrBlobTransferResource} grBlobTransferResource
   * @param {!WlBufferResource} wlBufferResource The generic buffer that will implement the new datachannel buffer
   *
   * @since 1
   *
   */
  createDcBuffer (resource, id, grBlobTransferResource, wlBufferResource) {
    // TODO try/catch & report error to client
    const rtcBlobTransfer = /** @type {RtcBlobTransfer} */ grBlobTransferResource.implementation
    rtcBlobTransfer.rtcPeerConnection.ensureP2S()

    const rtcDcBufferResource = new RtcDcBufferResource(resource.client, id, resource.version)
    RtcDcBuffer.create(wlBufferResource, rtcDcBufferResource, grBlobTransferResource)
  }
}
