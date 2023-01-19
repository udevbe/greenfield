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
import { FrameFeedback } from './FrameFeedback'
import { incrementAndGetNextBufferSerial, ProxyBuffer } from './ProxyBuffer'
import { createFrameDataChannel } from './ARQDataChannel'

const logger = createLogger('surface-buffer-encoding')

function ensureFrameFeedback(wlSurfaceInterceptor: wlSurfaceInterceptor): FrameFeedback {
  if (wlSurfaceInterceptor.frameFeedback === undefined) {
    const frameFeedback = new FrameFeedback(
      wlSurfaceInterceptor.wlClient,
      wlSurfaceInterceptor.userData.messageInterceptors,
    )
    wlSurfaceInterceptor.frameFeedback = frameFeedback
    wlSurfaceInterceptor.userData.nativeClientSession.onDestroy().then(() => {
      frameFeedback.destroy()
    })
  }
  return wlSurfaceInterceptor.frameFeedback
}

function ensureFrameDataChannel(wlSurfaceInterceptor: wlSurfaceInterceptor) {
  if (wlSurfaceInterceptor.frameDataChannel === undefined) {
    wlSurfaceInterceptor.frameDataChannel = createFrameDataChannel(
      wlSurfaceInterceptor.userData.peerConnectionState,
      wlSurfaceInterceptor.userData.nativeClientSession.id,
    )
    wlSurfaceInterceptor.userData.nativeClientSession.onDestroy().then(() => {
      if (wlSurfaceInterceptor.frameDataChannel.isOpen()) {
        wlSurfaceInterceptor.frameDataChannel.close()
      }
    })
  }
}

export function initSurfaceBufferEncoding(): void {
  /**
   * destroy: [R]equest w opcode [0] = R0
   */
  wlSurfaceInterceptor.prototype.R0 = function (message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    if (this.frameFeedback) {
      if (this.surfaceState) {
        this.frameFeedback.sendBufferReleaseEvent(this.surfaceState.bufferResourceId)
        this.surfaceState = undefined
      }
      this.frameFeedback.destroy()
      this.frameFeedback = undefined
    }
    this.destroyed = true
    return {
      native: false,
      browser: true,
    }
  }

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
    if (this.pendingFrameCallbacksIds) {
      this.pendingFrameCallbacksIds.push(frameCallbackId as number)
    } else {
      this.pendingFrameCallbacksIds = [frameCallbackId as number]
    }
    // @ts-ignore
    this.requestHandlers.frame(frameCallbackId)
    return {
      native: false,
      browser: false,
    }
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
    if (this.pendingBufferDestroyListener === undefined) {
      this.pendingBufferDestroyListener = () => (this.pendingBufferResourceId = undefined)
    }

    if (this.pendingBufferResourceId) {
      const proxyBuffer = this.userData.messageInterceptors[this.pendingBufferResourceId] as ProxyBuffer
      proxyBuffer.destroyListeners = proxyBuffer.destroyListeners.filter(
        (listener) => listener !== this.pendingBufferDestroyListener,
      )
    }

    const [bufferResourceId] = unmarshallArgs(message, 'oii')
    this.pendingBufferResourceId = bufferResourceId as number

    if (this.pendingBufferResourceId) {
      const proxyBuffer = this.userData.messageInterceptors[this.pendingBufferResourceId] as ProxyBuffer
      proxyBuffer.destroyListeners.push(this.pendingBufferDestroyListener)
    }

    return {
      native: false,
      browser: true,
    }
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
    if (this.bufferDestroyListener === undefined) {
      this.bufferDestroyListener = () => {
        this.surfaceState = undefined
      }
    }
    if (!this.encoder) {
      this.encoder = createEncoder(this.wlClient, this.userData.drmContext)
    }

    const frameFeedback = ensureFrameFeedback(this)

    const bufferContentSerial = incrementAndGetNextBufferSerial()

    if (this.pendingBufferResourceId !== undefined) {
      if (this.surfaceState && this.surfaceState.bufferResourceId !== this.pendingBufferResourceId) {
        const previousProxyBuffer = this.userData.messageInterceptors[this.surfaceState.bufferResourceId] as ProxyBuffer
        this.surfaceState.encodingPromise.then(() => {
          if (!previousProxyBuffer.destroyed) {
            frameFeedback.sendBufferReleaseEvent(previousProxyBuffer.bufferId)
          }
        })
        previousProxyBuffer.destroyListeners = previousProxyBuffer.destroyListeners.filter(
          (listener) => listener !== this.bufferDestroyListener,
        )
      }
      this.surfaceState = undefined

      if (this.pendingBufferResourceId) {
        const proxyBuffer = this.userData.messageInterceptors[this.pendingBufferResourceId] as ProxyBuffer
        proxyBuffer.destroyListeners = proxyBuffer.destroyListeners.filter(
          (listener) => listener !== this.pendingBufferDestroyListener,
        )
        proxyBuffer.destroyListeners.push(this.bufferDestroyListener)

        const frameCallbacksIds = this.pendingFrameCallbacksIds ?? []
        this.pendingFrameCallbacksIds = []
        this.surfaceState = {
          bufferResourceId: this.pendingBufferResourceId,
          encodingPromise: this.encodeAndSendBuffer({
            bufferContentSerial,
            bufferResourceId: this.pendingBufferResourceId,
            bufferCreationSerial: proxyBuffer.creationSerial,
          }),
        }
        this.pendingBufferResourceId = undefined
        frameFeedback.commitNotify(this.surfaceState, frameCallbacksIds, () => this.destroyed)
      }
    } else if (this.surfaceState) {
      const frameCallbacksIds = this.pendingFrameCallbacksIds ?? []
      this.pendingFrameCallbacksIds = []
      frameFeedback.commitNotify(this.surfaceState, frameCallbacksIds, () => this.destroyed)
    }

    // inject the buffer content serial in the commit message
    const origMessageBuffer = message.buffer
    message.size += Uint32Array.BYTES_PER_ELEMENT
    message.buffer = new ArrayBuffer(message.size)
    new Uint8Array(message.buffer).set(new Uint8Array(origMessageBuffer))
    const uint32Array = new Uint32Array(message.buffer)
    uint32Array[1] = (message.size << 16) | 6 // size + opcode
    uint32Array[2] = bufferContentSerial

    return {
      native: false,
      browser: true,
    }
  }
}

wlSurfaceInterceptor.prototype.encodeAndSendBuffer = function (args) {
  ensureFrameDataChannel(this)
  return this.encoder
    .encodeBuffer(args)
    .then((nodeBuffer) => {
      const bufferView = new DataView(nodeBuffer.buffer)
      // FIXME check buffer result, can have an empty size if encoding pipeline was ended
      // send buffer sent started marker. opcode: 1. surfaceId + syncSerial
      const startMarker = new Uint32Array([1, this.id, bufferView.getUint32(8, true)])
      this.userData.protocolChannel.sendMessageBinary(
        Buffer.from(startMarker.buffer, startMarker.byteOffset, startMarker.byteLength),
      )
      // send buffer contents. bufferId + chunk
      this.frameDataChannel.sendMessageBinary(nodeBuffer)
    })
    .catch((e: Error) => {
      logger.error(`\tname: ${e.name} message: ${e.message}`)
      logger.error('error object stack: ')
      logger.error(e.stack ?? '')
    })
}
