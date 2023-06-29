import Session from '../Session'
import Surface from '../Surface'
import { FrameDecoder, H264DecoderContext } from './buffer-decoder'
import {
  createDecodedFrame,
  DecodedFrame,
  DecodedPixelContent,
  DualPlaneRGBAVideoFrame,
  DualPlaneYUVAArrayBuffer,
} from './DecodedFrame'
import { EncodedFrame } from './EncodedFrame'

type FrameState = {
  serial: number
  resolve: (value: DualPlaneRGBAVideoFrame | DualPlaneYUVAArrayBuffer) => void
  reject: (error: Error) => void
  state: 'pending' | 'pending_opaque' | 'pending_alpha' | 'complete' | 'error'
  result: Partial<DualPlaneRGBAVideoFrame>
}
export const softwareDecoderConfig: VideoDecoderConfig = {
  codec: 'avc1.64001f', // h264 High Level 3.1
  optimizeForLatency: true,
  hardwareAcceleration: 'prefer-software',
} as const

export const hardwareDecoderConfig: VideoDecoderConfig = {
  codec: 'avc1.64001f', // h264 High Level 3.1
  optimizeForLatency: true,
  hardwareAcceleration: 'prefer-hardware',
} as const

export function webCodecFrameDecoderFactory(
  videoDecoderConfig: VideoDecoderConfig,
): (session: Session) => FrameDecoder {
  return (session: Session) => new WebCodecFrameDecoder(session, videoDecoderConfig)
}

function isKeyFrame(accessUnit: Uint8Array) {
  const dataView = new DataView(accessUnit.buffer, accessUnit.byteOffset, accessUnit.length)
  const maxOffset = accessUnit.byteLength - Uint32Array.BYTES_PER_ELEMENT
  let sps = false
  let pps = false
  let idr = false
  for (let i = 0; i < maxOffset; i++) {
    const nalHeaderCandidate = dataView.getUint32(i)
    if (nalHeaderCandidate <= 0x000001ff && nalHeaderCandidate > 0x00000100) {
      const nalType = nalHeaderCandidate & 0x1f
      if (nalType === 7) {
        // Sequence parameter set
        sps = true
      } else if (nalType === 8) {
        // Picture parameter set
        pps = true
      } else if (nalType === 5) {
        // Coded slice of an IDR picture
        idr = true
      }
      if (pps && sps && idr) {
        return true
      }
    }
  }
  return false
}

class WebCodecFrameDecoder implements FrameDecoder {
  constructor(private readonly session: Session, private readonly videoDecoderConfig: VideoDecoderConfig) {}

  async decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame> {
    // console.log(`Decoding encoded frame: ${encodedFrame.contentSerial} using WebCodecs buffer decoder`)
    const decodedContents = await this[encodedFrame.mimeType](surface, encodedFrame)
    return createDecodedFrame(encodedFrame.mimeType, decodedContents, encodedFrame.size, encodedFrame.contentSerial)
  }

  createH264DecoderContext(surface: Surface, contextId: string): H264DecoderContext {
    return new WebCodecH264DecoderContext(this.session, this.videoDecoderConfig, surface, contextId)
  }

  private ['video/h264'](surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    return surface.getH264DecoderContext(this).decode(encodedFrame)
  }

  private async ['image/png'](_surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
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
}

class WebCodecH264DecoderContext implements H264DecoderContext {
  private readonly opaqueInit: VideoDecoderInit = {
    output: (output) => this.opaqueOutput(output),
    error: (error) => this.opaqueError(error),
  }
  private readonly alphaInit: VideoDecoderInit = {
    output: (output) => this.alphaOutput(output),
    error: (error) => this.alphaError(error),
  }
  private opaqueDecoder?: VideoDecoder
  private alphaDecoder?: VideoDecoder

  constructor(
    private readonly session: Session,
    private readonly videoDecoderConfig: VideoDecoderConfig,
    private readonly surface: Surface,
    private readonly contextId: string,
    private decodingSerialsQueue: number[] = [],
    private decodingAlphaSerialsQueue: number[] = [],
    private readonly frameStates: Record<number, FrameState> = {},
  ) {}

