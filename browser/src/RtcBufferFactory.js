'use strict'

import RtcBufferFactoryRequests from './protocol/RtcBufferFactoryRequests'
import GrBufferResource from './protocol/GrBufferResource'
import RtcDcBufferResource from './protocol/RtcDcBufferResource'

import Buffer from './Buffer'
import RtcDcBuffer from './RtcDcBuffer'

/**
 * @implements {RtcBufferFactoryRequests}
 */
export default class RtcBufferFactory extends RtcBufferFactoryRequests {
  /**
   *
   * @param {!GrBufferResource} grBufferResource
   * @returns {!RtcDcBuffer}
   */
  static get (grBufferResource) {
    // TODO do some kind of type check magic and return null if the implementation is not of the expected type
    return grBufferResource.implementation.rtcDcBuffer
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
  }

  /**
   * @param {Registry}registry
   */
  registerGlobal (registry) {
    registry.createGlobal(this, RtcBufferFactory.name, 1, (client, id, version) => {
      this.bindClient(client, id, version)
    })
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
    const grBufferResource = new GrBufferResource(resource.client, id, resource.version)
    Buffer.create(grBufferResource)
  }

  /**
   *
   * @param {!RtcBufferFactoryResource} resource
   * @param {!number} id A new datachannel buffer
   * @param {!GrBlobTransferResource} blobTransferResource
   * @param {!GrBufferResource} grBufferResource The generic buffer that will implement the new datachannel buffer
   *
   * @since 1
   *
   */
  createDcBuffer (resource, id, blobTransferResource, grBufferResource) {
    // TODO try/catch & report error to client
    const rtcBlobTransfer = /** @type {RtcBlobTransfer} */ blobTransferResource.implementation
    rtcBlobTransfer.rtcPeerConnection.ensureP2S()

    const rtcDcBufferResource = new RtcDcBufferResource(resource.client, id, resource.version)
    RtcDcBuffer.create(grBufferResource, rtcDcBufferResource, blobTransferResource)
  }
}
