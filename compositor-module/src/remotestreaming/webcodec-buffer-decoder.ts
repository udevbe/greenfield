import { RemoteOutOfBandSendOpcode } from '../RemoteOutOfBandChannel'
import Session from '../Session'
import Surface from '../Surface'
import { FrameDecoder, H264DecoderContext } from './buffer-decoder'
import { createDecodedFrame, DecodedFrame, DecodedPixelContent, DualPlaneRGBAImageBitmap } from './DecodedFrame'
import { EncodedFrame } from './EncodedFrame'

type FrameState = {
  serial: number
  resolve: (value: DualPlaneRGBAImageBitmap | PromiseLike<DualPlaneRGBAImageBitmap>) => void
  state: 'pending' | 'pending_opaque' | 'pending_alpha' | 'complete'
  result: Partial<DualPlaneRGBAImageBitmap>
}
const config: VideoDecoderConfig = {
  codec: 'avc1.42001e', // h264 Baseline Level 3
  optimizeForLatency: true,
  hardwareAcceleration: 'prefer-hardware',
} as const

export function createWebCodecFrameDecoder(session: Session): FrameDecoder {
  return new WebCodecFrameDecoder(session)
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
  constructor(private readonly session: Session) {}

  async decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame> {
    const decodedContents = await this[encodedFrame.mimeType](surface, encodedFrame)
    return createDecodedFrame(encodedFrame.mimeType, decodedContents, encodedFrame.size)
  }

  createH264DecoderContext(surface: Surface, contextId: string): H264DecoderContext {
    return new WebCodecH264DecoderContext(this.session, surface, contextId)
  }

  private ['video/h264'](surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    return surface.getH264DecoderContext(this).decode(encodedFrame)
  }

  private async ['image/png'](_surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedPixelContent> {
    const frame = encodedFrame.pixelContent
    const blob = new Blob([frame.opaque], { type: 'image/png' })
    const bitmap = await createImageBitmap(blob, 0, 0, encodedFrame.size.width, encodedFrame.size.height)
    return { type: 'SinglePlane', bitmap, blob }
  }
}

class WebCodecH264DecoderContext implements H264DecoderContext {
  private readonly opaqueInit: VideoDecoderInit = {
    output: (output) => this.opaqueOutput(output),
    error: (error) => this.error(error),
  }
  private readonly alphaInit: VideoDecoderInit = {
    output: (output) => this.alphaOutput(output),
    error: (error) => this.error(error),
  }
  private opaqueDecoder?: VideoDecoder
  private alphaDecoder?: VideoDecoder

  constructor(
    private readonly session: Session,
    private readonly surface: Surface,
    private readonly contextId: string,
    private decodingSerialsQueue: number[] = [],
    private decodingAlphaSerialsQueue: number[] = [],
    private readonly frameStates: { [key: number]: FrameState } = {},
  ) {}

  async decode(bufferContents: EncodedFrame): Promise<DualPlaneRGBAImageBitmap> {
    return new Promise<DualPlaneRGBAImageBitmap>((resolve) => {
      this.frameStates[bufferContents.serial] = {
        serial: bufferContents.serial,
        resolve,
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

  error(error: DOMException): void {
    if (error.code === 22) {
      // Codec reclaimed due to inactivity.
      // request next frame to be a key frame, so we can re-initialize once a new frame comes in
      this.session
        .getRemoteClientConnection(this.surface.resource.client)
        .remoteOutOfBandChannel.send(
          RemoteOutOfBandSendOpcode.ForceKeyFrame,
          new Uint32Array([this.surface.resource.id]),
        )
      this.opaqueDecoder = undefined
      this.alphaDecoder = undefined
    } else {
      // FIXME use a logger
      console.error(error)
    }
  }

  private onComplete(frameState: FrameState) {
    frameState.state = 'complete'
    delete this.frameStates[frameState.serial]
    const decodeResult = frameState.result
    if (decodeResult.opaque === undefined) {
      throw new Error('BUG. No opaque frame decode result found!')
    }
    const dualPlaneRGBAImageBitmap = {
      type: 'DualPlaneRGBAImageBitmap',
      opaque: decodeResult.opaque,
      alpha: decodeResult.alpha,
    } as const
    frameState.resolve(dualPlaneRGBAImageBitmap)
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
      this.onComplete(frameState)
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
      this.onComplete(frameState)
    } else {
      this.frameStates[frameSerial].state = 'pending_opaque'
    }
  }

  private decodeH264(encodedFrame: EncodedFrame) {
    const bufferSerial = encodedFrame.serial
    this.decodingSerialsQueue = [...this.decodingSerialsQueue, bufferSerial]
    let type: 'delta' | 'key' = 'delta'
    if (this.opaqueDecoder === undefined) {
      if (isKeyFrame(encodedFrame.pixelContent.opaque)) {
        this.opaqueDecoder = new VideoDecoder(this.opaqueInit)
        this.opaqueDecoder.configure(config)
        type = 'key'
      } else {
        // TODO Request keyframe unit and wait for answer
        return
      }
    }

    this.opaqueDecoder.decode(
      new EncodedVideoChunk({
        timestamp: 0,
        type,
        data: encodedFrame.pixelContent.opaque,
      }),
    )

    if (encodedFrame.pixelContent.alpha) {
      this.decodingAlphaSerialsQueue = [...this.decodingAlphaSerialsQueue, bufferSerial]

      if (this.alphaDecoder === undefined) {
        if (isKeyFrame(encodedFrame.pixelContent.alpha)) {
          this.alphaDecoder = new VideoDecoder(this.alphaInit)
          this.alphaDecoder.configure(config)
          type = 'key'
        } else {
          // TODO Request and wait for keyframe unit
          return
        }
      }

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
