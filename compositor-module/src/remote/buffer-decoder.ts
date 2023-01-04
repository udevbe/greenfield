import Surface from '../Surface'
import {
  DecodedFrame,
  DualPlaneYUVAArrayBuffer,
  DualPlaneRGBAImageBitmap,
  DualPlaneRGBAArrayBuffer,
  DualPlaneRGBAVideoFrame,
  DualPlaneYUVASplitBuffer,
} from './DecodedFrame'
import { EncodedFrame } from './EncodedFrame'

export interface H264DecoderContext {
  decode(
    bufferContents: EncodedFrame,
  ): Promise<
    | DualPlaneYUVASplitBuffer
    | DualPlaneYUVAArrayBuffer
    | DualPlaneRGBAImageBitmap
    | DualPlaneRGBAArrayBuffer
    | DualPlaneRGBAVideoFrame
  >
  destroy(): void
}

export interface FrameDecoder {
  decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame>

  createH264DecoderContext(surface: Surface, contextId: string): H264DecoderContext
}
