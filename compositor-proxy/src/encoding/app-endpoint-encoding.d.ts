declare namespace nativeEncoder {
  export type EncodingContext = unknown

  export function createEncoder(
    encoderName: 'nvh264' | 'x264',
    wlClient: unknown,
    bufferId: number,
    onOpaqueEncoded: (opaque: Buffer, separateAlpha: boolean) => void,
    onAlphaEncoded: ((alpha: Buffer) => void) | null,
  ): EncodingContext

  export function encodeBuffer(encoder: unknown, wlClient: unknown, bufferId: number): { width: number; height: number }
}

export = nativeEncoder
