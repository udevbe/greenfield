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
      if (!this.userData.encoder) {
        this.userData.encoder = Encoder.create()
        this.userData.bufferSerial = 0
      }
      const [bufferResourceId, x, y] = WireMessageUtil.unmarshallArgs(message, 'oii')
      this.userData.bufferResourceId = bufferResourceId
      return 0
    }

    /**
     * commit
     * @param {{buffer: ArrayBuffer, fds: Array<number>, bufferOffset: number, consumed: number, size: number}} message
     * @return {number}
     */
    wlSurfaceInterceptor.prototype[6] = function (message) {
      // inject the frame serial in the commit message
      const origMessageBuffer = message.buffer
      message.size += Uint32Array.BYTES_PER_ELEMENT
      message.buffer = new ArrayBuffer(message.size)
      new Uint8Array(message.buffer).set(new Uint8Array(origMessageBuffer))
      const uint32Array = new Uint32Array(message.buffer)
      const objectId = uint32Array[0]
      uint32Array[1] = ((message.size) << 16) | 6 // size + opcode
      uint32Array[2] = this.userData.bufferSerial

      const { buffer, format, width, height, stride } = Endpoint.getShmBuffer(this.wlClient, this.userData.bufferResourceId)

      this.userData.encoder.encodeBuffer(Buffer.from(buffer), format, width, height, this.userData.bufferSerial++, []).then((/** @type {EncodedFrame} */encodedFrame) => {
        const bufferChunks = SurfaceBufferEncoding._toBufferChunks(encodedFrame.toBuffer(), this.userData.bufferSerial)
        bufferChunks.forEach((chunk) => {
          const sendBuffer = Buffer.concat([Buffer.from(new Uint32Array([objectId, 0]).buffer), chunk], chunk.length + (Uint32Array.BYTES_PER_ELEMENT * 2))
          this.userData.dataChannel.send(sendBuffer.buffer.slice(sendBuffer.byteOffset, sendBuffer.byteOffset + sendBuffer.byteLength))
        })
      })
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
