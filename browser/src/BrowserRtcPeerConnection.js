'use strict'

export default class BrowserRtcPeerConnection {
  /**
   * @returns {BrowserRtcPeerConnection}
   */
  static create (rtcPeerConnectionResource) {
    const browserRtcPeerConnection = new BrowserRtcPeerConnection(rtcPeerConnectionResource)
    rtcPeerConnectionResource.implementation = browserRtcPeerConnection
    return browserRtcPeerConnection
  }

  constructor (rtcPeerConnectionResource) {
    this.rtcPeerConnectionResource = rtcPeerConnectionResource
    this._delegate = null
  }

  initP2Server () {
    this._delegate = {
      peerConnection: new window.RTCPeerConnection(),

      clientIceCandidates: (resource, description) => {
        const signal = JSON.parse(description)
        this._delegate.peerConnection.addIceCandidate(new window.RTCIceCandidate(signal.candidate)).catch(error => {
          this.onPeerConnectionError(resource.client, error)
        })
      },

      clientSdpReply: (resource, description) => {
        const signal = JSON.parse(description)
        this._delegate.peerConnection.setRemoteDescription(new window.RTCSessionDescription(signal.sdp)).catch((error) => {
          this.onPeerConnectionError(resource.client, error)
        })
      },

      clientSdpOffer: (resource, description) => {
        const signal = JSON.parse(description)
        this._delegate.peerConnection.setRemoteDescription(new window.RTCSessionDescription(signal.sdp)).then(() => {
          return this._delegate.peerConnection.createAnswer()
        }).then((desc) => {
          return this._delegate.peerConnection.setLocalDescription(desc)
        }).then(() => {
          this.rtcPeerConnectionResource.serverSdpReply(JSON.stringify({'sdp': this._delegate.peerConnection.localDescription}))
        }).catch((error) => {
          // FIXME handle error state (disconnect?)
          this.onPeerConnectionError(resource.client, error)
        })
      }
    }

    this._delegate.peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        this.rtcPeerConnectionResource.serverIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }

    this.rtcPeerConnectionResource.init()
  }

  initP2P (otherRtcPeerConnectionResource) {
    this._delegate = {
      otherRtcPeerConnectionResource: otherRtcPeerConnectionResource,
      clientIceCandidates: (resource, description) => {
        this._delegate.otherRtcPeerConnectionResource.serverIceCandidates(description)
      },

      clientSdpReply: (resource, description) => {
        this._delegate.otherRtcPeerConnectionResource.serverSdpReply(description)
      },

      clientSdpOffer: (resource, description) => {
        this._delegate.otherRtcPeerConnectionResource.serverSdpOffer(description)
      }
    }

    this.rtcPeerConnectionResource.init()
  }

  clientIceCandidates (resource, description) {
    this._delegate.clientIceCandidates(resource, description)
  }

  clientSdpReply (resource, description) {
    this._delegate.clientSdpReply(resource, description)
  }

  clientSdpOffer (resource, description) {
    this._delegate.clientSdpOffer(resource, description)
  }

  // FIXME signal error to client & disconnect
  onPeerConnectionError (client, error) {}
}
