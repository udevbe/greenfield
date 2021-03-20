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

import Logger from 'pino'
import { EncodedFrame } from './encoding/EncodedFrame'
import { loggerConfig } from './index'

import { Encoder } from './encoding/Encoder'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import wlSurfaceInterceptor from './protocol/wl_surface_interceptor'
import { Endpoint, WireMessageUtil } from 'westfield-endpoint'

const logger = Logger({
  ...loggerConfig,
  name: `buffer-encoding`,
})
let bufferSerial = -1

export class SurfaceBufferEncoding {
  static init(): void {
    /**
     * attach, [R]equest w opcode [1]
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wlSurfaceInterceptor.prototype.R1 = function (message: {
      buffer: ArrayBuffer
      fds: Array<number>
      bufferOffset: number
      consumed: number
      size: number
    }) {
      const [bufferResourceId] = WireMessageUtil.unmarshallArgs(message, 'oii')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.bufferResourceId = bufferResourceId || null
      // logger.debug(`Buffer attached with id: serial=${bufferSerial}, id=${this.bufferResourceId}`)

      return 0
    }

    /**
     * commit, [R]equest with opcode [6]
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    wlSurfaceInterceptor.prototype.R6 = function (message: {
      buffer: ArrayBuffer
      fds: Array<number>
      bufferOffset: number
      consumed: number
      size: number
    }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!this.encoder) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.encoder = Encoder.create()
      }

      const syncSerial = ++bufferSerial

      // inject the frame serial in the commit message
      const origMessageBuffer = message.buffer
      message.size += Uint32Array.BYTES_PER_ELEMENT
      message.buffer = new ArrayBuffer(message.size)
      new Uint8Array(message.buffer).set(new Uint8Array(origMessageBuffer))
      const uint32Array = new Uint32Array(message.buffer)
      uint32Array[1] = (message.size << 16) | 6 // size + opcode
      uint32Array[2] = syncSerial

      // logger.debug(`Buffer committed: serial=${syncSerial}, id=${this.bufferResourceId}`)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (this.bufferResourceId) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const bufferId = this.bufferResourceId
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.bufferResourceId = 0

        const { buffer, format, width, height, stride } = Endpoint.getShmBuffer(this.wlClient, bufferId)
        // logger.debug(`Request buffer encoding: serial=${syncSerial}, id=${bufferId}`)
        // console.log('|- Awaiting buffer encoding.')
        // const start = Date.now()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.encoder
          .encodeBuffer(buffer, format, width, height, stride, syncSerial)
          .then((encodedFrame: EncodedFrame) => {
            // console.log(`|--> Buffer encoding took: ${Date.now() - start}`)
            // logger.debug(`Buffer encoding finished: serial=${syncSerial}, id=${bufferId}`)

            // send buffer contents. opcode: 3. bufferId + chunk
            const sendBuffer = Buffer.concat([
              Buffer.from(new Uint32Array([3, bufferId]).buffer),
              encodedFrame.toBuffer(),
            ])
            if (this.userData.communicationChannel.readyState === 1) {
              // 1 === 'open'
              // logger.debug(`Sending buffer contents: serial=${syncSerial}, id=${bufferId}`)
              this.userData.communicationChannel.send(
                sendBuffer.buffer.slice(sendBuffer.byteOffset, sendBuffer.byteOffset + sendBuffer.byteLength),
              )
            } // else connection was probably closed, don't attempt to send a buffer chunk
          })
          .catch((e: Error) => {
            logger.error('\tname: ' + e.name + ' message: ' + e.message)
            logger.error('error object stack: ')
            logger.error(e.stack ?? '')
          })
      }

      return 0
    }
  }
}
