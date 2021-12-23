import Session from '../Session'
import Surface from '../Surface'
import {
  DecodedFrame,
  DualPlaneYUVAArrayBuffer,
  DualPlaneRGBAImageBitmap,
  DualPlaneRGBAArrayBuffer,
} from './DecodedFrame'
import { EncodedFrame } from './EncodedFrame'
import { createWasmFrameDecoder } from './wasm-buffer-decoder'
import { createWebCodecFrameDecoder } from './webcodec-buffer-decoder'

export interface H264DecoderContext {
  decode(
    bufferContents: EncodedFrame,
  ): Promise<DualPlaneYUVAArrayBuffer | DualPlaneRGBAImageBitmap | DualPlaneRGBAArrayBuffer>
  destroy(): void
}

export interface FrameDecoder {
  decode(surface: Surface, encodedFrame: EncodedFrame): Promise<DecodedFrame>

  createH264DecoderContext(surface: Surface, contextId: string): H264DecoderContext
}

export function createFrameDecoder(session: Session): FrameDecoder {
  return 'VideoDecoder' in window ? createWebCodecFrameDecoder(session) : createWasmFrameDecoder()
  // return createWasmFrameDecoder()
}
