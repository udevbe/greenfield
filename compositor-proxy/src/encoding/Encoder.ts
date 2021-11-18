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
  separateAlpha: boolean
  alpha?: Buffer
  encodingType: number
}

export function createEncoder(wlClient: unknown): FrameEncoder {
  return new Encoder(config.encoder.h264Encoder, wlClient)
}

class Encoder implements FrameEncoder {
  private readonly nativeEncoder: unknown
  private inProgressEncodingContext: Partial<EncodingContext> = {}
  private encodingResolve?: (value: EncodingContext | PromiseLike<EncodingContext>) => void
  private encodingContextPromise?: Promise<EncodingContext>

  constructor(private readonly encoderType: typeof config.encoder.h264Encoder, wlClient: unknown) {
    this.nativeEncoder = appEndpointNative.createEncoder(
      this.encoderType,
      wlClient,
      (buffer: Buffer, separateAlpha, encodingType) => {
        this.inProgressEncodingContext.encodingType = encodingType
        this.inProgressEncodingContext.opaque = buffer
        this.inProgressEncodingContext.separateAlpha = separateAlpha
        this.checkEncodingProgress()
      },
      (alpha: Buffer) => {
        this.inProgressEncodingContext.alpha = alpha
        this.checkEncodingProgress()
      },
    )
  }

  async encodeBuffer(bufferId: number, serial: number): Promise<EncodedFrame> {
    if (this.encodingContextPromise !== undefined) {
      return this.encodingContextPromise.then(() => this.encodeBuffer(bufferId, serial))
    }
    this.encodingContextPromise = new Promise<EncodingContext>((resolve) => {
      this.encodingResolve = resolve
    })
    const { width, height } = appEndpointNative.encodeBuffer(this.nativeEncoder, bufferId)
    const { alpha, encodingType, opaque } = await this.encodingContextPromise
    return EncodedFrame.create(serial, encodingType, width, height, opaque, alpha)
  }

  private checkEncodingProgress() {
    if (
      this.inProgressEncodingContext.opaque !== undefined &&
      this.inProgressEncodingContext.separateAlpha !== undefined &&
      (this.inProgressEncodingContext.alpha !== undefined || !this.inProgressEncodingContext.separateAlpha) &&
      this.inProgressEncodingContext.encodingType !== undefined
    ) {
      const encodingContext: EncodingContext = {
        encodingType: this.inProgressEncodingContext.encodingType,
        opaque: this.inProgressEncodingContext.opaque,
        alpha: this.inProgressEncodingContext.alpha,
        separateAlpha: this.inProgressEncodingContext.separateAlpha,
      }
      this.inProgressEncodingContext = {}
      if (this.encodingResolve === undefined) {
        throw new Error('BUG! Encoding resolve should not be undefined at this point.')
      }
      this.encodingResolve(encodingContext)
      this.encodingResolve = undefined
      this.encodingContextPromise = undefined
    }
  }
}
