const webRTC = require('wrtc')

module.exports = class LocalRtcPeerConnection {
  /**
   *
   * @param {wfc.RtcPeerConnection} rtcPeerConnectionProxy
   * @returns {LocalRtcPeerConnection}
   */
  static create (rtcPeerConnectionProxy) {
    const peerConnection = new webRTC.RTCPeerConnection({
      'iceServers': [
        {'urls': 'stun:stun.wtfismyip.com/'}
      ]
    })

    peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        rtcPeerConnectionProxy.clientIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }

    const localRtcPeerConnection = new LocalRtcPeerConnection(rtcPeerConnectionProxy, peerConnection)
    rtcPeerConnectionProxy.listener = localRtcPeerConnection
    return localRtcPeerConnection
  }

  /**
   * Instead use LocalRtcPeerConnection.create(..)
   * @private
   * @param {wfs.RtcPeerConnection} rtcPeerConnectionProxy
   * @param {RTCPeerConnection} peerConnection
   */
  constructor (rtcPeerConnectionProxy, peerConnection) {
    this.rtcPeerConnectionProxy = rtcPeerConnectionProxy
    this.peerConnection = peerConnection
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
      this.rtcPeerConnectionProxy.clientSdpReply(JSON.stringify({'sdp': this.peerConnection.localDescription}))
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
