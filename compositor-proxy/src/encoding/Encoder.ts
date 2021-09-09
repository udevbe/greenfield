// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import { Configschema } from '../@types/config'
import { config } from '../config'
import { createNVH264AlphaEncoder } from './NVH264AlphaEncoder'
import { createNVH264OpaqueEncoder } from './NVH264OpaqueEncoder'
import { createPNGEncoder } from './PNGEncoder'
import { WlShmFormat } from './WlShmFormat'
import { FrameEncoder, FrameEncoderFactory, SupportedWlShmFormat } from './FrameEncoder'
import { createX264AlphaEncoder } from './X264AlphaEncoder'
import { EncodedFrame } from './EncodedFrame'
import { createX264OpaqueEncoder } from './X264OpaqueEncoder'

type QueueElement = {
  pixelBuffer: unknown
  bufferFormat: SupportedWlShmFormat
  bufferWidth: number
  bufferHeight: number
  bufferStride: number
  serial: number
  resolve: (value: EncodedFrame) => void
  reject: (reason?: any) => void
}

// wayland to gstreamer mappings

const types: {
  [key in SupportedWlShmFormat]: { [key in Configschema['encoder']['h264Encoder']]: FrameEncoderFactory }
} = {
  [WlShmFormat.argb8888]: {
    x264: createX264AlphaEncoder,
    nvh264: createNVH264AlphaEncoder,
  },
  [WlShmFormat.xrgb8888]: {
    x264: createX264OpaqueEncoder,
    nvh264: createNVH264OpaqueEncoder,
  },
} as const

export function createEncoder(): Encoder {
  return new Encoder()
}

export class Encoder implements FrameEncoder {
  constructor(
    private _bufferFormat = 0,
    private readonly _queue: QueueElement[] = [],
    private _frameEncoder?: FrameEncoder,
    private _pngFrameEncoder?: FrameEncoder,
  ) {}

  private _doEncodeBuffer() {
    const { pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial, resolve, reject } =
      this._queue[0]

    try {
      let encodingPromise = null

      const bufferArea = bufferWidth * bufferHeight
      if (bufferArea <= config.encoder.maxPngBufferSize) {
        encodingPromise = this._encodePNGFrame(
          pixelBuffer,
          bufferFormat,
          bufferWidth,
          bufferHeight,
          bufferStride,
          serial,
        )
      } else {
        encodingPromise = this._encodeFrame(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial)
      }

      encodingPromise
        .then((encodedFrame) => {
          this._queue.shift()
          if (this._queue.length) {
            this._doEncodeBuffer()
          }
          resolve(encodedFrame)
        })
        .catch((error) => reject(error))
    } catch (e) {
      reject(e)
    }
  }

  encodeBuffer(
    pixelBuffer: unknown,
    bufferFormat: SupportedWlShmFormat,
    bufferWidth: number,
    bufferHeight: number,
    bufferStride: number,
    serial: number,
  ): Promise<EncodedFrame> {
    if (this._bufferFormat !== bufferFormat) {
      this._bufferFormat = bufferFormat
      this._frameEncoder = undefined
    }

    return new Promise<EncodedFrame>((resolve, reject) => {
      this._queue.push({ pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial, resolve, reject })
      if (this._queue.length === 1) {
        this._doEncodeBuffer()
      }
    })
  }

  private _encodePNGFrame(
    pixelBuffer: unknown,
    bufferFormat: SupportedWlShmFormat,
    bufferWidth: number,
    bufferHeight: number,
    bufferStride: number,
    serial: number,
  ): Promise<EncodedFrame> {
    if (!this._pngFrameEncoder) {
      this._pngFrameEncoder = createPNGEncoder(bufferWidth, bufferHeight, bufferFormat)
    }
    return this._pngFrameEncoder.encodeBuffer(
      pixelBuffer,
      bufferFormat,
      bufferWidth,
      bufferHeight,
      bufferStride,
      serial,
    )
  }

  private async _encodeFrame(
    pixelBuffer: unknown,
    bufferFormat: SupportedWlShmFormat,
    bufferWidth: number,
    bufferHeight: number,
    bufferStride: number,
    serial: number,
  ): Promise<EncodedFrame> {
    if (!this._frameEncoder) {
      this._frameEncoder = types[bufferFormat][config.encoder.h264Encoder](bufferWidth, bufferHeight, bufferFormat)
    }
    return this._frameEncoder.encodeBuffer(pixelBuffer, bufferFormat, bufferWidth, bufferHeight, bufferStride, serial)
  }
}
