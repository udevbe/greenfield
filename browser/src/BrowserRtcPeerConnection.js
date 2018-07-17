'use strict'

import { GrBlobTransfer } from './protocol/greenfield-browser-protocol'

import BrowserRtcBlobTransfer from './BrowserRtcBlobTransfer'

export default class BrowserRtcPeerConnection {
  /**
   * @param {!RtcPeerConnection}rtcPeerConnectionResource
   * @returns {!BrowserRtcPeerConnection}
   */
  static create (rtcPeerConnectionResource) {
    const browserRtcPeerConnection = new BrowserRtcPeerConnection(rtcPeerConnectionResource)
    rtcPeerConnectionResource.implementation = browserRtcPeerConnection
    return browserRtcPeerConnection
  }

  /**
   * Use BrowserRtcPeerConnection.create(..)
   * @param {!RtcPeerConnection}rtcPeerConnectionResource
   * @private
   */
  constructor (rtcPeerConnectionResource) {
    /**
     * @type {!RtcPeerConnection}
     * @const
     */
    this.rtcPeerConnectionResource = rtcPeerConnectionResource
    /**
     * @type {?{_peerConnection:window.RTCPeerConnection, clientIceCandidates:Function, clientSdpReply:Function, clientSdpOffer: Function}}
     * @private
     */
    this._delegate = null
    /**
     * @type {?Function}
     * @private
     */
    this._peerConnectionResolve = null
    /**
     * @type {!Promise}
     * @private
     */
    this._peerConnectionPromise = new Promise((resolve) => {
      this._peerConnectionResolve = resolve
    })
  }

  /**
   *
   * @param {!RtcPeerConnection} resource
   * @param {!number} id Returns new blob transfer object who's data will be send over the given rtc peer connection
   * @param {!string} descriptor blob transfer descriptor
   *
   * @since 1
   *
   */
  createBlobTransfer (resource, id, descriptor) {
    // TODO check if the descriptor label matches one we send out earlier and notify whoever created that descriptor
    // that there is now a blob transfer object available
    const blobTransferResource = new GrBlobTransfer(resource.client, id, resource.version)
    BrowserRtcBlobTransfer._create(blobTransferResource, descriptor, this)
  }

  /**
   * @return {!Promise<RTCPeerConnection>}
   */
  onPeerConnection () {
    return this._peerConnectionPromise
  }

  /**
   * Setup the peer connection for client (local) to server (browser) communication.
   */
  async ensureP2S () {
    if (this._delegate && this._delegate._peerConnection) {
      // already initialized as p2s, return early.
      return
    } else if (this._delegate && !this._delegate._peerConnection) {
      // TODO we probably want to report this error to the client.
      throw new Error('Rtc peer connection already initialized in P2P mode.')
    }

    this._delegate = {
      _peerConnection: new window.RTCPeerConnection(
        {
          'iceServers': [
            {
              'urls': 'turn:badger.pfoe.be?transport=tcp',
              'username': 'greenfield',
              'credential': 'water'
            },
            {
              'urls': 'stun:stun.l.google.com:19302'
            }
          ]
        }
      ),

      clientIceCandidates: async (resource, description) => {
        try {
          const signal = JSON.parse(description)
          // console.log(`webrtc received remote ice candidate`)
          await this._delegate._peerConnection.addIceCandidate(new window.RTCIceCandidate(signal.candidate))
        } catch (error) {
          console.error(error, error.stack)
        }
      },

      clientSdpReply: async (resource, description) => {
        try {
          const signal = JSON.parse(description)
          // console.log(`webrtc received remote sdp answer`)
          await this._delegate._peerConnection.setRemoteDescription(new window.RTCSessionDescription(signal.sdp))
        } catch (error) {
          console.error(error, error.stack)
        }
      },

      clientSdpOffer: async (resource, description) => {
        try {
          const signal = JSON.parse(description)
          // console.log(`webrtc received remote sdp offer`)
          await this._delegate._peerConnection.setRemoteDescription(new window.RTCSessionDescription(signal.sdp))
          const desc = await this._delegate._peerConnection.createAnswer()
          await this._delegate._peerConnection.setLocalDescription(desc)
          // console.log(`Child ${process.pid} webrtc sending local sdp answer`)
          await this.rtcPeerConnectionResource.serverSdpReply(JSON.stringify({'sdp': this._delegate._peerConnection.localDescription}))
        } catch (error) {
          console.error(error, error.stack)
        }
      }
    }

    // console.log(`webrtc created new peer connection with connection state: ${this._delegate._peerConnection.connectionState}`)
    this._delegate._peerConnection.onconnectionstatechange = () => {
      // console.log(`webrtc peer connection connection state changed to: ${this._delegate._peerConnection.connectionState}`)
    }

    this._delegate._peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        // console.log(`webrtc sending local ice candide`)
        this.rtcPeerConnectionResource.serverIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }
    this._delegate._peerConnection.onnegotiationneeded = () => {
      // console.log(`webrtc negotiation needed`)
      this._sendOffer()
    }

    // this._sendOffer()
    this._peerConnectionResolve(this._delegate._peerConnection)
  }

  /**
   * @return {Promise<void>}
   * @private
   */
  async _sendOffer () {
    try {
      const desc = await this._delegate._peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
        voiceActivityDetection: false,
        iceRestart: false
      })
      await this._delegate._peerConnection.setLocalDescription(desc)
      // console.log(`webrtc sending local sdp offer`)
      this.rtcPeerConnectionResource.serverSdpOffer(JSON.stringify({'sdp': this._delegate._peerConnection.localDescription}))
    } catch (error) {
      console.error(error, error.stack)
    }
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

  /**
   * @param {!RtcPeerConnection} resource
   * @param {!string}description
   */
  clientIceCandidates (resource, description) {
    this._delegate.clientIceCandidates(resource, description)
  }

  /**
   * @param {!RtcPeerConnection} resource
   * @param {!string}description
   */
  clientSdpReply (resource, description) {
    this._delegate.clientSdpReply(resource, description)
  }

  /**
   * @param {!RtcPeerConnection} resource
   * @param {!string}description
   */
  clientSdpOffer (resource, description) {
    this._delegate.clientSdpOffer(resource, description)
  }
}
