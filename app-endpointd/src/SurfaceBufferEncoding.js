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
    wlSurfaceInterceptor.prototype[1] = function (message) {
      const [bufferResourceId, x, y] = WireMessageUtil.unmarshallArgs(message, 'oii')
      this.bufferResourceId = bufferResourceId
      return 0
    }

    /**
     * commit
     * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} message
     * @return {number}
     */
    wlSurfaceInterceptor.prototype[6] = function (message) {
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
        this.encoder.encodeBuffer(Buffer.from(buffer), format, width, height, syncSerial, []).then((/** @type {EncodedFrame} */encodedFrame) => {
          const bufferChunks = SurfaceBufferEncoding._toBufferChunks(encodedFrame.toBuffer(), encodedFrame.serial)
          bufferChunks.forEach((chunk) => {
            // send buffer contents. opcode: 3. bufferId + chunk
            const sendBuffer = Buffer.concat([Buffer.from(new Uint32Array([3, bufferId]).buffer), chunk])
            if (this.userData.communicationChannel.readyState === 'open') {
              this.userData.communicationChannel.send(sendBuffer.buffer.slice(sendBuffer.byteOffset, sendBuffer.byteOffset + sendBuffer.byteLength))
            } // else connection was probably closed, don't attempt to send a buffer chunk
          })
        })
      }

      return 0
    }
  }

  /**
   * @param {Buffer}buffer
   * @param {number}serial
   * @return {Buffer[]}
   * @private
   */
  static _toBufferChunks (buffer, serial) {
    // certain webrtc implementations don't like it when data is > 16kb, so have have to split our buffer in chunks
    const chunkSize = 16 * (1024 - 12) // 1012 because we reserve another 12 for the chunk header 1012+12=1024
    let nroChunks = 1
    if (buffer.length > chunkSize) {
      nroChunks = Math.ceil(buffer.length / chunkSize)
    }

    const chunks = []
    let chunkIdx = nroChunks
    while (chunkIdx > 0) {
      chunkIdx--
      const chunkHeader = Buffer.allocUnsafe(12)
      chunkHeader.writeUInt32BE(serial, 0, true)
      chunkHeader.writeUInt32BE(nroChunks, 4, true)
      chunkHeader.writeUInt32BE(chunkIdx, 8, true)
      const chunkStart = chunkIdx * chunkSize
      const chunkEnd = chunkStart + chunkSize
      const bufferChunk = Buffer.concat([chunkHeader, buffer.slice(chunkStart, chunkEnd)])
      chunks.push(bufferChunk)
    }
    return chunks
  }
}

module.exports = SurfaceBufferEncoding
