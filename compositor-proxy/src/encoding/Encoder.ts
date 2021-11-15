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
import { EncodedFrameFragment } from './EncodedFrameFragment'
import { enableFullFrame, enableSplitAlpha } from './EncodingOptions'
import { h264 } from './EncodingTypes'
import { FrameEncoder } from './FrameEncoder'

type EncodingContext = {
  opaque: Buffer
  alpha?: Buffer
  width: number
  height: number
}

type EncodingResult = {
  encodedFrame: EncodedFrameFragment
  width: number
  height: number
}

export function createEncoder(wlClient: unknown, bufferId: number): FrameEncoder {
  return new Encoder(config.encoder.h264Encoder, wlClient, bufferId)
}

class Encoder implements FrameEncoder {
  private readonly nativeEncoder: unknown
  private readonly inProgressEncodingContext: Partial<EncodingContext> = {}
  private encodingResolve?: (value: EncodingContext | PromiseLike<EncodingContext>) => void

  constructor(
    private readonly encoderName: typeof config.encoder.h264Encoder,
    private readonly wlClient: unknown,
    bufferId: number,
  ) {
    this.nativeEncoder = appEndpointNative.createEncoder(
      this.encoderName,
      this.wlClient,
      bufferId,
      (opaqueH264: Buffer, separateAlpha) => {
        if (
          (!separateAlpha || this.inProgressEncodingContext.alpha !== undefined) &&
          this.inProgressEncodingContext.width !== undefined &&
          this.inProgressEncodingContext.height !== undefined
        ) {
          this.encodingResolve?.({
            opaque: opaqueH264,
            alpha: this.inProgressEncodingContext.alpha,
            width: this.inProgressEncodingContext.width,
            height: this.inProgressEncodingContext.height,
          })
        } else {
          this.inProgressEncodingContext.opaque = opaqueH264
        }
      },
      (alphaH264: Buffer) => {
        if (
          this.inProgressEncodingContext.opaque !== undefined &&
          this.inProgressEncodingContext.width !== undefined &&
          this.inProgressEncodingContext.height !== undefined
        ) {
          this.encodingResolve?.({
            alpha: alphaH264,
            opaque: this.inProgressEncodingContext.opaque,
            width: this.inProgressEncodingContext.width,
            height: this.inProgressEncodingContext.height,
          })
        } else {
          this.inProgressEncodingContext.alpha = alphaH264
        }
      },
    )
  }

  async encodeBuffer(bufferId: number, serial: number): Promise<EncodedFrame> {
    let encodingOptions = 0
    encodingOptions = enableSplitAlpha(encodingOptions)
    encodingOptions = enableFullFrame(encodingOptions)
    const { encodedFrame, width, height } = await this.encodeFragment(bufferId)
    return EncodedFrame.create(serial, h264, encodingOptions, width, height, encodedFrame)
  }

  private resetInProgressEncodingContext() {
    this.encodingResolve = undefined
    this.inProgressEncodingContext.alpha = undefined
    this.inProgressEncodingContext.opaque = undefined
    this.inProgressEncodingContext.width = undefined
    this.inProgressEncodingContext.height = undefined
  }

  private async encodeFragment(bufferId: number): Promise<EncodingResult> {
    const encodingContext = await new Promise<EncodingContext>((resolve) => {
      this.encodingResolve = resolve

      const { width, height } = appEndpointNative.encodeBuffer(this.nativeEncoder, this.wlClient, bufferId)

      if (this.inProgressEncodingContext.opaque !== undefined && this.inProgressEncodingContext.alpha !== undefined) {
        resolve({
          alpha: this.inProgressEncodingContext.alpha,
          opaque: this.inProgressEncodingContext.opaque,
          width,
          height,
        })
      } else {
        this.inProgressEncodingContext.width = width
        this.inProgressEncodingContext.height = height
      }
    })

    this.resetInProgressEncodingContext()
    return {
      encodedFrame: EncodedFrameFragment.create(encodingContext.opaque, encodingContext.alpha ?? Buffer.allocUnsafe(0)),
      width: encodingContext.width,
      height: encodingContext.height,
    }
  }
}
