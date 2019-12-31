// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import EncodedFrame from './EncodedFrame'

export default class BufferStream {
  /**
   * @param {WlBufferResource}wlBufferResource
   * @returns {!BufferStream}
   */
  static create (wlBufferResource) {
    const bufferStream = new BufferStream()
    // TODO we probably want to trigger a custom timeout error here.
    wlBufferResource.onDestroy().then(() => {
      Object.entries(bufferStream._bufferStates).forEach(([serial, bufferState]) => {
        bufferStream._onComplete(serial, null)
      })
    })
    return bufferStream
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
    bufferState.completionPromise.then(() => delete this._bufferStates[serial])
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

    // TODO we probably want to trigger a custom timeout error here if contents take too long to arrive.
    return this._bufferStates[serial].completionPromise
  }

  /**
   * @param {Uint8Array}bufferContents
   */
  onBufferContents (bufferContents) {
    try {
      const encodedFrame = EncodedFrame.create(bufferContents)
      if (this._bufferStates[encodedFrame.serial]) {
        // state already exists, this means the syn call arrived before this call, which means we can now decode it
        this._bufferStates[encodedFrame.serial].encodedFrame = encodedFrame
        this._onComplete(encodedFrame.serial, encodedFrame)
      } else {
        // state does not exist yet, create a new state and wait for contents to arrive
        this._newBufferState(encodedFrame.serial).encodedFrame = encodedFrame
      }
    } catch (e) {
      // TODO better error handling
      console.error(e)
    }
  }

  destroy () {
    Object.values(this._bufferStates).forEach(bufferState => bufferState.completionResolve(null))
  }
}
