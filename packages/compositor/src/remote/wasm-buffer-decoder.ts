import Surface from '../Surface'
import { createDecodedFrame, DecodedFrame, DecodedPixelContent, DualPlaneYUVASplitBuffer } from './DecodedFrame'
import { EncodedFrame } from './EncodedFrame'
import { FrameDecoder, H264DecoderContext } from './buffer-decoder'
import type { FfmpegH264Frame } from 'ffmpegh264'

export function createWasmFrameDecoder(): FrameDecoder {
  return new WasmFrameDecoder()
}

class WasmFrameDecoder implements FrameDecoder {
  async decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame> {
    const decodedContents = await this[encodedFrame.mimeType](surface, encodedFrame)
    return createDecodedFrame(encodedFrame.mimeType, decodedContents, encodedFrame.size, encodedFrame.contentSerial)
  }

  private ['video/h264'](surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    // console.log(`Decoding encoded frame: ${encodedFrame.contentSerial} using WASM buffer decoder (video/h264)`)
    return surface.getH264DecoderContext(this).decode(encodedFrame)
  }

  private async ['image/png'](_surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    // console.log(`Decoding encoded frame: ${encodedFrame.contentSerial} using WASM buffer decoder (image/png)`)
    const frame = encodedFrame.pixelContent
    const blob = new Blob([frame.opaque], { type: 'image/png' })
    const bitmap = await createImageBitmap(
      blob,
      encodedFrame.encodedSize.width - encodedFrame.size.width,
      encodedFrame.encodedSize.height - encodedFrame.size.height,
      encodedFrame.size.width,
      encodedFrame.size.height,
    )
    return { type: 'SinglePlane', bitmap, close: () => bitmap.close() }
  }

  createH264DecoderContext(_surface: Surface, contextId: string): H264DecoderContext {
    return createWasmH264DecoderContext(contextId)
  }
}

type H264NALDecoderWorkerMessage = {
  type: string
  width: number
  height: number
  data: FfmpegH264Frame
  renderStateId: number
}
type FrameState = {
  serial: number
  resolve: (value: DualPlaneYUVASplitBuffer | PromiseLike<DualPlaneYUVASplitBuffer>) => void
  reject: (error: Error) => void
  state: 'pending' | 'pending_opaque' | 'pending_alpha' | 'complete'
  result: Partial<DualPlaneYUVASplitBuffer>
}

const decoders: { [key: string]: WasmH264DecoderContext } = {}

const opaqueWorker = new Promise<Worker>((resolve, reject) => {
  const h264NALDecoderWorker: Worker = new Worker(new URL('./H264NALDecoder.worker.ts', import.meta.url), {
    name: 'h264NALDecoderOpaque',
    type: 'module',
  })
  h264NALDecoderWorker.addEventListener('message', (e) => {
    const message = e.data as H264NALDecoderWorkerMessage
    switch (message.type) {
      case 'pictureReady':
        decoders[message.renderStateId].onOpaquePictureDecoded(message)
        break
      case 'decoderReady':
        h264NALDecoderWorker.postMessage({})
        resolve(h264NALDecoderWorker)
        break
      case 'error':
        const error = new Error(message.data as unknown as string)
        if (decoders[message.renderStateId]) {
          decoders[message.renderStateId].onOpaqueError(error)
        } else {
          reject(error)
        }
        break
    }
  })
})

