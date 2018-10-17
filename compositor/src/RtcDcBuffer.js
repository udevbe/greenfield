'use strict'

import RtcDcBufferRequests from './protocol/RtcDcBufferRequests'

import EncodedFrame from './EncodedFrame'

/**
 * @implements {RtcDcBufferRequests}
 */
export default class RtcDcBuffer extends RtcDcBufferRequests {
  /**
   *
   * @param {!WlBufferResource} wlBufferResource
   * @param {!RtcDcBufferResource} rtcDcBufferResource
   * @param {!GrBlobTransferResource} grBlobTransferResource
   * @returns {!RtcDcBuffer}
   */
  static create (wlBufferResource, rtcDcBufferResource, grBlobTransferResource) {
    const rtcDcBuffer = new RtcDcBuffer(rtcDcBufferResource, grBlobTransferResource)

    rtcDcBufferResource.implementation = rtcDcBuffer
    wlBufferResource.implementation.rtcDcBuffer = rtcDcBuffer

    const rtcBlobTransfer = /** @type {RtcBlobTransfer} */grBlobTransferResource.implementation
    rtcBlobTransfer.open().then((dataChannel) => {
      dataChannel.onmessage = rtcDcBuffer._onMessage.bind(rtcDcBuffer)
      dataChannel.onerror = rtcDcBuffer._onError.bind(rtcDcBuffer)
    })

    return rtcDcBuffer
  }

  /**
   * Instead use RtcDcBuffer.create(..)
   *
   * @private
   * @param {!RtcDcBufferResource} rtcDcBufferResource
   * @param {!GrBlobTransferResource} blobTransferResource
   */
  constructor (rtcDcBufferResource, blobTransferResource) {
    super()
    /**
     * @type {!RtcDcBufferResource}
     */
    this.resource = rtcDcBufferResource
    /**
     * @type {GrBlobTransferResource}
     * @private
     */
    this._blobTransferResource = blobTransferResource
    /**
     * @type {!number}
     * @private
     */
    this._syncSerial = 0
    /**
     * @type {!number}
     * @private
     */
    this._lastCompleteSerial = 0
    /**
     * @type {!Object.<number,{completionPromise: Promise, completionResolve: function, completionReject: function, state: string, encodedFrame: EncodedFrame}>}
     * @private
     */
    this._bufferStates = {}
    /**
     * @type {!Object.<number,{completionPromise: Promise, completionResolve: function, completionReject: function, state: string, encodedFrame: EncodedFrame}>}
     * @private
     */
    this._bufferChunks = {}
  }

  /**
   * @param {!number}serial
   * @param {!EncodedFrame}encodedFrame
   * @private
   */
  _onComplete (serial, encodedFrame) {
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

    bufferState.completionResolve(encodedFrame)
  }

  /**
   * @param {!number}syncSerial
   * @return {!{completionPromise: Promise<EncodedFrame>, completionResolve: Function, completionReject: Function, state: string, encodedFrame: (EncodedFrame|null)}}
   * @private
   */
  _newBufferState (syncSerial) {
    /**
     * @type {{completionPromise: Promise<EncodedFrame>, completionResolve: function, completionReject: function, state: string, encodedFrame: EncodedFrame|null}}
     */
    const bufferState = {
      completionPromise: null,
      completionResolve: null,
      completionReject: null,
      state: 'pending', // or 'pending_alpha' or 'pending_opaque' or 'complete'
      encodedFrame: null
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
   * @returns {!Promise<EncodedFrame>}
   */
  whenComplete () {
    const bufferState = this._bufferStates[this._syncSerial]
    return bufferState.completionPromise
  }

  /**
   *
   * @param {!RtcDcBufferResource} resource
   * @param {!number} serial Serial of the send buffer contents
   * @since 1
   *
   */
  async syn (resource, serial) {
    if (serial < this._syncSerial) {
      // TODO return an error to the client
      throw new Error('Buffer sync serial was not sequential.')
    }
    this._syncSerial = serial

    if (this._bufferStates[serial] && this._bufferStates[serial].encodedFrame) {
      // state already exists, this means the contents arrived before this call, which means we can now decode it
      this._onComplete(serial, this._bufferStates[serial].encodedFrame)
    } else {
      // state does not exist yet, create a new state and wait for contents to arrive
      this._newBufferState(serial)
    }
  }

  /**
   * @param {!EncodedFrame}encodedFrame
   * @private
   */
  async _checkBufferState (encodedFrame) {
    if (this._bufferStates[encodedFrame.serial]) {
      // state already exists, this means the syn call arrived before this call, which means we can now decode it
      this._bufferStates[encodedFrame.serial].encodedFrame = encodedFrame
      this._onComplete(encodedFrame.serial, encodedFrame)
    } else if (encodedFrame.serial >= this._lastCompleteSerial) {
      // state does not exist yet, create a new state and wait for contents to arrive
      this._newBufferState(encodedFrame.serial).encodedFrame = encodedFrame
    }
  }

  /**
   *
   * @param {!ArrayBuffer}chunk
   * @returns {?ArrayBuffer}
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
   * @param {!MessageEvent}event
   * @private
   */
  async _onMessage (event) {
    try {
      const arrayBuffer = this._checkChunk(event.data)
      if (arrayBuffer) {
        const encodedFrame = EncodedFrame.create(arrayBuffer)
        if (this.resource) {
          this.resource.ack(encodedFrame.serial)
        }
        await this._checkBufferState(encodedFrame)
      } // else we haven't received the full frame yet.
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @param event
   * @private
   */
  _onError (event) {}

  destroy () {
    this._blobTransferResource.release()
    this.resource = null
  }
}
