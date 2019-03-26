// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

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
