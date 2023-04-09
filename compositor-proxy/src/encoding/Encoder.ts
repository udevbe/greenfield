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
import appEndpointNative from './proxy-encoding-addon'

export function createEncoder(wlClient: unknown, drmContext: unknown): Encoder {
  // TODO we could probably use a pool here?
  // TODO implement encoder destruction
  return new Encoder(config.encoder.h264Encoder, wlClient, drmContext)
}

export class Encoder {
  private readonly nativeEncoder: unknown

  private encodingQueue: {
    resolve: (frameSample: Buffer) => void
    reject: (error: Error) => void
    bufferResourceId: number
    bufferContentSerial: number
  }[] = []

  constructor(private readonly encoderType: typeof config.encoder.h264Encoder, wlClient: unknown, drmContext: unknown) {
    this.nativeEncoder = appEndpointNative.createFrameEncoder(
      this.encoderType,
      wlClient,
      drmContext,
      (buffer: Buffer) => {
        const encodingTask = this.encodingQueue.shift()
        if (encodingTask) {
          if (buffer) {
            // console.debug(`Resolve encoding ${encodingTask.bufferContentSerial} with success`)
            encodingTask.resolve(buffer)
          } else {
            const e = new Error('Buffer encoding failed.')
            console.error(`\tname: ${e.name} message: ${e.message}`)
            console.error('error object stack: ')
            console.error(e.stack ?? '')
            console.debug(`Resolve encoding ${encodingTask.bufferContentSerial} with error`)
            encodingTask.reject(e)
          }
        } else {
          console.error('BUG? No buffer callback')
          // TODO log better error
        }
      },
    )
  }

  encodeBuffer({
    bufferResourceId,
    bufferCreationSerial,
    bufferContentSerial,
  }: {
    bufferResourceId: number
    bufferCreationSerial: number
    bufferContentSerial: number
  }): Promise<Buffer> {
    // console.debug(`Start encoding: ${bufferContentSerial}`)
    return new Promise<Buffer>((resolve, reject) => {
      this.encodingQueue.push({ resolve, reject, bufferResourceId, bufferContentSerial })
     
      appEndpointNative.encodeFrame(this.nativeEncoder, bufferResourceId, bufferContentSerial, bufferCreationSerial)
    })
  }

  requestKeyUnit(): void {
    appEndpointNative.requestKeyUnit(this.nativeEncoder)
  }

  destroy() {
    appEndpointNative.destroyFrameEncoder(this.nativeEncoder)
  }
}
