'use strict'

import RtcPeerConnectionFactoryRequests from './protocol/RtcPeerConnectionFactoryRequests'
import RtcPeerConnectionFactoryResource from './protocol/RtcPeerConnectionFactoryResource'
import RtcPeerConnectionResource from './protocol/RtcPeerConnectionResource'

import RtcPeerConnection from './RtcPeerConnection'

/**
 * @implements RtcPeerConnectionFactoryRequests
 */
export default class RtcPeerConnectionFactory extends RtcPeerConnectionFactoryRequests {
  /**
   * @return {RtcPeerConnectionFactory}
   */
  static create () {
    return new RtcPeerConnectionFactory()
  }

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
    this._global = registry.createGlobal(this, RtcPeerConnectionFactoryResource.name, 1, (client, id, version) => {
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
    const rtcPeerConnectionFactoryResource = new RtcPeerConnectionFactory(client, id, version)
    rtcPeerConnectionFactoryResource.implementation = this
  }

  /**
   * @param {RtcPeerConnectionFactoryResource}resource
   * @param {number}id
   */
  createRtcPeerConnection (resource, id) {
    const rtcPeerConnectionResource = new RtcPeerConnectionResource(resource.client, id, resource.version)
    RtcPeerConnection.create(rtcPeerConnectionResource)
  }
}
