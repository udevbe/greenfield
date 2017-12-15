'use strict'

const webRTC = require('wrtc')

module.exports = class LocalRtcPeerConnection {
  /**
   *
   * @param {wfc.RtcPeerConnection} rtcPeerConnectionProxy
   * @returns {LocalRtcPeerConnection}
   */
  static create (rtcPeerConnectionProxy) {
    const localRtcPeerConnection = new LocalRtcPeerConnection(rtcPeerConnectionProxy)
    rtcPeerConnectionProxy.listener = localRtcPeerConnection
    return localRtcPeerConnection
  }

  /**
   * Instead use LocalRtcPeerConnection.create(..)
   * @private
   * @param {wfs.RtcPeerConnection} rtcPeerConnectionProxy
   */
  constructor (rtcPeerConnectionProxy) {
    this.proxy = rtcPeerConnectionProxy
    this.peerConnection = null
    this._nextDataChannelId = 0
  }

  nextDataChannelId () {
    return ++this._nextDataChannelId
  }

  /**
   * Notify the client that it should start
   * initializing this peer connection. After initialization,
   * this rtc peer connection can be connected with any other rtc peer connection. It's an error to
   * initialize an already initialized peer connection.
   *
   * @since 1
   *
   */
  init () {
    if (this.peerConnection) {
      // TODO this should normally never happen as it's the server that initiates this call and the server is perfect(TM).
      console.error('Peer connection was initialized more than once')
      return
    }

    this.peerConnection = new webRTC.RTCPeerConnection()
    this.peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        this.proxy.clientIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }

    this.peerConnection.onnegotiationneeded = () => {
      this.peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
        voiceActivityDetection: false,
        iceRestart: false
      }).then((desc) => {
        return this.peerConnection.setLocalDescription(desc)
      }).then(() => {
        this.proxy.clientSdpOffer(JSON.stringify({'sdp': this.peerConnection.localDescription}))
      }).catch((error) => {
        this.onPeerConnectionError(error)
      })
    }
  }

  /**
   *
   * @param {string} description
   *
   * @since 1
   *
   */
  serverSdpReply (description) {
    const signal = JSON.parse(description)
    this.peerConnection.setRemoteDescription(new webRTC.RTCSessionDescription(signal.sdp)).catch((error) => {
      console.log('Error: Failure during setRemoteDescription()', error)
      // FIXME handle error state (disconnect?)
    })
  }

  /**
   *
   * @param {string} description
   *
   * @since 1
   *
   */
  serverSdpOffer (description) {
    const signal = JSON.parse(description)

    this.peerConnection.setRemoteDescription(new webRTC.RTCSessionDescription(signal.sdp)).then(() => {
      return this.peerConnection.createAnswer()
    }).then((desc) => {
      return this.peerConnection.setLocalDescription(desc)
    }).then(() => {
      this.proxy.clientSdpReply(JSON.stringify({'sdp': this.peerConnection.localDescription}))
    }).catch((error) => {
      console.error(error)
      // FIXME handle error state (disconnect?)
    })
  }

  /**
   *
   * @param {string} description
   *
   * @since 1
   *
   */
  serverIceCandidates (description) {
    const signal = JSON.parse(description)
    this.peerConnection.addIceCandidate(new webRTC.RTCIceCandidate(signal.candidate)).catch(error => {
      console.log('Error: Failure during addIceCandidate()', error)
      // FIXME handle error state (disconnect?)
    })
  }
}
