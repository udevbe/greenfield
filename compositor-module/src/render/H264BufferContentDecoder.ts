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

import { OpaqueAndAlphaPlanes } from '../remotestreaming/DecodedFrame'
import { EncodedFrame } from '../remotestreaming/EncodedFrame'

// @ts-ignore requires a loader that treats this import as a web-worker.
import H264NALDecoderWorker from './H264NALDecoder.worker'

type H264NALDecoderWorkerMessage = {
  type: string
  width: number
  height: number
  data: ArrayBuffer
  renderStateId: number
}
type FrameState = {
  serial: number
  resolve: (value: OpaqueAndAlphaPlanes | PromiseLike<OpaqueAndAlphaPlanes>) => void
  state: 'pending' | 'pending_opaque' | 'pending_alpha' | 'complete'
  result: Partial<OpaqueAndAlphaPlanes>
}

const decoders: { [key: string]: H264BufferContentDecoder } = {}

const opaqueWorker = new Promise<Worker>((resolve) => {
  const h264NALDecoderWorker: Worker = new H264NALDecoderWorker()
  h264NALDecoderWorker.addEventListener('message', (e) => {
    const message = e.data as H264NALDecoderWorkerMessage
    switch (message.type) {
      case 'pictureReady':
        decoders[message.renderStateId]._onOpaquePictureDecoded(message)
        break
      case 'decoderReady':
        resolve(h264NALDecoderWorker)
        break
    }
  })
})

const alphaWorker = new Promise<Worker>((resolve) => {
  const h264NALDecoderWorker: Worker = new H264NALDecoderWorker()
  h264NALDecoderWorker.addEventListener('message', (e) => {
    const message = e.data as H264NALDecoderWorkerMessage
    switch (message.type) {
      case 'pictureReady':
        decoders[message.renderStateId]._onAlphaPictureDecoded(message)
        break
      case 'decoderReady':
        resolve(h264NALDecoderWorker)
        break
    }
  })
})

class H264BufferContentDecoder {
  static create(surfaceH264DecodeId: string): H264BufferContentDecoder {
    const h264BufferContentDecoder = new H264BufferContentDecoder(surfaceH264DecodeId)
    decoders[surfaceH264DecodeId] = h264BufferContentDecoder
    return h264BufferContentDecoder
  }

  private constructor(
    public readonly surfaceH264DecodeId: string,
    private decodingSerialsQueue: number[] = [],
    private decodingAlphaSerialsQueue: number[] = [],
    private readonly frameStates: { [key: number]: FrameState } = {},
  ) {}

  async decode(bufferContents: EncodedFrame): Promise<OpaqueAndAlphaPlanes> {
    return new Promise<OpaqueAndAlphaPlanes>((resolve) => {
      this.frameStates[bufferContents.serial] = {
        serial: bufferContents.serial,
        resolve,
        state: 'pending',
        result: {
          opaque: undefined,
          alpha: undefined,
        },
      }

      this._decodeH264(bufferContents)
    })
  }

  private _decodeH264(encodedFrame: EncodedFrame) {
    const bufferSerial = encodedFrame.serial

    if (encodedFrame.pixelContent.alpha) {
      const h264Nal = encodedFrame.pixelContent.alpha.slice()
      alphaWorker.then((worker) => {
        this.decodingAlphaSerialsQueue = [...this.decodingAlphaSerialsQueue, bufferSerial]
        // create a copy of the arraybuffer so we can zero-copy the opaque part (after zero-copying, we can no longer use the underlying array in any way)
        worker.postMessage(
          {
            type: 'decode',
            data: h264Nal.buffer,
            offset: h264Nal.byteOffset,
            length: h264Nal.byteLength,
            renderStateId: this.surfaceH264DecodeId,
          },
          [h264Nal.buffer],
        )
      })
    } else {
      this.frameStates[bufferSerial].state = 'pending_opaque'
    }

    const h264Nal = encodedFrame.pixelContent.opaque
    opaqueWorker.then((worker) => {
      this.decodingSerialsQueue = [...this.decodingSerialsQueue, bufferSerial]
      worker.postMessage(
        {
          type: 'decode',
          data: h264Nal.buffer,
          offset: h264Nal.byteOffset,
          length: h264Nal.byteLength,
          renderStateId: this.surfaceH264DecodeId,
        },
        [h264Nal.buffer],
      )
    })
  }

  private _onComplete(frameState: FrameState) {
    frameState.state = 'complete'
    delete this.frameStates[frameState.serial]
    const decodeResult = frameState.result
    if (decodeResult.opaque === undefined) {
      throw new Error('BUG. No opaque frame decode result found!')
    }
    frameState.resolve({
      opaque: decodeResult.opaque,
      alpha: decodeResult.alpha,
    })
  }

  _onOpaquePictureDecoded({ width, height, data }: { width: number; height: number; data: ArrayBuffer }): void {
    const buffer = new Uint8Array(data)
    const frameSerial = this.decodingSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onOpaquePictureDecoded.')
    }
    const frameState = this.frameStates[frameSerial]
    frameState.result.opaque = {
      buffer: buffer,
      width: width,
      height: height,
    }

    if (frameState.state === 'pending_opaque') {
      this._onComplete(frameState)
    } else {
      frameState.state = 'pending_alpha'
    }
  }

  _onAlphaPictureDecoded({ width, height, data }: { width: number; height: number; data: ArrayBuffer }): void {
    const buffer = new Uint8Array(data)
    const frameSerial = this.decodingAlphaSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onAlphaPictureDecoded.')
    }
    const frameState = this.frameStates[frameSerial]
    frameState.result.alpha = {
      buffer: buffer,
      width: width,
      height: height,
    }

    if (frameState.state === 'pending_alpha') {
      this._onComplete(frameState)
    } else {
      this.frameStates[frameSerial].state = 'pending_opaque'
    }
  }

  destroy(): void {
    opaqueWorker.then((worker) =>
      worker.postMessage({
        type: 'release',
        renderStateId: this.surfaceH264DecodeId,
      }),
    )
    alphaWorker.then((worker) =>
      worker.postMessage({
        type: 'release',
        renderStateId: this.surfaceH264DecodeId,
      }),
    )
  }
}

export default H264BufferContentDecoder
