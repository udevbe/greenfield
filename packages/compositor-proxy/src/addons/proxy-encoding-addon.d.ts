declare namespace nativeEncoder {
  export type FrameEncoder = unknown

  export function createFrameEncoder(
    encoderType: 'nvh264' | 'x264' | 'vaapih264',
    wlClient: unknown,
    drmContext: unknown,
    frameEncoded: (sample: Buffer) => void,
  ): FrameEncoder

  export function destroyFrameEncoder(encoder: FrameEncoder)

  export function encodeFrame(
    frameEncoder: unknown,
    bufferId: number,
    bufferContentSerial: number,
    bufferCreationSerial: number,
  ): void

  export function requestKeyUnit(encoder: FrameEncoder): void
}

export = nativeEncoder
