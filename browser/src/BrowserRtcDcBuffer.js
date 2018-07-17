'use strict'

import BrowserEncodedFrame from './BrowserEncodedFrame'

export default class BrowserRtcDcBuffer {
  /**
   *
   * @param {GrBuffer} grBufferResource
   * @param {RtcDcBuffer} rtcDcBufferResource
   * @param {GrBlobTransfer} blobTransferResource
   * @returns {BrowserRtcDcBuffer}
   */
  static create (grBufferResource, rtcDcBufferResource, blobTransferResource) {
    const browserRtcDcBuffer = new BrowserRtcDcBuffer(rtcDcBufferResource, blobTransferResource)

    rtcDcBufferResource.implementation = browserRtcDcBuffer
    grBufferResource.implementation.browserRtcDcBuffer = browserRtcDcBuffer

    blobTransferResource.implementation.open().then((dataChannel) => {
      dataChannel.onmessage = browserRtcDcBuffer._onMessage.bind(browserRtcDcBuffer)
      dataChannel.onerror = browserRtcDcBuffer._onError.bind(browserRtcDcBuffer)
    })

    return browserRtcDcBuffer
  }

  /**
   * Instead use BrowserRtcDcBuffer.create(..)
   *
   * @private
   * @param {RtcDcBuffer} rtcDcBufferResource
   * @param {GrBlobTransfer} blobTransferResource
   */
  constructor (rtcDcBufferResource, blobTransferResource) {
    /**
     * @type {RtcDcBuffer}
     */
    this.resource = rtcDcBufferResource
    /**
     * @type {GrBlobTransfer}
     * @private
     */
    this._blobTransferResource = blobTransferResource
    /**
     * @type {number}
     * @private
     */
    this._syncSerial = 0
    /**
     * @type {number}
     * @private
     */
    this._lastCompleteSerial = 0

    this._bufferStates = {} // map like object, keys are numbers, values are {completionPromise: Promise, completionResolve: function, completionReject: function, state: string, browserEncodedFrame: BrowserEncodedFrame}
    this._bufferChunks = {} // map like object, keys are numbers, values are {completionPromise: Promise, completionResolve: function, completionReject: function, state: string, browserEncodedFrame: BrowserEncodedFrame}
  }

  /**
   * @param {number}serial
   * @param {BrowserEncodedFrame}browserEncodedFrame
   * @private
   */
  _onComplete (serial, browserEncodedFrame) {
    if (serial < this._lastCompleteSerial) {
      return
    }
    const bufferState = this._bufferStates[serial]
    bufferState.state = 'complete'
    this._lastCompleteSerial = serial

    // remove old states
    for (const oldSerial in this._bufferStates) {
      if (oldSerial < serial) {
        if (this._bufferStates[serial].state !== 'complete') {
          this._bufferStates[oldSerial].completionReject(new Error('Buffer contents expired ' + oldSerial))
        }
        delete this._bufferStates[oldSerial]
      }
    }

    bufferState.completionResolve(browserEncodedFrame)
  }

  _newBufferState (syncSerial) {
    /**
     * @type {{completionPromise: Promise<BrowserEncodedFrame>, completionResolve: function, completionReject: function, state: string, browserEncodedFrame: BrowserEncodedFrame|null}}
     */
    const bufferState = {
      completionPromise: null,
      completionResolve: null,
      completionReject: null,
      state: 'pending', // or 'pending_alpha' or 'pending_opaque' or 'complete'
      browserEncodedFrame: null
    }
    bufferState.completionPromise = new Promise((resolve, reject) => {
      bufferState.completionResolve = resolve
      bufferState.completionReject = reject
    })
    this._bufferStates[syncSerial] = bufferState
    return bufferState
  }

  /**
   * Returns a promise that will resolve as soon as the buffer is in the 'complete' state.
   * @returns {Promise<BrowserEncodedFrame>}
   */
  whenComplete () {
    const bufferState = this._bufferStates[this._syncSerial]
    return bufferState.completionPromise
  }

