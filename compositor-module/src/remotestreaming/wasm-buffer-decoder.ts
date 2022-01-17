import Surface from '../Surface'
import { createDecodedFrame, DecodedFrame, DecodedPixelContent } from './DecodedFrame'
import { EncodedFrame } from './EncodedFrame'
import { FrameDecoder, H264DecoderContext } from './buffer-decoder'
import { DualPlaneYUVAArrayBuffer } from './DecodedFrame'

export function createWasmFrameDecoder(): FrameDecoder {
  return new WasmFrameDecoder()
}

class WasmFrameDecoder implements FrameDecoder {
  async decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame> {
    const decodedContents = await this[encodedFrame.mimeType](surface, encodedFrame)
    return createDecodedFrame(encodedFrame.mimeType, decodedContents, encodedFrame.size, encodedFrame.serial)
  }

  private ['video/h264'](surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    return surface.getH264DecoderContext(this).decode(encodedFrame)
  }

  private async ['image/png'](_surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    const frame = encodedFrame.pixelContent
    const blob = new Blob([frame.opaque], { type: 'image/png' })
    const bitmap = await createImageBitmap(blob, 0, 0, encodedFrame.size.width, encodedFrame.size.height)
    return { type: 'SinglePlane', bitmap, blob, close: () => bitmap.close() }
  }

  createH264DecoderContext(_surface: Surface, contextId: string): H264DecoderContext {
    return createWasmH264DecoderContext(contextId)
  }
}

type H264NALDecoderWorkerMessage = {
  type: string
  width: number
  height: number
  data: ArrayBuffer
  renderStateId: number
}
type FrameState = {
  serial: number
  resolve: (value: DualPlaneYUVAArrayBuffer | PromiseLike<DualPlaneYUVAArrayBuffer>) => void
  state: 'pending' | 'pending_opaque' | 'pending_alpha' | 'complete'
  result: Partial<DualPlaneYUVAArrayBuffer>
}

const decoders: { [key: string]: WasmH264DecoderContext } = {}

const opaqueWorker = new Promise<Worker>((resolve) => {
  const h264NALDecoderWorker: Worker = new Worker(new URL('./H264NALDecoder.worker', import.meta.url))
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
  const h264NALDecoderWorker: Worker = new Worker(new URL('./H264NALDecoder.worker', import.meta.url))
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

function createWasmH264DecoderContext(surfaceH264DecodeId: string): WasmH264DecoderContext {
  const h264BufferContentDecoder = new WasmH264DecoderContext(surfaceH264DecodeId)
  decoders[surfaceH264DecodeId] = h264BufferContentDecoder
  return h264BufferContentDecoder
}

class WasmH264DecoderContext implements H264DecoderContext {
  constructor(
    public readonly surfaceH264DecodeId: string,
    private decodingSerialsQueue: number[] = [],
    private decodingAlphaSerialsQueue: number[] = [],
    private readonly frameStates: { [key: number]: FrameState } = {},
  ) {}

  async decode(bufferContents: EncodedFrame): Promise<DualPlaneYUVAArrayBuffer> {
    return new Promise<DualPlaneYUVAArrayBuffer>((resolve) => {
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
      type: 'DualPlaneYUVAArrayBuffer',
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
    frameState.result.opaque = { buffer, width, height }

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
    frameState.result.alpha = { buffer, width: width, height: height }

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
