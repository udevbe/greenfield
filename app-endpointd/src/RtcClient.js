'use strict'

const webRTC = require('wrtc')

class RtcClient {
  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @returns {RtcClient}
   */
  static create (appEndpointCompositorPair) {
    const peerConnection = new webRTC.RTCPeerConnection()
    const rtcClient = new RtcClient(appEndpointCompositorPair, peerConnection)
    peerConnection.onicecandidate = evt => {
      const candidate = evt.candidate
      process.env.DEBUG && console.log(`[app-endpoint-${appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection sending local ice candidate: ${candidate}.`)
      if (candidate !== null) {
        const appEndpointSessionId = appEndpointCompositorPair.appEndpointSessionId
        rtcClient._sendRTCSignal({
          object: 'rtcSocket',
          method: 'iceCandidate',
          args: {
            appEndpointSessionId,
            candidate
          }
        })
      }
    }
    return rtcClient
  }

  /**
   * @param {AppEndpointCompositorPair}appEndpointCompositorPair
   * @param {RTCPeerConnection}peerConnection
   */
  constructor (appEndpointCompositorPair, peerConnection) {
    /**
     * @type {AppEndpointCompositorPair}
     * @private
     */
    this._appEndpointCompositorPair = appEndpointCompositorPair
    /**
     * @type {RTCPeerConnection}
     * @private
     */
    this._peerConnection = peerConnection
  }

  /**
   * @param {*}signal
   * @private
   */
  _sendRTCSignal (signal) {
    this._appEndpointCompositorPair.webSocket.send(JSON.stringify(signal))
  }

  async iceCandidate (args) {
    process.env.DEBUG && console.log(`[app-endpoint-${this._appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection received remote ice candidate.`)

    const { candidate } = args
    await this._peerConnection.addIceCandidate(candidate)
  }

  async sdpOffer (args) {
    process.env.DEBUG && console.log(`[app-endpoint-${this._appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection received remote sdp offer.`)

    const { offer } = args
    await this._peerConnection.setRemoteDescription(offer)
    const answer = await this._peerConnection.createAnswer()
    await this._peerConnection.setLocalDescription(answer)

    process.env.DEBUG && console.log(`[app-endpoint-${this._appEndpointCompositorPair.appEndpointSessionId}] WebRTC connection sending local sdp offer.`)
    this._sendRTCSignal({
      object: 'rtcSocket',
      method: 'sdpReply',
      args: {
        appEndpointSessionId: this._appEndpointCompositorPair.appEndpointSessionId,
        reply: answer
      }
    })
  }
}

module.exports = RtcClient