const alphaWorker = new Promise<Worker>((resolve, reject) => {
  const h264NALDecoderWorker: Worker = new Worker(new URL('./H264NALDecoder.worker.ts', import.meta.url), {
    name: 'h264NALDecoderAlpha',
    type: 'module',
  })
  h264NALDecoderWorker.addEventListener('message', (e) => {
    const message = e.data as H264NALDecoderWorkerMessage
    switch (message.type) {
      case 'pictureReady':
        decoders[message.renderStateId].onAlphaPictureDecoded(message)
        break
      case 'decoderReady':
        resolve(h264NALDecoderWorker)
        break
      case 'error':
        const error = new Error(message.data as unknown as string)
        if (decoders[message.renderStateId]) {
          decoders[message.renderStateId].onAlphaError(error)
        } else {
          reject(error)
        }
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
    private decodingBufferContentSerialsQueue: number[] = [],
    private decodingAlphaContentSerialsQueue: number[] = [],
    private readonly frameStates: { [key: number]: FrameState } = {},
  ) {}

  async decode(bufferContents: EncodedFrame): Promise<DualPlaneYUVASplitBuffer> {
    return new Promise<DualPlaneYUVASplitBuffer>((resolve, reject) => {
      this.frameStates[bufferContents.contentSerial] = {
        serial: bufferContents.contentSerial,
        resolve,
        reject,
        state: 'pending',
        result: {
          opaque: undefined,
          alpha: undefined,
        },
      }

      this.decodeH264(bufferContents)
    })
  }

  private decodeH264(encodedFrame: EncodedFrame) {
    const contentSerial = encodedFrame.contentSerial

    if (encodedFrame.pixelContent.alpha) {
      const h264Nal = encodedFrame.pixelContent.alpha.slice()
      alphaWorker.then((worker) => {
        this.decodingAlphaContentSerialsQueue = [...this.decodingAlphaContentSerialsQueue, contentSerial]
        // create a copy of the arraybuffer, so we can zero-copy the opaque part (after zero-copying, we can no longer use the underlying array in any way)
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
      this.frameStates[contentSerial].state = 'pending_opaque'
    }

    const h264Nal = encodedFrame.pixelContent.opaque
    opaqueWorker.then((worker) => {
      this.decodingBufferContentSerialsQueue = [...this.decodingBufferContentSerialsQueue, contentSerial]
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

  onOpaqueError(error: Error) {
    const frameSerial = this.decodingBufferContentSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found for onOpaqueError.')
    }
    const frameState = this.frameStates[frameSerial]
    frameState.reject(error)
  }

  onAlphaError(error: Error) {
    const alphaBufferContentSerial = this.decodingAlphaContentSerialsQueue.shift()
    if (alphaBufferContentSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found for onAlphaError.')
    }
    const frameState = this.frameStates[alphaBufferContentSerial]
    frameState.reject(error)
  }

  private onComplete(frameState: FrameState) {
    frameState.state = 'complete'
    delete this.frameStates[frameState.serial]
    const decodeResult = frameState.result
    if (decodeResult.opaque === undefined) {
      throw new Error('BUG. No opaque frame decode result found!')
    }

    const opaqueFramePtr = decodeResult.opaque.buffer.ptr
    const alphaFramePtr = decodeResult.alpha?.buffer.ptr
    const renderStateId = this.surfaceH264DecodeId

    frameState.resolve({
      close() {
        opaqueWorker.then((worker) => {
          worker.postMessage({ type: 'closeFrame', renderStateId, data: opaqueFramePtr })
        })
        if (alphaFramePtr) {
          alphaWorker.then((worker) => {
            worker.postMessage({ type: 'closeFrame', renderStateId, data: alphaFramePtr })
          })
        }
      },
      type: 'DualPlaneYUVASplitBuffer',
      opaque: decodeResult.opaque,
      alpha: decodeResult.alpha,
    })
  }

  onOpaquePictureDecoded({ width, height, data }: { width: number; height: number; data: FfmpegH264Frame }): void {
    const frameSerial = this.decodingBufferContentSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onOpaquePictureDecoded.')
    }
    const frameState = this.frameStates[frameSerial]
    frameState.result.opaque = { buffer: data, codedSize: { width: data.stride, height } }

    if (frameState.state === 'pending_opaque') {
      this.onComplete(frameState)
    } else {
      frameState.state = 'pending_alpha'
    }
  }

  onAlphaPictureDecoded({ width, height, data }: { width: number; height: number; data: FfmpegH264Frame }): void {
    const alphaBufferContentSerial = this.decodingAlphaContentSerialsQueue.shift()
    if (alphaBufferContentSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onAlphaPictureDecoded.')
    }
    const frameState = this.frameStates[alphaBufferContentSerial]
    frameState.result.alpha = { buffer: data, codedSize: { width: data.stride, height } }

    if (frameState.state === 'pending_alpha') {
      this.onComplete(frameState)
    } else {
      this.frameStates[alphaBufferContentSerial].state = 'pending_opaque'
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
