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

import { config } from '../config'
import appEndpointNative from './app-endpoint-encoding'
import { EncodedFrame } from './EncodedFrame'
import { FrameEncoder } from './FrameEncoder'

type EncodingContext = {
  opaque: Buffer
  alpha?: Buffer
  width: number
  height: number
  encodingType: number
}

export function createEncoder(wlClient: unknown): FrameEncoder {
  return new Encoder(config.encoder.h264Encoder, wlClient)
}

class Encoder implements FrameEncoder {
  private readonly nativeEncoder: unknown
  private readonly inProgressEncodingContext: Partial<EncodingContext> = {}
  private encodingResolve?: (value: EncodingContext | PromiseLike<EncodingContext>) => void

  constructor(private readonly encoderType: typeof config.encoder.h264Encoder, wlClient: unknown) {
    this.nativeEncoder = appEndpointNative.createEncoder(
      this.encoderType,
      wlClient,
      (buffer: Buffer, separateAlpha, encodingType) => {
        if (
          (!separateAlpha || this.inProgressEncodingContext.alpha !== undefined) &&
          this.inProgressEncodingContext.width !== undefined &&
          this.inProgressEncodingContext.height !== undefined
        ) {
          this.encodingResolve?.({
            opaque: buffer,
            encodingType,
            alpha: this.inProgressEncodingContext.alpha,
            width: this.inProgressEncodingContext.width,
            height: this.inProgressEncodingContext.height,
          })
        } else {
          this.inProgressEncodingContext.opaque = buffer
          this.inProgressEncodingContext.encodingType = encodingType
        }
      },
      (alpha: Buffer) => {
        if (
          this.inProgressEncodingContext.opaque !== undefined &&
          this.inProgressEncodingContext.width !== undefined &&
          this.inProgressEncodingContext.height !== undefined &&
          this.inProgressEncodingContext.encodingType !== undefined
        ) {
          this.encodingResolve?.({
            alpha: alpha,
            opaque: this.inProgressEncodingContext.opaque,
            width: this.inProgressEncodingContext.width,
            height: this.inProgressEncodingContext.height,
            encodingType: this.inProgressEncodingContext.encodingType,
          })
        } else {
          this.inProgressEncodingContext.alpha = alpha
        }
      },
    )
  }

  async encodeBuffer(bufferId: number, serial: number): Promise<EncodedFrame> {
    const encodingContext = await new Promise<EncodingContext>((resolve) => {
      this.encodingResolve = resolve

      const { width, height } = appEndpointNative.encodeBuffer(this.nativeEncoder, bufferId)
      if (
        this.inProgressEncodingContext.opaque !== undefined &&
        this.inProgressEncodingContext.alpha !== undefined &&
        this.inProgressEncodingContext.encodingType !== undefined
      ) {
        resolve({
          alpha: this.inProgressEncodingContext.alpha,
          opaque: this.inProgressEncodingContext.opaque,
          width,
          height,
          encodingType: this.inProgressEncodingContext.encodingType,
        })
      } else {
        this.inProgressEncodingContext.width = width
        this.inProgressEncodingContext.height = height
      }
    })

    this.resetInProgressEncodingContext()
    return EncodedFrame.create(
      serial,
      encodingContext.encodingType,
      encodingContext.width,
      encodingContext.height,
      encodingContext.opaque,
      encodingContext.alpha,
    )
  }

  private resetInProgressEncodingContext() {
    this.encodingResolve = undefined
    this.inProgressEncodingContext.alpha = undefined
    this.inProgressEncodingContext.opaque = undefined
    this.inProgressEncodingContext.width = undefined
    this.inProgressEncodingContext.height = undefined
  }
}
