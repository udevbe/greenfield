'use strict'

import EncodedFrame from './EncodedFrame'

export default class BufferStream {
  /**
   * @returns {!BufferStream}
   */
  static create () {
    return new BufferStream()
  }

  /**
   * Instead use BufferStream.create()
   *
   * @private
   */
  constructor () {
    /**
     * @type {!Object.<number, {completionPromise: Promise<EncodedFrame>, completionResolve: function(EncodedFrame):void, completionReject: function(Error):void, state: string, encodedFrame: EncodedFrame}>}
     * @private
     */
    this._bufferStates = {}
    /**
     * @type {!Object.<number, {chunks: Array<ArrayBuffer>, received: number, totalSize: number}>}
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
    const bufferState = this._bufferStates[serial]
    bufferState.state = 'complete'
    bufferState.completionPromise.then(() => {
      delete this._bufferStates[serial]
    })
    bufferState.completionResolve(encodedFrame)
  }

  /**
   * @param {!number}syncSerial
   * @return {!{completionPromise: Promise<EncodedFrame>, completionResolve: Function, completionReject: Function, state: string, encodedFrame: (EncodedFrame|null)}}
   * @private
   */
  _newBufferState (syncSerial) {
    /**
     * @type {{completionPromise: Promise<EncodedFrame>, completionResolve: function(EncodedFrame):void, completionReject: function(Error):void, state: string, encodedFrame: EncodedFrame|null}}
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
   * @param {!number} serial Serial of the send buffer contents
   * @returns {!Promise<EncodedFrame>}
   */
  onFrameAvailable (serial) {
    if (this._bufferStates[serial] && this._bufferStates[serial].encodedFrame) {
      // state already exists, this means the contents arrived before this call, which means we can now decode it
      this._onComplete(serial, this._bufferStates[serial].encodedFrame)
    } else {
      // state does not exist yet, create a new state and wait for contents to arrive
      this._newBufferState(serial)
    }

    return this._bufferStates[serial].completionPromise
  }

  /**
   * @param {!EncodedFrame}encodedFrame
   * @private
   */
  _checkBufferState (encodedFrame) {
    if (this._bufferStates[encodedFrame.serial]) {
      // state already exists, this means the syn call arrived before this call, which means we can now decode it
      this._bufferStates[encodedFrame.serial].encodedFrame = encodedFrame
      this._onComplete(encodedFrame.serial, encodedFrame)
    } else {
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
   * @param {!ArrayBuffer}chunk
   */
  onChunk (chunk) {
    try {
      const encodedFrameBuffer = this._checkChunk(chunk)
      if (encodedFrameBuffer) {
        const encodedFrame = EncodedFrame.create(encodedFrameBuffer)
        // TODO send ack event here
        this._checkBufferState(encodedFrame)
      } // else we haven't received the full frame yet.
    } catch (e) {
      // TODO better error handling
      console.error(e)
    }
  }
}