  decode(bufferContents: EncodedFrame): Promise<DualPlaneRGBAVideoFrame | DualPlaneYUVAArrayBuffer> {
    return new Promise<DualPlaneRGBAVideoFrame | DualPlaneYUVAArrayBuffer>((resolve, reject) => {
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

  destroy(): void {
    if (this.opaqueDecoder !== undefined && this.opaqueDecoder.state !== 'closed') {
      this.opaqueDecoder.close()
      this.opaqueDecoder = undefined
    }
    if (this.alphaDecoder !== undefined && this.alphaDecoder.state !== 'closed') {
      this.alphaDecoder.close()
      this.opaqueDecoder = undefined
    }
  }

  private handleError(frameSerial: number, error: DOMException) {
    const frameState = this.frameStates[frameSerial]
    if (frameState.state !== 'error') {
      if (this.opaqueDecoder && this.opaqueDecoder.state !== 'closed') {
        this.opaqueDecoder.close()
      }
      if (this.alphaDecoder && this.alphaDecoder.state !== 'closed') {
        this.alphaDecoder.close()
      }
      this.opaqueDecoder = undefined
      this.opaqueDecoder = undefined
      frameState.result.opaque?.buffer.close()
      frameState.result.alpha?.buffer.close()
      frameState.state = 'error'
      frameState.reject(error)
    }
  }

  opaqueError(error: DOMException): void {
    const frameSerial = this.decodingSerialsQueue.shift()

    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found opaqueError.')
    }

    this.handleError(frameSerial, error)
  }

  alphaError(error: DOMException): void {
    const frameSerial = this.decodingAlphaSerialsQueue.shift()

    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found alphaError.')
    }

    this.handleError(frameSerial, error)
  }

  private onComplete(frameState: FrameState) {
    const decodeResult = frameState.result

    if (decodeResult.opaque === undefined) {
      frameState.state = 'complete'
      delete this.frameStates[frameState.serial]
      throw new Error('BUG. No opaque frame decode result found!')
    }

    const opaqueVideoFrame = decodeResult.opaque.buffer
    const alphaVideoFrame = decodeResult.alpha?.buffer

    if (opaqueVideoFrame.format === 'I420') {
      const opaqueBuffer = new ArrayBuffer(opaqueVideoFrame.allocationSize())
      const opaquePromise: Promise<PlaneLayout[]> = opaqueVideoFrame.copyTo(opaqueBuffer)

      let alphaBuffer: ArrayBuffer | undefined
      let alphaPromise: Promise<PlaneLayout[]> | undefined
      if (alphaVideoFrame) {
        alphaBuffer = new ArrayBuffer(alphaVideoFrame.allocationSize())
        alphaPromise = alphaVideoFrame.copyTo(alphaBuffer)
      }

      const dualPlaneYUVABuffer: DualPlaneYUVAArrayBuffer = {
        type: 'DualPlaneYUVAArrayBuffer',
        opaque: {
          buffer: new Uint8Array(opaqueBuffer),
          codedSize: {
            width: opaqueVideoFrame.codedWidth,
            height: opaqueVideoFrame.codedHeight,
          },
        },
        close: () => {
          /*noop*/
        },
      }

      if (alphaBuffer && decodeResult.alpha) {
        dualPlaneYUVABuffer.alpha = {
          buffer: new Uint8Array(alphaBuffer),
          codedSize: {
            width: decodeResult.alpha.buffer.codedWidth,
            height: decodeResult.alpha.buffer.codedHeight,
          },
        }
      }

      Promise.all([opaquePromise, alphaPromise]).then(() => {
        frameState.state = 'complete'
        delete this.frameStates[frameState.serial]
        opaqueVideoFrame.close()
        decodeResult.alpha?.buffer.close()
        frameState.resolve(dualPlaneYUVABuffer)
      })
      return
    }

    frameState.state = 'complete'
    delete this.frameStates[frameState.serial]

    const dualPlaneVideoFrameBuffer: DualPlaneRGBAVideoFrame = {
      type: 'DualPlaneRGBAVideoFrame',
      opaque: decodeResult.opaque,
      alpha: decodeResult.alpha,
      close: () => {
        opaqueVideoFrame.close()
        alphaVideoFrame?.close()
      },
    }

    frameState.resolve(dualPlaneVideoFrameBuffer)
  }

  private opaqueOutput(buffer: VideoFrame) {
    const width = buffer.codedWidth
    const height = buffer.codedHeight
    const frameSerial = this.decodingSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onAlphaPictureDecoded.')
    }
    const frameState = this.frameStates[frameSerial]
    if (frameState.state === 'error') {
      buffer.close()
      return
    }

    frameState.result.opaque = { buffer, codedSize: { width, height } }

    if (frameState.state === 'pending_opaque') {
      this.onComplete(frameState)
    } else {
      this.frameStates[frameSerial].state = 'pending_alpha'
    }
  }

  private alphaOutput(buffer: VideoFrame) {
    const width = buffer.codedWidth
    const height = buffer.codedHeight
    const frameSerial = this.decodingAlphaSerialsQueue.shift()
    if (frameSerial === undefined) {
      throw new Error('BUG. Invalid state. No frame serial found onAlphaPictureDecoded.')
    }
    const frameState = this.frameStates[frameSerial]
    if (frameState.state === 'error') {
      buffer.close()
      return
    }
    frameState.result.alpha = { buffer, codedSize: { width, height } }

    if (frameState.state === 'pending_alpha') {
      this.onComplete(frameState)
    } else {
      this.frameStates[frameSerial].state = 'pending_opaque'
    }
  }

  private decodeH264(encodedFrame: EncodedFrame) {
    const bufferSerial = encodedFrame.contentSerial
    let type: 'delta' | 'key' = 'delta'

    if (this.opaqueDecoder === undefined || this.opaqueDecoder.state === 'closed') {
      if (isKeyFrame(encodedFrame.pixelContent.opaque)) {
        this.opaqueDecoder = new VideoDecoder(this.opaqueInit)
        this.opaqueDecoder.configure(this.videoDecoderConfig)
        type = 'key'
      } else {
        this.destroy()
        delete this.frameStates[bufferSerial]
        throw new Error('Tried to instantiate web-codec with non key-frame.')
      }
    }
    if (encodedFrame.pixelContent.alpha) {
      if (this.alphaDecoder === undefined || this.alphaDecoder.state === 'closed') {
        if (isKeyFrame(encodedFrame.pixelContent.alpha)) {
          this.alphaDecoder = new VideoDecoder(this.alphaInit)
          this.alphaDecoder.configure(this.videoDecoderConfig)
          type = 'key'
        } else {
          // At this point a keyframe should already be requested by opaque decoder and function should have returned.
          this.destroy()
          delete this.frameStates[bufferSerial]
          throw new Error('Tried to instantiate web-codec with non key-frame.')
        }
      }
    }

    this.decodingSerialsQueue = [...this.decodingSerialsQueue, bufferSerial]
    this.opaqueDecoder.decode(
      new EncodedVideoChunk({
        timestamp: 0,
        type,
        data: encodedFrame.pixelContent.opaque,
      }),
    )

    if (this.alphaDecoder && encodedFrame.pixelContent.alpha) {
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
  }
}
