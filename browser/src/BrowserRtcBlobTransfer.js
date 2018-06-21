'use strict'

/**
 *
 *            Clients and compositor can send out-of-band data using a blob transfer object. Data is
 *            effectively transferred asynchronous using an implementation specific mechanism. A blob transfer object
 *            acts as a hook into an implementation specific mechanism to send and get the actual blob data.
 *
 */
export default class BrowserRtcBlobTransfer {
  /**
   * Called by the parent rtc peer connection when a client creates a new blob transfer.
   * @private
   * @param {GrBlobTransfer}resource
   * @param {string}blobDescriptor
   * @param {BrowserRtcPeerConnection}browserRtcPeerConnection
   * @return {BrowserRtcBlobTransfer}
   */
  static _create (resource, blobDescriptor, browserRtcPeerConnection) {
    const descriptorObj = JSON.parse(blobDescriptor)
    const browserRtcBlobTransfer = new BrowserRtcBlobTransfer(resource, descriptorObj, browserRtcPeerConnection)
    resource.implementation = browserRtcBlobTransfer

    const blobTransferEntry = this._blobTransferEntries[descriptorObj.label]
    if (blobTransferEntry) {
      blobTransferEntry.resolve(browserRtcBlobTransfer)
    }

    return browserRtcBlobTransfer
  }

  /**
   * @return {string}
   * @private
   */
  static _uuidv4 () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ window.crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  /**
   * Returns a promise that will resolve to a BrowserRtcBlobTransfer as soon as the client has setup their end of the
   * blob transfer using this descriptor.
   * @param {string}blobDescriptor
   * @return {Promise<BrowserRtcBlobTransfer>}
   */
  static get (blobDescriptor) {
    const descriptorObj = JSON.parse(blobDescriptor)
    // entries are created when a descriptor is created through createDescriptor
    const blobTransferEntry = this._blobTransferEntries[descriptorObj.label]
    if (blobTransferEntry) {
      return blobTransferEntry.promise
    } else {
      return null
    }
  }

  /**
   * Create a blob transfer descriptor that can be send to a client. The client in turn can use the descriptor to create
   * the actual blob transfer. After the descriptor is send, the server can use the descriptor to find the matching
   * blob transfer with BrowserRtcBlobTransfer.get(blobDescriptor).
   * @param {boolean}reliable
   * @param {string}binaryType data type of the content ('string', 'arraybuffer', 'blob')
   * @return {string} a blob transfer descriptor
   */
  static createDescriptor (reliable, binaryType) {
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
      id: -1, // the id is filled in by the client
      ordered: reliable, // making the channel ordered initiates it as a tcp connection, thus making it reliable.
      label: label, // not part of rtc data channel config dictionary
      binaryType: binaryType // not part of rtc data channel config dictionary
    })
  }

  /**
   * @private
   * @param {GrBlobTransfer}resource
   * @param {string}descriptorObj
   * @param {BrowserRtcPeerConnection}browserRtcPeerConnection
   */
  constructor (resource, descriptorObj, browserRtcPeerConnection) {
    /**
     * @type {GrBlobTransfer}
     */
    this.resource = resource
    /**
     * @type {string}
     * @private
     */
    this._descriptorObj = descriptorObj
    /**
     * @type {BrowserRtcPeerConnection}
     */
    this.browserRtcPeerConnection = browserRtcPeerConnection
    /**
     * @type {RTCDataChannel}
     * @private
     */
    this._dataChannel = null

    this._dataChannelResolve = null
    this._dataChannelReject = null
    this._dataChannelPromise = new Promise((resolve, reject) => {
      this._dataChannelResolve = resolve
      this._dataChannelReject = reject
    })
    this._peerConnectionPromise = null
  }

  /**
   * Setup this blob transfer so it can begin receiving and sending data. The behavior of the resulting rtc data channel
   * depends on the descriptor that was used to create the blob transfer. Opening the blob transfer multiple times will
   * return the same rtc data channel promise. After a blob transfer is closed, calls to open will return null.
   * @return {Promise<RTCDataChannel>}
   */
  open () {
    if (!this._peerConnectionPromise) {
      this._peerConnectionPromise = this.browserRtcPeerConnection.onPeerConnection()
      this._peerConnectionPromise.then((peerConnection) => {
        const dataChannelInitDict = Object.assign({}, this._descriptorObj)
        const label = dataChannelInitDict.label
        const binaryType = dataChannelInitDict.binaryType
        delete dataChannelInitDict.label
        delete dataChannelInitDict.binaryType
        this._dataChannel = peerConnection.createDataChannel(label, dataChannelInitDict)
        this._dataChannel.binaryType = binaryType
        this._dataChannel.onopen = () => {
          this._dataChannelResolve(this._dataChannel)
        }
      }).catch((error) => {
        this._dataChannelReject(error)
      })
    }

    return this._dataChannelPromise
  }

  /**
   * Close and seal this blob transfer. A closed blob transfer can no longer be opened. Closing a blob transfer that
   * was not opened has no effect. Closing blob transfer multiple times has no effect.
   */
  closeAndSeal () {
    if (this._dataChannelPromise) {
      this._dataChannelPromise = null
    }
    if (this.resource) {
      this.resource.release()
      this.resource = null
    }
    if (this._dataChannel) {
      this._dataChannel.close()
      this._dataChannel = null
    }
  }

  /**
   * @param {GrBlobTransfer}resource
   */
  close (resource) {
    this.closeAndSeal()
  }
}
BrowserRtcBlobTransfer._blobTransferEntries = {}
