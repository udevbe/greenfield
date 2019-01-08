'use strict'

const CommunicationChannel = require('../CommunicationChannel')

/**
 * @implements CommunicationChannel
 */
class RTCCommunicationChannel extends CommunicationChannel {
  /**
   * @param {RTCPeerConnection}peerConnection
   * @param {string}label
   * @return {RTCCommunicationChannel}
   */
  static create (peerConnection, label) {
    const dataChannel = peerConnection.createDataChannel(label, { ordered: true })
    dataChannel.binaryType = 'arraybuffer'
    return new RTCCommunicationChannel(dataChannel)
  }

  /**
   * @param {RTCDataChannel}dataChannel
   */
  constructor (dataChannel) {
    super()
    /**
     * @type {RTCDataChannel}
     */
    this._dataChannel = dataChannel
  }

  close () {
    this._dataChannel.close()
  }

  send (arrayBuffer) {
    this._dataChannel.send(arrayBuffer)
  }

  set onclose (onCloseEventHandler) {
    this._dataChannel.onclose = onCloseEventHandler
  }

  set onerror (onErrorEventHandler) {
    this._dataChannel.onerror = onErrorEventHandler
  }

  set onmessage (onMessageEventHandler) {
    this._dataChannel.onmessage = onMessageEventHandler
  }

  set onopen (onOpenEventHandler) {
    this._dataChannel.onopen = onOpenEventHandler
  }

  get readyState () {
    return this._dataChannel.readyState
  }
}

module.exports = RTCCommunicationChannel
