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

'use strict'

const Logger = require('pino')
const logger = Logger({
  name: `buffer-encoding`,
  prettyPrint: (process.env.DEBUG && process.env.DEBUG == true)
})

const { WireMessageUtil, Endpoint } = require('westfield-endpoint')

const wlSurfaceInterceptor = require('./protocol/wl_surface_interceptor')
const Encoder = require('./encoding/Encoder')

class SurfaceBufferEncoding {
  static init () {

    /**
     * attach
     * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} message
     * @return {number}
     */
    wlSurfaceInterceptor.prototype.R1 = function (message) {
      const [bufferResourceId, x, y] = WireMessageUtil.unmarshallArgs(message, 'oii')
      this.bufferResourceId = bufferResourceId
      return 0
    }

    /**
     * commit
     * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} message
     * @return {number}
     */
    wlSurfaceInterceptor.prototype.R6 = function (message) {
      if (!this.encoder) {
        this.encoder = Encoder.create()
        this.bufferSerial = -1
      }

      const syncSerial = ++this.bufferSerial

      // inject the frame serial in the commit message
      const origMessageBuffer = message.buffer
      message.size += Uint32Array.BYTES_PER_ELEMENT
      message.buffer = new ArrayBuffer(message.size)
      new Uint8Array(message.buffer).set(new Uint8Array(origMessageBuffer))
      const uint32Array = new Uint32Array(message.buffer)
      uint32Array[1] = ((message.size) << 16) | 6 // size + opcode
      uint32Array[2] = syncSerial

      if (this.bufferResourceId) {
        const bufferId = this.bufferResourceId
        this.bufferResourceId = 0

        const { buffer, format, width, height } = Endpoint.getShmBuffer(this.wlClient, bufferId)
        this.encoder.encodeBuffer(Buffer.from(buffer), format, width, height, syncSerial).then((/** @type {EncodedFrame} */encodedFrame) => {
          // send buffer contents. opcode: 3. bufferId + chunk
          const sendBuffer = Buffer.concat([Buffer.from(new Uint32Array([3, bufferId]).buffer), encodedFrame.toBuffer()])
          if (this.userData.communicationChannel.readyState === 1) { // 1 === 'open'
            this.userData.communicationChannel.send(sendBuffer.buffer.slice(sendBuffer.byteOffset, sendBuffer.byteOffset + sendBuffer.byteLength))
          } // else connection was probably closed, don't attempt to send a buffer chunk
        }).catch(e => {
          logger.error('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
          logger.error('error object stack: ')
          logger.error(e.stack)
        })
      }

      return 0
    }
  }
}

module.exports = SurfaceBufferEncoding
