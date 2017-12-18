export default class BrowserRtcBlobTransfer {
  static create (resource, blobDescriptor, browserRtcPeerConnection) {
    const descriptorObj = JSON.parse(blobDescriptor)
    const browserRtcBlobTransfer = new BrowserRtcBlobTransfer(resource, descriptorObj, browserRtcPeerConnection)

    browserRtcPeerConnection.peerConnection.addEventListener('close', () => {
      browserRtcBlobTransfer.closeAndSeal()
    })

    resource.implementation = browserRtcBlobTransfer

    const blobTransferEntry = this._blobTransferEntries[descriptorObj.label]
    if (blobTransferEntry) {
      return blobTransferEntry.resolve(browserRtcBlobTransfer)
    }

    return browserRtcBlobTransfer
  }

  static _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  static get (blobDescriptor) {
    const descriptorObj = JSON.parse(blobDescriptor)
    const blobTransferEntry = this._blobTransferEntries[descriptorObj.label]
    if (blobTransferEntry) {
      return blobTransferEntry.promise
    } else {
      return null
    }
  }

  static createDescriptor (reliable) {
    const label = this._uuidv4()
    const blobTransferEntry = {
      promise: null,
      resolve: null
    }
    blobTransferEntry.promise = new Promise((resolve) => {
      blobTransferEntry.resolve = resolve
    })
    this._blobTransferEntries[label] = blobTransferEntry

    // descriptor object somewhat corresponds to rtc data channel config dictionary
    return JSON.stringify({
      negotiated: true,
      maxRetransmits: reliable ? null : 0,
      id: -1,
      ordered: reliable,
      label: label,
      binaryType: 'arraybuffer'
    })
  }

  constructor (resource, descriptorObj, browserRtcPeerConnection) {
    this.resource = resource
    this._descriptorObj = descriptorObj
    this.browserRtcPeerConnection = browserRtcPeerConnection
    this._dataChannel = null
    this._dataChannelOpenPromise = new Promise((resolve) => {
      this._dataChannelOpenResolve = resolve
    })
  }

  /**
   * @return {Promise<RTCDataChannel>}
   */
  open () {
    if (!this._dataChannelOpenPromise) {
      throw new Error('Blob transfer is closed and sealed.')
    }

    if (!this._dataChannel) {
      const dataChannelInitDict = Object.assign({}, this._descriptorObj)
      const label = dataChannelInitDict.label
      const binaryType = dataChannelInitDict.binaryType
      delete dataChannelInitDict.label
      delete dataChannelInitDict.binaryType
      this._dataChannel = this.browserRtcPeerConnection.peerConnection.createDataChannel(label, dataChannelInitDict)
      this._dataChannel.binaryType = binaryType
      this._dataChannel.onopen = () => {
        this._dataChannelOpenResolve(this._dataChannel)
      }
    }
    return this._dataChannelOpenPromise
  }

  _close () {
    if (this._dataChannel) {
      this._dataChannel.close()
      this._dataChannel = null
      this._dataChannelOpenPromise = null
      this._dataChannelOpenResolve = null
    }
  }

  closeAndSeal () {
    if (this._dataChannel) {
      this.resource.release()
      this._close()
    }
  }

  close (resource) {
    this._close()
  }
}
BrowserRtcBlobTransfer._blobTransferEntries = {}
