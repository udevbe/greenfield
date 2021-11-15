declare namespace nativeEncoder {
  export type EncoderWrapper = unknown

  export function createEncoder(
    encoderType: 'nvh264' | 'x264',
    wlClient: unknown,
    onOpaqueEncoded: (opaque: Buffer, separateAlpha: boolean) => void,
    onAlphaEncoded: ((alpha: Buffer) => void) | null,
  ): EncoderWrapper

  export function encodeBuffer(encoder: unknown, wlClient: unknown, bufferId: number): { width: number; height: number }
}

export = nativeEncoder
