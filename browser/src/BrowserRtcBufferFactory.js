'use strict'

import { Global } from 'westfield-runtime-server'
import { GrBuffer } from './protocol/greenfield-browser-protocol'
import { RtcBufferFactory, RtcDcBuffer } from './protocol/rtc-browser-protocol'

import BrowserBuffer from './BrowserBuffer'
import BrowserRtcDcBuffer from './BrowserRtcDcBuffer'

export default class BrowserRtcBufferFactory extends Global {
  /**
   *
   * @param {GrBuffer} grBufferResource
   * @returns {BrowserRtcDcBuffer}
   */
  static get (grBufferResource) {
    // TODO do some kind of type check magic and return null if the implementation is not of the expected type
    return grBufferResource.implementation.browserRtcDcBuffer
  }

  /**
   * @returns {BrowserRtcBufferFactory}
   */
  static create () {
    return new BrowserRtcBufferFactory()
  }

  /**
   * Use BrowserDcBufferFactory.create instead.
   * @private
   */
  constructor () {
    super(RtcBufferFactory.name, 1)
  }

  /**
   *
   * Invoked when a client binds to this global. Subclasses implement this method so they can instantiate a
   * corresponding wfs.Resource subtype.
   *
   * @param {wfs.Client} client
   * @param {Number} id
   * @param {Number} version
   */
  bindClient (client, id, version) {
    const rtcBufferFactoryResource = new RtcBufferFactory(client, id, version)
    rtcBufferFactoryResource.implementation = this
  }

  /**
   *
   * @param {RtcBufferFactory} resource
   * @param {*} id A new generic buffer
   *
   * @since 1
   *
   */
  createBuffer (resource, id) {
    const grBufferResource = new GrBuffer(resource.client, id, resource.version)
    BrowserBuffer.create(grBufferResource)
  }

  /**
   *
   * @param {wfs.RtcBufferFactory} resource
   * @param {Number} id A new datachannel buffer
   * @param {GrBlobTransfer} blobTransferResource
   * @param {wfs.GrBuffer} grBufferResource The generic buffer that will implement the new datachannel buffer
   *
   * @since 1
   *
   */
  createDcBuffer (resource, id, blobTransferResource, grBufferResource) {
    // TODO try/catch & report error to client
    blobTransferResource.implementation.browserRtcPeerConnection.ensureP2S()

    const rtcDcBufferResource = new RtcDcBuffer(resource.client, id, resource.version)
    BrowserRtcDcBuffer.create(grBufferResource, rtcDcBufferResource, blobTransferResource)
  }
}
