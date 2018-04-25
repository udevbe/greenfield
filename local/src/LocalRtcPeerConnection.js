'use strict'

const crypto = require('crypto')
const webRTC = require('wrtc')

const LocalRtcBlobTransfer = require('./LocalRtcBlobTransfer')

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
    /**
     * @type {wfs.RtcPeerConnection}
     */
    this.proxy = rtcPeerConnectionProxy
    /**
     * @type {number}
     * @private
     */
    this._nextDataChannelId = 0
    /**
     * @type {RTCPeerConnection}
     * @private
     */
    this._peerConnection = new webRTC.RTCPeerConnection(
      {
        'iceServers': [
          {
            'urls': 'turn:badger.pfoe.be?transport=tls',
            'username': 'greenfield',
            'credential': 'water'
          },
          {
            'urls': 'stun:stun.l.google.com:19302'
          }
        ]
      }
    )
    console.log(`Child ${process.pid} webrtc created new peer connection with connection state: ${this._peerConnection.connectionState}`)
    this._peerConnection.onconnectionstatechange = () => {
      console.log(`Child ${process.pid} webrtc peer connection connection state changed to: ${this._peerConnection.connectionState}`)
    }

    this._peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        console.log(`Child ${process.pid} webrtc sending local ice candide`)
        this.proxy.clientIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }
  }

  _getNextDataChannelId () {
    return ++this._nextDataChannelId
  }

  _createDescriptorObject (reliable, binaryType) {
    const dataChannelId = this._getNextDataChannelId()
    // descriptor object somewhat corresponds to rtc data channel config dictionary
    return {
      negotiated: true,
      maxRetransmits: reliable ? null : 0,
      id: dataChannelId,
      ordered: reliable,
      label: this._uuidv4(),
      binaryType: binaryType
    }
  }

  _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  /**
   * Create a new blob transfer from a blob descriptor. Blob descriptors are generally received from the browser
   * and not created locally.
   *
   * @param {string}blobDescriptor
   * @return {LocalRtcBlobTransfer}
   */
  createBlobTransferFromDescriptor (blobDescriptor) {
    const descriptorObj = JSON.parse(blobDescriptor)
    if (descriptorObj.id === -1) {
      descriptorObj.id = this._getNextDataChannelId()
    }
    const blobTransferProxy = this.proxy.createBlobTransfer(JSON.stringify(descriptorObj))
    return LocalRtcBlobTransfer.create(blobTransferProxy, descriptorObj, this)
  }

  /**
   * Create a new blob transfer.
   * @param reliable
   * @param {string}binaryType data type of the content ('string', 'arraybuffer', 'blob')
   * @return {LocalRtcBlobTransfer}
   */
  createBlobTransfer (reliable, binaryType) {
    const dataChannelInitDict = this._createDescriptorObject(reliable, binaryType)
    return this.createBlobTransferFromDescriptor(JSON.stringify(dataChannelInitDict))
  }

  /**
   * Notifies the client that it should start initializing this peer connection. After initialization,
   * this rtc peer connection can be connected with any other rtc peer connection. It's an error to
   * initialize an already initialized peer connection.
   *
   * @since 1
   *
   */
  init () {
    this._setLocalDescription()
  }

  async _setLocalDescription () {
    try {
      const desc = await this._peerConnection.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: false,
        voiceActivityDetection: false,
        iceRestart: false
      })
      console.log(`Child ${process.pid} webrtc set local sdp offer`)
      await this._peerConnection.setLocalDescription(desc)
    } catch (error) {
      console.trace(error)
    }
  }

  /**
   *
   * @param {string} description
   *
   * @since 1
   *
   */
  async serverSdpReply (description) {
    try {
      const signal = JSON.parse(description)
      console.log(`Child ${process.pid} webrtc received remote sdp answer`)
      await this._peerConnection.setRemoteDescription(new webRTC.RTCSessionDescription(signal.sdp))
    } catch (error) {
      console.trace(error)
    }
  }

  /**
   *
   * @param {string} description
   *
   * @since 1
   *
   */
  async serverSdpOffer (description) {
    try {
      const signal = JSON.parse(description)
      console.log(`Child ${process.pid} webrtc received remote sdp offer`)
      await this._peerConnection.setRemoteDescription(new webRTC.RTCSessionDescription(signal.sdp))
      const desc = await this._peerConnection.createAnswer()
      await this._peerConnection.setLocalDescription(desc)
      console.log(`Child ${process.pid} webrtc sending local sdp`)
      this.proxy.clientSdpReply(JSON.stringify({'sdp': this._peerConnection.localDescription}))
    } catch (error) {
      console.trace(error)
    }
  }

  /**
   *
   * @param {string} description
   *
   * @since 1
   *
   */
  async serverIceCandidates (description) {
    try {
      const signal = JSON.parse(description)
      console.log(`Child ${process.pid} webrtc received remote ice candidate`)
      await this._peerConnection.addIceCandidate(new webRTC.RTCIceCandidate(signal.candidate))
    } catch (error) {
      console.trace(error)
    }
  }
}
