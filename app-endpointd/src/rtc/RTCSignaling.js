'use strict'

const RTCChannel = require('./RTCChannel')

class RTCSignaling {
  /**
   * @param {RTCConnectionPool}rtcConnectionPool
   * @return {RTCSignaling}
   */
  static create (rtcConnectionPool) {
    return new RTCSignaling(rtcConnectionPool)
  }

  /**
   * @param {RTCConnectionPool}rtcConnectionPool
   */
  constructor (rtcConnectionPool) {
    /**
     * @type {RTCConnectionPool}
     * @private
     */
    this._rtcConnectionPool = rtcConnectionPool
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCIceCandidateInit | RTCIceCandidate}candidate
   * @return {Promise<void>}
   */
  async ['iceCandidate'] ({ remotePeerId, candidate }) {
    const connectionRTC = this._rtcConnectionPool.get(remotePeerId)
    await connectionRTC.iceCandidate(candidate)
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCSessionDescriptionInit}reply
   * @return {Promise<void>}
   */
  async ['sdpReply'] ({ remotePeerId, reply }) {
    const connectionRTC = this._rtcConnectionPool.get(remotePeerId)
    await connectionRTC.sdpReply(reply)
  }

  /**
   * @param {string}remotePeerId
   * @param {RTCSessionDescriptionInit}offer
   * @return {Promise<void>}
   */
  async ['sdpOffer'] ({ remotePeerId, offer }) {
    const connectionRTC = this._rtcConnectionPool.get(remotePeerId)
    await connectionRTC.sdpOffer(offer)
  }

  async ['connect'] ({ remotePeerId }) {
    // Initiate the creation of a new peer connection because of an external event
    const rtcConnection = this._rtcConnectionPool.get(remotePeerId)
    // Notifier listeners that a new data channel is created
    rtcConnection.peerConnection.ondatachannel = (dataChannelEvent) => {
      const rtcChannel = RTCChannel.wrap(dataChannelEvent.channel)
      this._rtcConnectionPool.channelNotifier.notify(rtcChannel)
    }
  }
}

module.exports = RTCSignaling
