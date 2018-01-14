'use strict'

import greenfield from './protocol/greenfield-browser-protocol'

import BrowserRtcBlobTransfer from './BrowserRtcBlobTransfer'

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
    this._peerConnectionResolve = null
    this._peerConnectionPromise = new Promise((resolve, reject) => {
      this._peerConnectionResolve = resolve
    })
  }

  /**
   *
   * @param {RtcPeerConnection} resource
   * @param {*} id Returns new blob transfer object who's data will be send over the given rtc peer connection
   * @param {string} descriptor blob transfer descriptor
   *
   * @since 1
   *
   */
  createBlobTransfer (resource, id, descriptor) {
    // TODO check if the descriptor label matches one we send out earlier and notify whoever created that descriptor
    // that there is now a blob transfer object available
    const blobTransferResource = new greenfield.GrBlobTransfer(resource.client, id, resource.version)
    BrowserRtcBlobTransfer._create(blobTransferResource, descriptor, this)
  }

  /**
   * @return {Promise<RTCPeerConnection>}
   */
  onPeerConnection () {
    return this._peerConnectionPromise
  }

  /**
   * Setup the peer connection for client (local) to server (browser) communication.
   */
  ensureP2S () {
    if (this._delegate && this._delegate._peerConnection) {
      // already initialized as p2s, return early.
      return
    } else if (this._delegate && !this._delegate._peerConnection) {
      // TODO we probably want to report this error to the client.
      throw new Error('Rtc peer connection already initialized in P2P mode.')
    }

    this._delegate = {
      _peerConnection: new window.RTCPeerConnection(),

      clientIceCandidates: (resource, description) => {
        const signal = JSON.parse(description)
        this._delegate._peerConnection.addIceCandidate(new window.RTCIceCandidate(signal.candidate)).catch(error => {
          this.onPeerConnectionError(resource.client, error)
        })
      },

      clientSdpReply: (resource, description) => {
        const signal = JSON.parse(description)
        this._delegate._peerConnection.setRemoteDescription(new window.RTCSessionDescription(signal.sdp)).catch((error) => {
          this.onPeerConnectionError(resource.client, error)
        })
      },

      clientSdpOffer: (resource, description) => {
        const signal = JSON.parse(description)
        this._delegate._peerConnection.setRemoteDescription(new window.RTCSessionDescription(signal.sdp)).then(() => {
          return this._delegate._peerConnection.createAnswer()
        }).then((desc) => {
          return this._delegate._peerConnection.setLocalDescription(desc)
        }).then(() => {
          this.rtcPeerConnectionResource.serverSdpReply(JSON.stringify({'sdp': this._delegate._peerConnection.localDescription}))
        }).catch((error) => {
          // FIXME handle error state (disconnect?)
          this.onPeerConnectionError(resource.client, error)
        })
      }
    }

    this._delegate._peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        this.rtcPeerConnectionResource.serverIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }

    this.rtcPeerConnectionResource.init()
    this._peerConnectionResolve(this._delegate._peerConnection)
  }

  /**
   * Setup the peer connection for client (local) to client (local) communication.
   * @param otherRtcPeerConnectionResource
   */
  ensureP2P (otherRtcPeerConnectionResource) {
    if (this._delegate && this._delegate._peerConnection) {
      // TODO we probably want to report this error to the client.
      throw new Error('Rtc peer connection already initialized in P2S mode.')
    } else if (this._delegate && this._delegate.otherRtcPeerConnectionResource !== otherRtcPeerConnectionResource) {
      // TODO we probably want to report this error to the client.
      throw new Error('Rtc peer connection already initialized with another peer.')
    } else if (this._delegate && this._delegate.otherRtcPeerConnectionResource === otherRtcPeerConnectionResource) {
      return
    }

    // TODO keep track in which mode the connection is initialized
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
    // in the p2p case, we will never have a peer connection as it is the client peer connections that will be linked
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