  /**
   *
   * @param {wfs.RtcDcBuffer} resource
   * @param {Number} serial Serial of the send buffer contents
   * @since 1
   *
   */
  async syn (resource, serial) {
    if (serial < this._syncSerial) {
      // TODO return an error to the client
      throw new Error('Buffer sync serial was not sequential.')
    }
    this._syncSerial = serial

    if (this._bufferStates[serial] && this._bufferStates[serial].browserEncodedFrame) {
      // state already exists, this means the contents arrived before this call, which means we can now decode it
      this._onComplete(serial, this._bufferStates[serial].browserEncodedFrame)
    } else {
      // state does not exist yet, create a new state and wait for contents to arrive
      this._newBufferState(serial)
    }
  }

  /**
   * @param {BrowserEncodedFrame}browserEncodedFrame
   * @private
   */
  async _checkBufferState (browserEncodedFrame) {
    if (this._bufferStates[browserEncodedFrame.serial]) {
      // state already exists, this means the syn call arrived before this call, which means we can now decode it
      this._bufferStates[browserEncodedFrame.serial].browserEncodedFrame = browserEncodedFrame
      this._onComplete(browserEncodedFrame.serial, browserEncodedFrame)
    } else if (browserEncodedFrame.serial >= this._lastCompleteSerial) {
      // state does not exist yet, create a new state and wait for contents to arrive
      this._newBufferState(browserEncodedFrame.serial).browserEncodedFrame = browserEncodedFrame
    }
  }

  /**
   *
   * @param {ArrayBuffer}chunk
   * @returns {ArrayBuffer}
   * @private
   */
  _checkChunk (chunk) {
    // TODO in case of jpeg we could send individual chunks that we can decode immediately as jpeg operates on 8x8 blocks.

    // parse chunk header
    const headerSize = 12
    const chunkHeader = new DataView(chunk, 0, headerSize)
    const synSerial = chunkHeader.getUint32(0, false)
    const nroChunks = chunkHeader.getUint32(4, false)
    const chunkIdx = chunkHeader.getUint32(8, false)

    // assign chunk to an aggregating data structure
    let bufferChunk = this._bufferChunks[synSerial]
    if (!bufferChunk) {
      bufferChunk = {
        chunks: new Array(nroChunks),
        received: 0,
        totalSize: 0
      }
      this._bufferChunks[synSerial] = bufferChunk
    }
    const headerlessChunk = chunk.slice(headerSize)

    if (bufferChunk.chunks[chunkIdx]) {
      // chunk already received, we're probably dealing with a resend
      return null
    }
    bufferChunk.chunks[chunkIdx] = headerlessChunk
    bufferChunk.received++
    bufferChunk.totalSize += headerlessChunk.byteLength

    // check if we have all required chunks & reconstruct frame buffer if so.
    const chunkSize = 16 * (1024 - 12)
    if (bufferChunk.received === nroChunks) {
      const bufferContents = new Uint8Array(bufferChunk.totalSize)
      bufferChunk.chunks.forEach((chunk, idx) => {
        bufferContents.set(new Uint8Array(chunk), idx * chunkSize)
      })
      delete this._bufferChunks[synSerial]
      return bufferContents.buffer
    } else {
      return null
    }
  }

  /**
   * @param {MessageEvent}event
   * @private
   */
  async _onMessage (event) {
    const arrayBuffer = this._checkChunk(event.data)
    if (arrayBuffer) {
      const browserEncodedFrame = BrowserEncodedFrame.create(arrayBuffer)
      if (this.resource) {
        this.resource.ack(browserEncodedFrame.serial)
      }
      await this._checkBufferState(browserEncodedFrame)
    } // else we haven't received the full frame yet.
  }

  _onError (event) {}

  destroy () {
    this._blobTransferResource.release()
    this.resource = null
  }
}
