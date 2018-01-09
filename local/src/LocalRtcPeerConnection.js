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
    this.proxy = rtcPeerConnectionProxy
    this._nextDataChannelId = 0

    this._peerConnection = new webRTC.RTCPeerConnection()
    this._peerConnection.onicecandidate = (evt) => {
      if (evt.candidate !== null) {
        this.proxy.clientIceCandidates(JSON.stringify({'candidate': evt.candidate}))
      }
    }
    this._peerConnection.onnegotiationneeded = () => {
      this._sendOffer()
    }
  }

  _getNextDataChannelId () {
    return ++this._nextDataChannelId
  }

  _createDescriptorObject (reliable) {
    const dataChannelId = this._getNextDataChannelId()
    // descriptor object somewhat corresponds to rtc data channel config dictionary
    return {
      negotiated: true,
      maxRetransmits: reliable ? null : 0,
      id: dataChannelId,
      ordered: reliable,
      label: this._uuidv4(),
      binaryType: 'arraybuffer'
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
   * @return {LocalRtcBlobTransfer}
   */
  createBlobTransfer (reliable) {
    const dataChannelInitDict = this._createDescriptorObject(reliable)
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
    this._sendOffer()
  }

  _sendOffer () {
    this._peerConnection.createOffer({
      offerToReceiveAudio: false,
      offerToReceiveVideo: false,
      voiceActivityDetection: false,
      iceRestart: false
    }).then((desc) => {
      return this._peerConnection.setLocalDescription(desc)
    }).then(() => {
      this.proxy.clientSdpOffer(JSON.stringify({'sdp': this._peerConnection.localDescription}))
    }).catch((error) => {
      console.log(error)
    })
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
    this._peerConnection.setRemoteDescription(new webRTC.RTCSessionDescription(signal.sdp)).catch((error) => {
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

    this._peerConnection.setRemoteDescription(new webRTC.RTCSessionDescription(signal.sdp)).then(() => {
      return this._peerConnection.createAnswer()
    }).then((desc) => {
      return this._peerConnection.setLocalDescription(desc)
    }).then(() => {
      this.proxy.clientSdpReply(JSON.stringify({'sdp': this._peerConnection.localDescription}))
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
    this._peerConnection.addIceCandidate(new webRTC.RTCIceCandidate(signal.candidate)).catch(error => {
      console.log('Error: Failure during addIceCandidate()', error)
      // FIXME handle error state (disconnect?)
    })
  }
}
