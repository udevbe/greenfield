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
      if (evt.candidate !== null) {
        global.DEBUG && console.log(`WebRTC connection: ${appEndpointCompositorPair.appEndpointSessionId} sending local ice candidate.`)
        rtcClient._sendRTCSignal({
          object: 'rtcSocket',
          method: 'iceCandidate',
          args: {
            appEndpointSessionId: appEndpointCompositorPair.appEndpointSessionId,
            iceCandidate: evt.candidate
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
    this._session.webSocket.send(JSON.stringify({
      object: 'signalingServer',
      method: 'rtcAppEndpointSignal',
      args: {
        signalMessage: JSON.stringify(signal)
      }
    }))
  }

  async iceCandidate (args) {
    const { candidate } = args
    await this._peerConnection.addIceCandidate(candidate)
  }

  async sdpOffer (args) {
    const { offer } = args
    await this._peerConnection.setRemoteDescription(offer)
    const answer = await this._peerConnection.createAnswer()
    await this._peerConnection.setLocalDescription(answer)

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
