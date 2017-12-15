module.exports = class LocalRtcBlobTransfer {
  static create (blobTransferProxy, descriptorObj, localRtcPeerConnection) {
    const localRtcBlobTransfer = new LocalRtcBlobTransfer(blobTransferProxy, descriptorObj, localRtcPeerConnection)
    blobTransferProxy.listener = localRtcBlobTransfer
    return localRtcPeerConnection
  }

  constructor (proxy, descriptorObj, localRtcPeerConnection) {
    this.proxy = proxy
    this._descriptorObj = descriptorObj
    this._localRtcPeerConnection = localRtcPeerConnection
    this._dataChannel = null
    this._dataChannelOpenPromise = new Promise((resolve) => {
      this._dataChannelOpenResolve = resolve
    })
  }

  release () {
    this.proxy.close()
    if (this._dataChannel) {
      this._dataChannel.close()
    }
  }

  /**
   * @return {Promise<RTCDataChannel>}
   */
  open () {
    if (!this._dataChannel) {
      const dataChannelInitDict = Object.assign({}, this._descriptorObj)
      const label = dataChannelInitDict.label
      const binaryType = dataChannelInitDict.binaryType
      delete dataChannelInitDict.label
      delete dataChannelInitDict.binaryType
      this._dataChannel = this._localRtcPeerConnection.peerConnection.createDataChannel(label, dataChannelInitDict)
      this._dataChannel.binaryType = binaryType
      this._dataChannel.onopen = () => {
        this._dataChannelOpenResolve(this._dataChannel)
      }
    }
    return this._dataChannelOpenPromise
  }
}
