// Copyright 2020 Erik De Rijcke
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

type BufferState = {
  completionPromise: Promise<EncodedFrame>,
  completionResolve: (value?: EncodedFrame | PromiseLike<EncodedFrame>) => void,
  completionReject: (reason?: any) => void,
  state: 'pending' | 'complete' | 'pending_alpha' | 'pending_opaque',
  encodedFrame?: EncodedFrame
}

export default class BufferStream {
  private readonly _bufferStates: { [key: number]: BufferState } = {}

  static create(wlBufferResource: { onDestroy: () => Promise<any> }): BufferStream {
    const bufferStream = new BufferStream()
    // TODO we probably want to trigger a custom timeout error here.
    wlBufferResource.onDestroy().then(() => {
      Object.entries(bufferStream._bufferStates).forEach(([serial, _]) => {
        bufferStream._onComplete(Number.parseInt(serial))
      })
    })
    return bufferStream
  }

  private _onComplete(serial: number, encodedFrame?: EncodedFrame) {
    const bufferState = this._bufferStates[serial]
    bufferState.state = 'complete'
    bufferState.completionPromise.then(() => delete this._bufferStates[serial])
    bufferState.completionResolve(encodedFrame)
  }

  private _newBufferState(syncSerial: number): BufferState {
    const bufferState: BufferState = {
      // @ts-ignore
      completionPromise: null,
      // @ts-ignore
      completionResolve: null,
      // @ts-ignore
      completionReject: null,
      state: 'pending', // or 'pending_alpha' or 'pending_opaque' or 'complete'
      encodedFrame: undefined
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
   */
  onFrameAvailable(serial: number): Promise<EncodedFrame> {
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

  onBufferContents(bufferContents: Uint8Array) {
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

  destroy() {
    Object.values(this._bufferStates).forEach(bufferState => bufferState.completionResolve())
  }
}
