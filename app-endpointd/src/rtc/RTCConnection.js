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

const webRTC = require('wrtc')
const ChannelFactory = require('../ChannelFactory')
const RTCChannel = require('./RTCChannel')

/**
 * @implements ChannelFactory
 */
class RTCConnection extends ChannelFactory {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {Object}peerConnectionConfig
   * @param {string}remotePeerId
   * @return {RTCConnection}
   */
  static create (appEndpointCompositorPair, peerConnectionConfig, remotePeerId) {
    const peerConnection = new webRTC.RTCPeerConnection(peerConnectionConfig)
    const connectionRTC = new RTCConnection(appEndpointCompositorPair, peerConnection, remotePeerId)

    peerConnection.onicecandidate = evt => {
      const candidate = evt.candidate
      if (candidate !== null) {
        process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: sending local ice candidate: ${JSON.stringify(candidate)}.`)
        const appEndpointSessionId = appEndpointCompositorPair.appEndpointSessionId
        connectionRTC._sendRTCSignal({
          object: 'RTCSignaling',
          method: 'iceCandidate',
          args: {
            remotePeerId: appEndpointSessionId,
            candidate
          }
        })
      }
    }
    peerConnection.onnegotiationneeded = () => {
      process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: negotiation needed.`)
      connectionRTC._sendOffer()
    }

    // TODO properly figure out rtc peer connection lifecycle
    peerConnection.onconnectionstatechange = () => {
      switch (peerConnection.connectionState) {
        case 'disconnected':
          process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: state is disconnected.`)
          connectionRTC.destroy()
          break
        case 'failed':
          process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: state is failed.`)
          connectionRTC.destroy()
          break
        case 'closed':
          process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: state is closed.`)
          connectionRTC.destroy()
          break
      }
    }
    return connectionRTC
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {RTCPeerConnection}peerConnection
   * @param {string}remotePeerUUID
   */
  constructor (appEndpointCompositorPair, peerConnection, remotePeerUUID) {
    super()
    /**
     * @type {AppEndpointCompositorPair}
     */
    this.appEndpointCompositorPair = appEndpointCompositorPair
    /**
     * @type {RTCPeerConnection}
     */
    this.peerConnection = peerConnection
    /**
     * @type {string}
     */
    this.remotePeerUUID = remotePeerUUID
  }

  /**
   * @param {*}signal
   * @private
   */
  _sendRTCSignal (signal) {
    this.appEndpointCompositorPair.sendSignal(this.remotePeerUUID, signal)
  }

  /**
   * @param {RTCIceCandidateInit | RTCIceCandidate}candidate
   * @return {Promise<void>}
   */
  async iceCandidate (candidate) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: received remote ice candidate: ${JSON.stringify(candidate)}.`)
    await this.peerConnection.addIceCandidate(candidate)
  }

  /**
   * @param {RTCSessionDescriptionInit}offer
   * @return {Promise<void>}
   */
  async sdpOffer (offer) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: received browser sdp offer: ${JSON.stringify(offer)}.`)
    await this.peerConnection.setRemoteDescription(offer)
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)

    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: sending local sdp answer: ${JSON.stringify(answer)}.`)
    this._sendRTCSignal({
      object: 'RTCSignaling',
      method: 'sdpReply',
      args: {
        remotePeerId: this.appEndpointCompositorPair.appEndpointSessionId,
        reply: answer
      }
    })
  }

  /**
   * @param {RTCSessionDescriptionInit}reply
   * @return {Promise<void>}
   */
  async sdpReply (reply) {
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: received browser sdp answer: ${JSON.stringify(reply)}.`)
    await this.peerConnection.setRemoteDescription(reply)
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async _sendOffer () {
    const offer = await this.peerConnection.createOffer()
    await this.peerConnection.setLocalDescription(offer)
    process.env.DEBUG && console.log(`[app-endpoint: ${this.appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: sending local sdp offer: ${JSON.stringify(offer)}.`)
    this._sendRTCSignal({
      object: 'RTCSignaling',
      method: 'sdpOffer',
      args: {
        remotePeerId: this.appEndpointCompositorPair.appEndpointSessionId,
        offer
      }
    })
  }

  connect () {
    this._sendRTCSignal({
      object: 'RTCSignaling',
      method: 'connect',
      args: {
        remotePeerId: this.appEndpointCompositorPair.appEndpointSessionId
      }
    })
  }

  /**
   * @return {RTCChannel}
   */
  createChannel () {
    return RTCChannel.create(this.peerConnection)
  }
}

module.exports = RTCConnection
