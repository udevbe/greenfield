declare namespace nativeEncoder {
  export type EncodingContext = unknown
  export function createEncoder(
    encoderName: 'nv264_alpha' | 'nv264' | 'png' | 'x264_alpha' | 'x264',
    bufferFormat: 'BGRA' | 'BGRx',
    width: number,
    height: number,
    onOpaqueEncoded: (opaque: Buffer) => void,
    onAlphaEncoded: ((alpha: Buffer) => void) | null,
  ): EncodingContext

  export function encodeBuffer(
    encodingContext: EncodingContext,
    pixelBuffer: unknown,
    gstBufferFormat: 'BGRA' | 'BGRx',
    width: number,
    height: number,
    stride: number,
  ): void
}

export = nativeEncoder
