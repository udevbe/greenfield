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

import { unmarshallArgs } from './wayland-server.js'
import { createEncoder, Encoder } from './encoding/Encoder.js'

import { createLogger } from './Logger.js'
import wlSurfaceInterceptor from './protocol/wl_surface_interceptor.js'
import { FrameFeedback } from './FrameFeedback.js'
import { incrementAndGetNextBufferSerial, ProxyBuffer } from './ProxyBuffer.js'
import { Channel, createFeedbackChannel, createFrameDataChannel } from './Channel.js'

const logger = createLogger('surface-buffer-encoding')

function ensureFrameFeedback(wlSurfaceInterceptor: wlSurfaceInterceptor): FrameFeedback {
  const nativeClientSession = wlSurfaceInterceptor.userData.nativeClientSession
  if (nativeClientSession === undefined) {
    throw new Error('BUG. Created a wlSurfaceInterceptor without a nativeClientSession')
  }

  if (wlSurfaceInterceptor.frameFeedback === undefined) {
    const feedbackChannel = createFeedbackChannel(
      nativeClientSession.id,
      wlSurfaceInterceptor.id,
      wlSurfaceInterceptor.userData.nativeClientSession.nativeAppContext,
    )
    const frameFeedback = new FrameFeedback(
      wlSurfaceInterceptor.wlClient,
      wlSurfaceInterceptor.userData.messageInterceptors,
      feedbackChannel,
    )
    wlSurfaceInterceptor.frameFeedback = frameFeedback
    nativeClientSession.destroyListeners.push(() => {
      frameFeedback.destroy()
    })
  }
  return wlSurfaceInterceptor.frameFeedback
}

function ensureFrameDataChannel(wlSurfaceInterceptor: wlSurfaceInterceptor): Channel {
  const nativeClientSession = wlSurfaceInterceptor.userData.nativeClientSession
  if (nativeClientSession === undefined) {
    throw new Error('BUG. Created a wlSurfaceInterceptor without a nativeClientSession')
  }

  if (wlSurfaceInterceptor.frameDataChannel === undefined) {
    wlSurfaceInterceptor.frameDataChannel = createFrameDataChannel(
      wlSurfaceInterceptor.userData.nativeClientSession.id,
      wlSurfaceInterceptor.userData.nativeClientSession.nativeAppContext,
    )
    nativeClientSession.destroyListeners.push(() => {
      wlSurfaceInterceptor.frameDataChannel.close()
    })
  }
  return wlSurfaceInterceptor.frameDataChannel
}

export function initSurfaceBufferEncoding(): void {
  /**
   * destroy: [R]equest w opcode [0] = R0
   */
  wlSurfaceInterceptor.prototype.R0 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    if (this.encoder) {
      this.encoder.destroy()
    }
    if (this.frameFeedback) {
      if (this.surfaceState) {
        this.frameFeedback.sendBufferReleaseEvent(this.surfaceState.bufferResourceId)
        this.surfaceState = undefined
      }
      this.frameFeedback.destroy()
      this.frameFeedback = undefined
    }
    return {
      native: false,
      browser: true,
      neverReplies: true,
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
      let proxyBuffer = this.userData.messageInterceptors[this.pendingBufferResourceId]
      if (proxyBuffer === undefined) {
        proxyBuffer = new ProxyBuffer(this.userData.messageInterceptors, this.pendingBufferResourceId)
        this.userData.messageInterceptors[this.pendingBufferResourceId] = proxyBuffer
      }

      proxyBuffer.destroyListeners.push(this.pendingBufferDestroyListener)
    }

    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }

  /**
   * damage: [R]equest w opcode [2] = R2
   */
  wlSurfaceInterceptor.prototype.R2 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
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
      neverReplies: true,
    }
  }

  /**
   * set_opaque_region: [R]equest w opcode [4] = R4
   */
  wlSurfaceInterceptor.prototype.R4 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }

  /**
   * set_input_region: [R]equest w opcode [5] = R5
   */
  wlSurfaceInterceptor.prototype.R5 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
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
      this.encoder = createEncoder(
        this.userData.nativeClientSession.nativeAppContext.session,
        this.wlClient,
        this.userData.drmContext,
      )
    }

    const frameFeedback = ensureFrameFeedback(this)
    const frameDataChannel = ensureFrameDataChannel(this)
    const commitTimestamp = performance.now()

    const bufferContentSerial = incrementAndGetNextBufferSerial()
    const msg = new Uint32Array([7, new Uint32Array(message.buffer)[0], bufferContentSerial])
    this.userData.protocolChannel.send(Buffer.from(msg.buffer, msg.byteOffset, msg.byteLength))

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
        this.pendingFrameCallbacksIds = []
        this.surfaceState = {
          bufferResourceId: this.pendingBufferResourceId,
          encodingPromise: encodeAndSendBuffer({
            frameDataChannel,
            encoder: this.encoder,
            bufferContentSerial,
            bufferResourceId: this.pendingBufferResourceId,
            bufferCreationSerial: proxyBuffer.creationSerial,
          }).then(() => {
            frameFeedback.encodingDone(commitTimestamp)
          }),
        }
        this.pendingBufferResourceId = undefined
        frameFeedback.commitNotify(frameCallbacksIds)
      }
    } else if (this.surfaceState) {
      const frameCallbacksIds = this.pendingFrameCallbacksIds ?? []
      this.pendingFrameCallbacksIds = []
      frameFeedback.commitNotify(frameCallbacksIds)
    }

    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }

  /**
   * enter
   */
  wlSurfaceInterceptor.prototype.R7 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }

  /**
   * leave
   */
  wlSurfaceInterceptor.prototype.R8 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }

  /**
   * set_buffer_transform
   */
  wlSurfaceInterceptor.prototype.R9 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }

  /**
   * set_buffer_scale
   */
  wlSurfaceInterceptor.prototype.R10 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }

  /**
   * damage_buffer
   */
  wlSurfaceInterceptor.prototype.R11 = function (_message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }) {
    return {
      native: false,
      browser: true,
      neverReplies: true,
    }
  }
}

function encodeAndSendBuffer(args: {
  frameDataChannel: Channel
  encoder: Encoder
  bufferResourceId: number
  bufferCreationSerial: number
  bufferContentSerial: number
}) {
  return args.encoder
    .encodeBuffer(args)
    .then((nodeBuffer) => {
      // FIXME check buffer result, can have an empty size if encoding pipeline was ended
      // send buffer contents. bufferId + chunk
      args.frameDataChannel.send(nodeBuffer)
    })
    .catch((e: Error) => {
      logger.error(`\tname: ${e.name} message: ${e.message}`)
      logger.error('error object stack: ')
      logger.error(e.stack ?? '')
    })
}
