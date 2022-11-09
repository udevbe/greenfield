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
  // TODO we could probably use a pool here
  // TODO implement encoder destruction
  return new Encoder(config.encoder.h264Encoder, wlClient, drmContext)
}

export class Encoder {
  private readonly nativeEncoder: unknown

  private encodingQueue: {
    resolve: (frameSample: { buffer: Buffer; serial: number }) => void
    reject: (error: Error) => void
    serial: number
    bufferResourceId: number
  }[] = []

  constructor(private readonly encoderType: typeof config.encoder.h264Encoder, wlClient: unknown, drmContext: unknown) {
    this.nativeEncoder = appEndpointNative.createEncoder(this.encoderType, wlClient, drmContext, (buffer: Buffer) => {
      // console.debug('encoding done')
      const encodingTask = this.encodingQueue.shift()
      if (encodingTask) {
        if (buffer) {
          // console.debug(`Resolve encoding ${encodingTask.serial} with success`)
          encodingTask.resolve({ buffer, serial: encodingTask.serial })
        } else {
          const e = new Error('Buffer encoding failed.')
          console.error(`\tname: ${e.name} message: ${e.message}`)
          console.error('error object stack: ')
          console.error(e.stack ?? '')
          // console.debug(`Resolve encoding ${encodingTask.serial} with error`)
          encodingTask.reject(e)
        }
      } else {
        console.error('BUG? No buffer callback')
        // TODO log better error
      }
    })
  }

  encodeBuffer(bufferResourceId: number, serial: number): Promise<{ buffer: Buffer; serial: number }> {
    return new Promise<{ buffer: Buffer; serial: number }>((resolve, reject) => {
      this.encodingQueue.push({ resolve, reject, serial, bufferResourceId })
      appEndpointNative.encodeBuffer(this.nativeEncoder, bufferResourceId, serial)
    })
  }

  requestKeyUnit(): void {
    appEndpointNative.requestKeyUnit(this.nativeEncoder)
  }
}
