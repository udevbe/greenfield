import Surface from '../Surface'
import { FrameDecoder, H264DecoderContext } from './buffer-decoder'
import {
  createDecodedFrame,
  DecodedFrame,
  DecodedPixelContent,
  DualPlaneRGBAImageBitmap,
  DualPlaneRGBAArrayBuffer,
} from './DecodedFrame'
import { EncodedFrame } from './EncodedFrame'

type FrameState = {
  serial: number
  resolve: (
    value:
      | DualPlaneRGBAImageBitmap
      | DualPlaneRGBAArrayBuffer
      | PromiseLike<DualPlaneRGBAImageBitmap | DualPlaneRGBAArrayBuffer>,
  ) => void
  state: 'pending' | 'pending_opaque' | 'pending_alpha' | 'complete'
  result: Partial<DualPlaneRGBAImageBitmap>
}
const config: VideoDecoderConfig = {
  codec: 'avc1.42001e', // h264 Baseline Level 3
  optimizeForLatency: true,
  hardwareAcceleration: 'prefer-hardware',
} as const

export function createWebCodecFrameDecoder(): FrameDecoder {
  return new WebCodecFrameDecoder()
}

class WebCodecFrameDecoder implements FrameDecoder {
  async decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame> {
    const decodedContents = await this[encodedFrame.mimeType](surface, encodedFrame)
    return createDecodedFrame(encodedFrame.mimeType, decodedContents, encodedFrame.size)
  }

  createH264DecoderContext(contextId: string): H264DecoderContext {
    return new WebCodecH264DecoderContext(contextId)
  }

  private ['video/h264'](surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    return surface.getH264DecoderContext(this).decode(encodedFrame)
  }

  private async ['image/png'](surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    const frame = encodedFrame.pixelContent
    const blob = new Blob([frame.opaque], { type: 'image/png' })
    const bitmap = await createImageBitmap(blob, 0, 0, encodedFrame.size.width, encodedFrame.size.height)
    return { type: 'SinglePlane', bitmap, blob }
  }
}

class WebCodecH264DecoderContext implements H264DecoderContext {
  private readonly opaqueDecoder = new VideoDecoder({
    output: (output1) => {
      this.opaqueOutput(output1)
    },
    error: (error) => this.error(error),
  })
  private readonly alphaDecoder = new VideoDecoder({
    output: (output1) => {
      this.alphaOutput(output1)
    },
    error: (error) => this.error(error),
  })

  constructor(
    private readonly contextId: string,
    private decodingSerialsQueue: number[] = [],
    private decodingAlphaSerialsQueue: number[] = [],
    private readonly frameStates: { [key: number]: FrameState } = {},
  ) {
    this.opaqueDecoder.configure(config)
    this.alphaDecoder.configure(config)
  }

  async decode(bufferContents: EncodedFrame): Promise<DualPlaneRGBAImageBitmap | DualPlaneRGBAArrayBuffer> {
    return new Promise<DualPlaneRGBAImageBitmap | DualPlaneRGBAArrayBuffer>((resolve) => {
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

  destroy(): void {
    this.opaqueDecoder.close()
    this.alphaDecoder.close()
  }

  error(error: DOMException): void {
    // FIXME use a logger
    console.error(error.message)
  }

  private _onComplete(frameState: FrameState) {
    frameState.state = 'complete'
    delete this.frameStates[frameState.serial]
    const decodeResult = frameState.result
    if (decodeResult.opaque === undefined) {
      throw new Error('BUG. No opaque frame decode result found!')
    }
    frameState.resolve({
      type: 'DualPlaneRGBAImageBitmap',
      opaque: decodeResult.opaque,
      alpha: decodeResult.alpha,
    })
  }

  private opaqueOutput(output: VideoFrame) {
    const buffer = output as unknown as ImageBitmap
    const width = output.displayWidth
    const height = output.displayHeight
    const frameSerial = this.decodingSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onAlphaPictureDecoded.')
    }
    const frameState = this.frameStates[frameSerial]
    frameState.result.opaque = { buffer, width, height }

    if (frameState.state === 'pending_opaque') {
      this._onComplete(frameState)
    } else {
      this.frameStates[frameSerial].state = 'pending_alpha'
    }
  }

  private alphaOutput(output: VideoFrame) {
    const buffer = output as unknown as ImageBitmap
    const width = output.displayWidth
    const height = output.displayHeight
    const frameSerial = this.decodingAlphaSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onAlphaPictureDecoded.')
    }
    const frameState = this.frameStates[frameSerial]
    frameState.result.alpha = { buffer, width, height }

    if (frameState.state === 'pending_alpha') {
      this._onComplete(frameState)
    } else {
      this.frameStates[frameSerial].state = 'pending_opaque'
    }
  }

  private _decodeH264(encodedFrame: EncodedFrame) {
    const nalPayload = encodedFrame.pixelContent.opaque[4]
    const type = nalPayload & 0x60 ? ('key' as const) : ('delta' as const)
    const bufferSerial = encodedFrame.serial
    if (encodedFrame.pixelContent.alpha) {
      this.decodingAlphaSerialsQueue = [...this.decodingAlphaSerialsQueue, bufferSerial]
      this.alphaDecoder.decode(
        new EncodedVideoChunk({
          timestamp: 0,
          type,
          data: encodedFrame.pixelContent.alpha,
        }),
      )
    } else {
      this.frameStates[bufferSerial].state = 'pending_opaque'
    }

    this.decodingSerialsQueue = [...this.decodingSerialsQueue, bufferSerial]
    const opaqueEncodedVideoChunk = new EncodedVideoChunk({
      timestamp: 0,
      type,
      data: encodedFrame.pixelContent.opaque,
    })
    this.opaqueDecoder.decode(opaqueEncodedVideoChunk)
  }
}
