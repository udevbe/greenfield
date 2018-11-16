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
      uint32Array[1] = ((message.size) << 16) | 6 // size + opcode
      uint32Array[2] = this.userData.bufferSerial

      const { buffer, format, width, height, stride } = Endpoint.getShmBuffer(this.wlClient, this.userData.bufferResourceId)
      this.userData.encoder.encodeBuffer(Buffer.from(buffer), format, width, height, this.userData.bufferSerial++, []).then((/** @type {EncodedFrame} */encodedFrame) => {
        console.log(encodedFrame)
      })
      return 0
    }
  }
}

module.exports = SurfaceBufferEncoding
