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
  encodedFrameFuture?: {
    promise: Promise<EncodedFrame | undefined>
    resolve: (value: PromiseLike<EncodedFrame | undefined> | EncodedFrame | undefined) => void
    reject: (reason?: Error) => void
  }
  encodedFrame?: EncodedFrame
}

const eagerBufferContents: Record<string, Uint8Array[]> = {}

export function deliverContentToBufferStream(client: Client, messageData: ArrayBuffer) {
  const bufferContentsDataView = new DataView(messageData)
  const bufferId = bufferContentsDataView.getUint32(0, true)
  const bufferCreationSerial = bufferContentsDataView.getUint32(4, true)
  const bufferContentSerial = bufferContentsDataView.getUint32(8, true)
  // console.log(`received content ${bufferContentSerial}`)
  const wlBufferResource = client.connection.wlObjects[bufferId] as WlBufferResource | undefined
  const streamingBuffer = wlBufferResource?.implementation as StreamingBuffer | undefined

  const currentBufferCreationSerial = streamingBuffer?.bufferStream.creationSerial

  if (streamingBuffer && currentBufferCreationSerial === bufferCreationSerial) {
    // console.log(`Found matching buffer for content ${bufferContentSerial}`)
    const bufferContent = new Uint8Array(messageData, 8)
    streamingBuffer.bufferStream.onBufferContents(bufferContent)
    return
  } else if (currentBufferCreationSerial && currentBufferCreationSerial > bufferCreationSerial) {
    // console.log(`Ignoring. Matching buffer too new for content ${bufferContentSerial}`)
    // contents arrived too late
    return
  } else if (
    currentBufferCreationSerial === undefined ||
    (currentBufferCreationSerial && currentBufferCreationSerial < bufferCreationSerial)
  ) {
    // console.log(`No matching buffer for content ${bufferContentSerial}, storing for future buffer.`)
    // contents arrived too soon, store for future buffer with same id
    const bufferContent = new Uint8Array(messageData, 8)
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

export class BufferStream {
  constructor(
    public readonly creationSerial: number,
    private readonly bufferContentStates: Record<number, BufferState> = {},
  ) {}

  static create(wlBufferResource: WlBufferResource, creationSerial: number): BufferStream {
    const bufferStream = new BufferStream(creationSerial)
    wlBufferResource.addDestroyListener(() => bufferStream.destroy())
    const bufferContentsKey = `${wlBufferResource.id}:${creationSerial}`
    const bufferContents = eagerBufferContents[bufferContentsKey]
    if (bufferContents) {
      // console.log(`Found previous contents for buffer: ${wlBufferResource.id} with content ${creationSerial}`)
      bufferContents.forEach((bufferContent) => bufferStream.onBufferContents(bufferContent))
      delete eagerBufferContents[bufferContentsKey]
    }
    // TODO delete older contents without a buffer
    return bufferStream
  }

  private newBufferContentState(contentSerial: number): BufferState {
    // console.log(`Creating new buffer state for content ${contentSerial}`)
    const bufferState: BufferState = {}
    this.bufferContentStates[contentSerial] = bufferState
    return bufferState
  }

  /**
   * Returns a promise that will resolve as soon as the buffer is in the 'complete' state.
   */
  onFrameAvailable(bufferContentSerial: number): Promise<EncodedFrame | undefined> | EncodedFrame | undefined {
    let bufferState = this.bufferContentStates[bufferContentSerial]
    if (bufferState === undefined) {
      bufferState = this.newBufferContentState(bufferContentSerial)
    }

    if (bufferState.encodedFrame) {
      // console.log(`Found buffer content ${bufferContentSerial}`)
      delete this.bufferContentStates[bufferContentSerial]
      return bufferState.encodedFrame
    } else if (bufferState.encodedFrameFuture) {
      return bufferState.encodedFrameFuture.promise
    } else {
      // console.log(`Waiting on buffer content ${bufferContentSerial}`)
      const partialEncodedFrameFuture: Partial<BufferState['encodedFrameFuture']> = {}
      partialEncodedFrameFuture.promise = new Promise<EncodedFrame | undefined>((resolve, reject) => {
        partialEncodedFrameFuture.resolve = resolve
        partialEncodedFrameFuture.reject = reject
      })
      // @ts-ignore
      bufferState.encodedFrameFuture = partialEncodedFrameFuture
      // @ts-ignore
      return bufferState.encodedFrameFuture.promise
    }
  }

  onBufferContents(bufferContents: Uint8Array): void {
    try {
      const encodedFrame = createEncodedFrame(bufferContents)
      // console.log(`Creating encoded buffer content: ${encodedFrame.contentSerial}`)
      let bufferState = this.bufferContentStates[encodedFrame.contentSerial]
      if (bufferState === undefined) {
        bufferState = this.newBufferContentState(encodedFrame.contentSerial)
      }
      bufferState.encodedFrame = encodedFrame
      if (bufferState.encodedFrameFuture) {
        delete this.bufferContentStates[encodedFrame.contentSerial]
        bufferState.encodedFrameFuture.resolve(bufferState.encodedFrame)
      }
    } catch (e) {
      // TODO better error handling & log using session logger
      console.error(e)
    }
  }

  destroy(): void {
    Object.values(this.bufferContentStates).forEach((bufferState) => {
      if (bufferState.encodedFrameFuture) {
        bufferState.encodedFrameFuture.resolve(undefined)
      }
    })
  }
}
