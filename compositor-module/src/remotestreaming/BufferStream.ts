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

import { createEncodedFrame, EncodedFrame } from './EncodedFrame'

type BufferState = {
  completionPromise: Promise<EncodedFrame | undefined>
  completionResolve: (value?: EncodedFrame | PromiseLike<EncodedFrame>) => void
  completionReject: (reason?: Error) => void
  state: 'pending' | 'complete' | 'pending_alpha' | 'pending_opaque'
  encodedFrame?: EncodedFrame
}

export default class BufferStream {
  private readonly bufferStates: Record<number, BufferState> = {}

  static create(wlBufferResource: { onDestroy: () => Promise<void> }): BufferStream {
    const bufferStream = new BufferStream()
    // TODO we probably want to trigger a custom timeout error here.
    wlBufferResource.onDestroy().then(() => {
      Object.keys(bufferStream.bufferStates).forEach((serial) => {
        bufferStream.onComplete(Number.parseInt(serial))
      })
    })
    return bufferStream
  }

  private onComplete(serial: number, encodedFrame?: EncodedFrame) {
    const bufferState = this.bufferStates[serial]
    bufferState.state = 'complete'
    bufferState.completionPromise.then(() => delete this.bufferStates[serial])
    bufferState.completionResolve(encodedFrame)
  }

  private newBufferState(syncSerial: number): BufferState {
    const bufferState: BufferState = {
      // @ts-ignore
      completionPromise: null,
      // @ts-ignore
      completionResolve: null,
      // @ts-ignore
      completionReject: null,
      state: 'pending', // or 'pending_alpha' or 'pending_opaque' or 'complete'
      encodedFrame: undefined,
    }
    bufferState.completionPromise = new Promise<EncodedFrame | undefined>((resolve, reject) => {
      bufferState.completionResolve = resolve
      bufferState.completionReject = reject
    })
    this.bufferStates[syncSerial] = bufferState
    return bufferState
  }

  /**
   * Returns a promise that will resolve as soon as the buffer is in the 'complete' state.
   */
  onFrameAvailable(serial: number): Promise<EncodedFrame | undefined> {
    if (this.bufferStates[serial] && this.bufferStates[serial].encodedFrame) {
      // state already exists, contents arrived before this call, decode it
      this.onComplete(serial, this.bufferStates[serial].encodedFrame)
    } else {
      // state does not exist yet, create a new state and wait for contents to arrive
      this.newBufferState(serial)
    }

    // TODO we probably want to trigger a custom timeout error here if contents take too long to arrive.
    return this.bufferStates[serial].completionPromise
  }

  onBufferContents(bufferContents: Uint8Array): void {
    try {
      const encodedFrame = createEncodedFrame(bufferContents)
      console.debug(`Received buffer with serial: ${encodedFrame.serial}`)
      if (this.bufferStates[encodedFrame.serial]) {
        console.debug(`Commit state for buffer with serial: ${encodedFrame.serial} already exists.`)
        this.bufferStates[encodedFrame.serial].encodedFrame = encodedFrame
        this.onComplete(encodedFrame.serial, encodedFrame)
      } else {
        console.debug(`Commit state for buffer with serial: ${encodedFrame.serial} does not exist yet. Creating it.`)
        this.newBufferState(encodedFrame.serial).encodedFrame = encodedFrame
      }
    } catch (e) {
      // TODO better error handling & log using session logger
      console.error(e)
    }
  }

  destroy(): void {
    Object.values(this.bufferStates).forEach((bufferState) => bufferState.completionResolve())
  }
}
