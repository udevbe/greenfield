'use strict'

const webRTC = require('wrtc')

class ConnectionRTC {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {Object}peerConnectionConfig
   * @param {string}remotePeerId
   * @return {ConnectionRTC}
   */
  static create (appEndpointCompositorPair, peerConnectionConfig, remotePeerId) {
    const peerConnection = new webRTC.RTCPeerConnection(peerConnectionConfig)
    const connectionRTC = new ConnectionRTC(appEndpointCompositorPair, peerConnection, remotePeerId)

    peerConnection.onicecandidate = evt => {
      const candidate = evt.candidate
      if (candidate !== null) {
        process.env.DEBUG && console.log(`[app-endpoint: ${appEndpointCompositorPair.appEndpointSessionId}] - WebRTC connection: sending local ice candidate: ${JSON.stringify(candidate)}.`)
        const appEndpointSessionId = appEndpointCompositorPair.appEndpointSessionId
        connectionRTC._sendRTCSignal({
          object: 'signalingRTC',
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
    this.appEndpointCompositorPair.webSocket.send(JSON.stringify({
      target: this.remotePeerUUID,
      payload: signal
    }))
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
      object: 'signalingRTC',
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
      object: 'signalingRTC',
      method: 'sdpOffer',
      args: {
        remotePeerId: this.appEndpointCompositorPair.appEndpointSessionId,
        offer
      }
    })
  }

  connect () {
    this._sendRTCSignal({
      object: 'signalingRTC',
      method: 'connect',
      args: {
        remotePeerId: this.appEndpointCompositorPair.appEndpointSessionId
      }
    })
  }
}

module.exports = ConnectionRTC
