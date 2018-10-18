class LocalRtcBlobTransfer {

  /**
   *
   * @param {GrBlobTransfer}blobTransferProxy
   * @param {{negotiated: boolean, maxRetransmits: null|number, id: number, ordered: boolean, label: string, binaryType: string}}descriptorObj
   * @param {LocalRtcPeerConnection}localRtcPeerConnection
   * @return {LocalRtcBlobTransfer}
   */
  static create (blobTransferProxy, descriptorObj, localRtcPeerConnection) {
    const dataChannelInitDict = Object.assign({}, descriptorObj)
    const label = dataChannelInitDict.label
    const binaryType = dataChannelInitDict.binaryType
    delete dataChannelInitDict.label
    delete dataChannelInitDict.binaryType
    const dataChannel = localRtcPeerConnection._peerConnection.createDataChannel(label, dataChannelInitDict)
    dataChannel.binaryType = binaryType

    const localRtcBlobTransfer = new LocalRtcBlobTransfer(blobTransferProxy, descriptorObj, localRtcPeerConnection, dataChannel)
    blobTransferProxy.listener = localRtcBlobTransfer

    return localRtcBlobTransfer
  }

  /**
   * Use LocalRtcBlobTransfer.create(..)
   * @private
   * @param {GrBlobTransfer}proxy
   * @param descriptorObj
   * @param {LocalRtcPeerConnection}localRtcPeerConnection
   * @param {RTCDataChannel} dataChannel
   */
  constructor (proxy, descriptorObj, localRtcPeerConnection, dataChannel) {
    this.proxy = proxy
    this._descriptorObj = descriptorObj
    this.localRtcPeerConnection = localRtcPeerConnection
    this._dataChannel = dataChannel
    this._dataChannelResolve = null
    this._dataChannelReject = null
    this._dataChannelPromise = null

    this._dataChannelPromise = new Promise((resolve, reject) => {
      this._dataChannelResolve = resolve
      this._dataChannelReject = reject
    })

    if (this._dataChannel.readyState === 'open') {
      this._dataChannelResolve(this._dataChannel)
    } else {
      this._dataChannel.onopen = () => {
        this._dataChannelResolve(this._dataChannel)
      }
    }
  }

  _release () {
    if (this._dataChannel) {
      this.proxy.close()
      this._dataChannel.onopen = () => {}
      this._dataChannel.close()
      this._dataChannel = null
      this._dataChannelPromise = null
      this._dataChannelResolve = null
    }
  }

  /**
   * Notifies the client that this blob transfer object will not be used anymore.
   */
  release () {
    this._release()
  }

  /**
   * Opens this blob transfer so it's data can be read. Once opened, blob transfer data should be read immediately.
   * Multiple calls to open will return the same promise. Opening an already closed blob transfer will return null.
   * @return {Promise<RTCDataChannel>}
   */
  open () {
    return this._dataChannelPromise
  }

  /**
   * Close and seal this blob transfer object. A closed blob transfer can not be opened anymore. Multiple close calls
   * have no effect. Closing a blob transfer that was not opened has no effect.
   */
  closeAndSeal () {
    this._release()
  }
}

module.exports = LocalRtcBlobTransfer
