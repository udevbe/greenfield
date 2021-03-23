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
import EncodedFrame from '../remotestreaming/EncodedFrame'
import { fullFrame, splitAlpha } from '../remotestreaming/EncodingOptions'

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
    const message =
      /** @type {{type:string, width:number, height:number, data:ArrayBuffer, renderStateId:number}} */ e.data
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
  readonly surfaceH264DecodeId: string
  private _decodingSerialsQueue: number[]
  private _decodingAlphaSerialsQueue: number[]
  private readonly _frameStates: { [key: number]: FrameState }

  static create(surfaceH264DecodeId: string): H264BufferContentDecoder {
    const h264BufferContentDecoder = new H264BufferContentDecoder(surfaceH264DecodeId)
    decoders[surfaceH264DecodeId] = h264BufferContentDecoder
    return h264BufferContentDecoder
  }

  private constructor(surfaceH264DecodeId: string) {
    this.surfaceH264DecodeId = surfaceH264DecodeId
    this._decodingSerialsQueue = []
    this._decodingAlphaSerialsQueue = []
    this._frameStates = {}
  }

  async decode(bufferContents: EncodedFrame): Promise<OpaqueAndAlphaPlanes> {
    return new Promise<OpaqueAndAlphaPlanes>((resolve) => {
      this._frameStates[bufferContents.serial] = {
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
    const isFullFrame = fullFrame(encodedFrame.encodingOptions)
    if (!isFullFrame) {
      throw new Error('h264 encoded buffers must contain the full frame.')
    }
    const hasAlpha = splitAlpha(encodedFrame.encodingOptions)

    if (hasAlpha) {
      const alphaPixelContent = encodedFrame.pixelContent[0].alpha
      const h264Nal = alphaPixelContent.slice()
      alphaWorker.then((worker) => {
        this._decodingAlphaSerialsQueue = [...this._decodingAlphaSerialsQueue, bufferSerial]
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
      this._frameStates[bufferSerial].state = 'pending_opaque'
    }

    const h264Nal = encodedFrame.pixelContent[0].opaque
    opaqueWorker.then((worker) => {
      this._decodingSerialsQueue = [...this._decodingSerialsQueue, bufferSerial]
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
    delete this._frameStates[frameState.serial]
    const decodeResult = frameState.result
    if (decodeResult.opaque === undefined) {
      throw new Error('BUG. No opaque frame decode result found!')
    }
    frameState.resolve({
      opaque: decodeResult.opaque,
      alpha: decodeResult.alpha,
    })
  }

  _onOpaquePictureDecoded({ width, height, data }: { width: number; height: number; data: ArrayBuffer }) {
    const buffer = new Uint8Array(data)
    const frameSerial = this._decodingSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onOpaquePictureDecoded.')
    }
    const frameState = this._frameStates[frameSerial]
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

  _onAlphaPictureDecoded({ width, height, data }: { width: number; height: number; data: ArrayBuffer }) {
    const buffer = new Uint8Array(data)
    const frameSerial = this._decodingAlphaSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onAlphaPictureDecoded.')
    }
    const frameState = this._frameStates[frameSerial]
    frameState.result.alpha = {
      buffer: buffer,
      width: width,
      height: height,
    }

    if (frameState.state === 'pending_alpha') {
      this._onComplete(frameState)
    } else {
      this._frameStates[frameSerial].state = 'pending_opaque'
    }
  }

  destroy() {
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
