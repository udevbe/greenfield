'use strict'

/**
 * Conceptual webRTC server socket as webRTC doesn't have the notion of server/client model.
 * Clients (application endpoints) announce their desire to create a new RTC peer connection here.
 */
export default class RtcSocket {
  /**
   *
   * @param {Session}session
   * @returns {RtcSocket}
   */
  static create (session) {
    const rtcSocket = new RtcSocket(session)
    session.messageHandlers['rtcSocket'] = rtcSocket
    return rtcSocket
  }

  /**
   * @param {Session}session
   */
  constructor (session) {
    /**
     * @type {Session}
     * @private
     */
    this._session = session
    /**
     * @type {Object.<string,RTCPeerConnection>}
     * @private
     */
    this._peerConnections = {}
  }

  async connect (args) {
    const {
      appEndpointSessionId
    } = args

    if (this._peerConnections[appEndpointSessionId]) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} already exists.`)
    }

    // TODO rtc connection options setup
    const peerConnection = new RTCPeerConnection()
    this._peerConnections[appEndpointSessionId] = peerConnection

    peerConnection.onnegotiationneeded = async () => {
      DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} negotiation needed.`)
      await this._sendOffer(appEndpointSessionId, peerConnection)
    }

    peerConnection.onicecandidate = evt => {
      if (evt.candidate !== null) {
        DEBUG && console.log(`WebRTC connection: ${appEndpointSessionId} sending local ice candidate.`)
        this._sendRTCSignal(appEndpointSessionId, {
          object: 'rtcClient',
          method: 'iceCandidate',
          args: evt.candidate
        })
      }
    }

    await this._sendOffer(appEndpointSessionId, peerConnection)
  }

  async _sendOffer (appEndpointSessionId, peerConnection) {
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    this._sendRTCSignal(appEndpointSessionId, {
      object: 'rtcClient',
      method: 'sdpOffer',
      args: offer
    })
  }

  /**
   * @param {string}appEndpointSessionId
   * @param {*}signal
   * @private
   */
  _sendRTCSignal (appEndpointSessionId, signal) {
    this._session.webSocket.send(JSON.stringify({
      object: 'signalingServer',
      method: 'rtcSignal',
      args: {
        appEndpointSessionId,
        signalMessage: JSON.stringify(signal)
      }
    }))
  }

  async iceCandidate (args) {
    const {
      appEndpointSessionId,
      candidate
    } = args

    const peerConnection = this._peerConnections[appEndpointSessionId]
    if (!peerConnection) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} was not found.`)
    }

    await peerConnection.addIceCandidate(candidate)
  }

  async sdpReply (args) {
    const {
      appEndpointSessionId,
      reply
    } = args

    const peerConnection = this._peerConnections[appEndpointSessionId]
    if (!peerConnection) {
      throw new Error(`WebRTC connection: ${appEndpointSessionId} was not found.`)
    }

    await peerConnection.setRemoteDescription(reply)
  }
}
