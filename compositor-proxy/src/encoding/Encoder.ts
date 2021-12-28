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

export function createEncoder(wlClient: unknown): Encoder {
  return new Encoder(config.encoder.h264Encoder, wlClient)
}

export class Encoder {
  private readonly nativeEncoder: unknown
  private encodingResolve?: (frame_sample: Buffer) => void
  private encodingPromise?: Promise<Buffer>

  constructor(private readonly encoderType: typeof config.encoder.h264Encoder, wlClient: unknown) {
    this.nativeEncoder = appEndpointNative.createEncoder(this.encoderType, wlClient, (buffer: Buffer) => {
      this.encodingPromise = undefined
      this.encodingResolve?.(buffer)
      this.encodingResolve = undefined
    })
  }

  encodeBuffer(bufferId: number, serial: number): Promise<Buffer> {
    if (this.encodingPromise !== undefined) {
      return this.encodingPromise.then(() => this.encodeBuffer(bufferId, serial))
    }
    this.encodingPromise = new Promise<Buffer>((resolve) => {
      this.encodingResolve = resolve
      appEndpointNative.encodeBuffer(this.nativeEncoder, bufferId, serial)
    })
    return this.encodingPromise
  }

  requestKeyUnit(): void {
    appEndpointNative.requestKeyUnit(this.nativeEncoder)
  }
}
