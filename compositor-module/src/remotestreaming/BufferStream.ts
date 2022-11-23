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
import { Client, WlBufferResource } from 'westfield-runtime-server'
import { StreamingBuffer } from './StreamingBuffer'

type BufferState = {
  completionPromise: Promise<EncodedFrame | undefined>
  completionResolve: (value?: EncodedFrame | PromiseLike<EncodedFrame>) => void
  completionReject: (reason?: Error) => void
  state: 'pending' | 'complete' | 'pending_alpha' | 'pending_opaque'
  encodedFrame?: EncodedFrame
}

const eagerBufferContents: Record<string, Uint8Array[]> = {}

export function deliverContentToBufferStream(client: Client, messageData: ArrayBuffer) {
  const bufferContentsDataView = new DataView(messageData)
  const bufferId = bufferContentsDataView.getUint32(0, true)
  const bufferCreationSerial = bufferContentsDataView.getUint32(4, true)
  const wlBufferResource = client.connection.wlObjects[bufferId] as WlBufferResource

  if (wlBufferResource) {
    const streamingBuffer = wlBufferResource.implementation as StreamingBuffer
    const bufferContent = new Uint8Array(messageData, 8)
    if (streamingBuffer.bufferStream.creationSerial === bufferCreationSerial) {
      streamingBuffer.bufferStream.onBufferContents(bufferContent)
      return
    } else if (streamingBuffer.bufferStream.creationSerial < bufferCreationSerial) {
      const bufferContentKey = `${bufferId}:${bufferCreationSerial}`
      let bufferContents = eagerBufferContents[bufferContentKey]
      if (bufferContents === undefined) {
        bufferContents = []
        eagerBufferContents[bufferContentKey] = bufferContents
      }
      bufferContents.push(bufferContent)
      return
    }
  }
  // contents arrived too late
}

export class BufferStream {
  constructor(
    public readonly creationSerial: number,
    private readonly bufferStates: Record<number, BufferState> = {},
  ) {}

  static create(wlBufferResource: WlBufferResource, creationSerial: number): BufferStream {
    const bufferStream = new BufferStream(creationSerial)
    // TODO we probably want to trigger a custom timeout error here.
    wlBufferResource.addDestroyListener(() => {
      Object.keys(bufferStream.bufferStates).forEach((serial) => {
        bufferStream.onComplete(Number.parseInt(serial))
      })
    })
    const bufferContents = eagerBufferContents[`${wlBufferResource.id}:${creationSerial}`]
    if (bufferContents) {
      bufferContents.forEach((bufferContent) => bufferStream.onBufferContents(bufferContent))
      delete eagerBufferContents[`${wlBufferResource.id}:${creationSerial}`]
    }
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
      if (this.bufferStates[encodedFrame.serial]) {
        this.bufferStates[encodedFrame.serial].encodedFrame = encodedFrame
        this.onComplete(encodedFrame.serial, encodedFrame)
      } else {
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
