declare namespace nativeEncoder {
  export type EncoderWrapper = unknown

  export function createEncoder(
    encoderType: 'nvh264' | 'x264' | 'vaapih264',
    wlClient: unknown,
    frameEncoded: (sample: Buffer) => void,
  ): EncoderWrapper

  export function encodeBuffer(encoder: unknown, bufferId: number, serial: number): void
  export function requestKeyUnit(encoder: unknown): void
}

export = nativeEncoder
