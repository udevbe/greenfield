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

import { unmarshallArgs } from 'westfield-proxy'
import { createEncoder } from './encoding/Encoder'

import { createLogger } from './Logger'
import wlSurfaceInterceptor from './protocol/wl_surface_interceptor'
import { performance } from 'perf_hooks'
import { FrameFeedback } from './FrameFeedback'
import { MessageDestination } from './NativeClientSession'

const logger = createLogger('surface-buffer-encoding')
let bufferSerial = -1

export function initSurfaceBufferEncoding(): void {
  /**
   * frame: [R]equest w opcode [3] = R3
   */
  wlSurfaceInterceptor.prototype.R3 = function (message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    const [frameCallbackId] = unmarshallArgs(message, 'n')
    if (this.frameFeedback === undefined) {
      this.frameFeedback = new FrameFeedback(this.wlClient, this.userData.messageInterceptors)
    }
    this.frameFeedback.addFrameCallbackId(frameCallbackId as number)
    // @ts-ignore
    return this.requestHandlers.frame(frameCallbackId)
  }

  /**
   * attach: [R]equest w opcode [1] = R1
   */
  wlSurfaceInterceptor.prototype.R1 = function (message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    const [bufferResourceId] = unmarshallArgs(message, 'oii')
    this.bufferResourceId = (bufferResourceId as number) || undefined

    return MessageDestination.BROWSER
  }

  /**
   * commit: [R]equest with opcode [6] = R6
   */
  wlSurfaceInterceptor.prototype.R6 = function (message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    if (!this.encoder) {
      this.encoder = createEncoder(this.wlClient, this.userData.drmContext)
    }
    const frameFeedback = this.frameFeedback
      ? this.frameFeedback
      : (this.frameFeedback = new FrameFeedback(this.wlClient, this.userData.messageInterceptors))

    this.userData.nativeClientSession?.onDestroy().then(() => frameFeedback.destroy())
    frameFeedback.commitNotify()

    let syncSerial: number

    if (this.bufferResourceId) {
      syncSerial = ++bufferSerial
      if (this.sendBufferResourceId) {
        frameFeedback.sendBufferReleaseEvent(this.sendBufferResourceId)
      }
      this.sendBufferResourceId = this.bufferResourceId
      this.bufferResourceId = 0

      this.encodeAndSendBuffer(syncSerial)
    } else {
      syncSerial = bufferSerial
    }

    // inject the frame serial in the commit message
    const origMessageBuffer = message.buffer
    message.size += Uint32Array.BYTES_PER_ELEMENT
    message.buffer = new ArrayBuffer(message.size)
    new Uint8Array(message.buffer).set(new Uint8Array(origMessageBuffer))
    const uint32Array = new Uint32Array(message.buffer)
    uint32Array[1] = (message.size << 16) | 6 // size + opcode
    uint32Array[2] = syncSerial

    return MessageDestination.BROWSER
  }

  wlSurfaceInterceptor.prototype.encodeAndSendBuffer = function (syncSerial: number) {
    const encodeStart = performance.now()
    this.encoder
      .encodeBuffer(this.sendBufferResourceId, syncSerial)
      .then((sendBuffer: Buffer) => {
        this.frameFeedback?.frameDone(encodeStart)
        // send buffer contents. opcode: 3. bufferId + chunk
        if (this.userData.communicationChannel.readyState === 1) {
          // 1 === 'open'
          this.userData.communicationChannel.send(sendBuffer)
        } // else connection was probably closed, don't attempt to send a buffer chunk
      })
      .catch((e: Error) => {
        logger.error(`\tname: ${e.name} message: ${e.message}`)
        logger.error('error object stack: ')
        logger.error(e.stack ?? '')
      })
  }
}
