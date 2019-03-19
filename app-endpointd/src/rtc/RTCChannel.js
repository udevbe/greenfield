'use strict'

const Channel = require('../Channel')

/**
 * @implements Channel
 */
class RTCChannel extends Channel {
  /**
   * @param {RTCPeerConnection}peerConnection
   * @return {RTCChannel}
   */
  static create (peerConnection) {
    const dataChannel = peerConnection.createDataChannel('client-connection', { ordered: true })
    dataChannel.binaryType = 'arraybuffer'
    return new RTCChannel(dataChannel)
  }

  /**
   * @param {RTCDataChannel}dataChannel
   * @return {RTCChannel}
   */
  static wrap (dataChannel) {
    return new RTCChannel(dataChannel)
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

module.exports = RTCChannel
