'use strict'

const RTCConnectionPool = require('./RTCConnectionPool')

class RTCSignaling {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @return {RTCSignaling}
   */
  static create (appEndpointCompositorPair) {
    return new RTCSignaling(appEndpointCompositorPair)
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   */
  constructor (appEndpointCompositorPair) {
    /**
     * @type {AppEndpointCompositorPair}
     * @private
     */
    this._appEndpointCompositorPair = appEndpointCompositorPair
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCIceCandidateInit | RTCIceCandidate}candidate
   * @return {Promise<void>}
   */
  async ['iceCandidate'] ({ remotePeerId, candidate }) {
    const connectionRTC = await RTCConnectionPool.get(this._appEndpointCompositorPair, remotePeerId)
    await connectionRTC.iceCandidate(candidate)
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCSessionDescriptionInit}reply
   * @return {Promise<void>}
   */
  async ['sdpReply'] ({ remotePeerId, reply }) {
    const connectionRTC = await RTCConnectionPool.get(this._appEndpointCompositorPair, remotePeerId)
    await connectionRTC.sdpReply(reply)
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCSessionDescriptionInit}offer
   * @return {Promise<void>}
   */
  async ['sdpOffer'] ({ remotePeerId, offer }) {
    const connectionRTC = await RTCConnectionPool.get(this._appEndpointCompositorPair, remotePeerId)
    await connectionRTC.sdpOffer(offer)
  }
}

module.exports = RTCSignaling
