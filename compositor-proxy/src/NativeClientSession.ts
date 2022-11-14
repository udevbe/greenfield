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

import type { WebSocketLike } from 'retransmitting-websocket'
import { ReadyState } from 'retransmitting-websocket'
import { createLogger } from './Logger'
import { NativeCompositorSession } from './NativeCompositorSession'

// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_display_interceptor from './protocol/wl_display_interceptor'
// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_buffer_interceptor from './protocol/wl_buffer_interceptor'
import { Webfd } from './webfs/types'
import { TextDecoder, TextEncoder } from 'util'
import {
  destroyClient,
  destroyWlResourceSilently,
  emitGlobals,
  flush,
  getServerObjectIdsBatch,
  MessageInterceptor,
  sendEvents,
  setBufferCreatedCallback,
  setClientDestroyedCallback,
  setRegistryCreatedCallback,
  setWireMessageCallback,
  setWireMessageEndCallback,
} from 'westfield-proxy'
import { ProxyBuffer } from './ProxyBuffer'

const logger = createLogger('native-client-session')

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

function deserializeWebFDJSON(sourceBuf: ArrayBufferView): { webfd: Webfd; bytesRead: number } {
  const webFDByteLength = new Uint32Array(sourceBuf.buffer, sourceBuf.byteOffset, 1)[0]
  const encodedWebfdJSON = new Uint8Array(
    sourceBuf.buffer,
    sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT,
    webFDByteLength,
  )
  const webfdJSON = textDecoder.decode(encodedWebfdJSON)
  const webfd: Webfd = JSON.parse(webfdJSON)

  const alignedWebFDBytesLength = (webFDByteLength + 3) & ~3
  return { webfd, bytesRead: alignedWebFDBytesLength + Uint32Array.BYTES_PER_ELEMENT }
}

export function createNativeClientSession(
  wlClient: unknown,
  nativeCompositorSession: NativeCompositorSession,
  protocolChannel: WebSocketLike,
  frameDataChannel: WebSocketLike,
): NativeClientSession {
  const messageInterceptors: Record<number, any> = {}
  const userData: {
    protocolChannel: WebSocketLike
    frameDataChannel: WebSocketLike
    messageInterceptors: Record<number, any>
    drmContext: unknown
    nativeClientSession?: NativeClientSession
  } = {
    frameDataChannel,
    protocolChannel,
    drmContext: nativeCompositorSession.drmContext,
    messageInterceptors,
  }
  const messageInterceptor = MessageInterceptor.create(
    wlClient,
    nativeCompositorSession.wlDisplay,
    wl_display_interceptor,
    userData,
    messageInterceptors,
  )

  const nativeClientSession = new NativeClientSession(
    wlClient,
    nativeCompositorSession,
    protocolChannel,
    messageInterceptor,
  )
  userData.nativeClientSession = nativeClientSession
  nativeClientSession.onDestroy().then(() => {
    userData.nativeClientSession = undefined
    if (protocolChannel.readyState === 1 || protocolChannel.readyState === 0) {
      // retransmittingWebSocket.onerror = noopHandler
      // retransmittingWebSocket.onclose = noopHandler
      // retransmittingWebSocket.onmessage = noopHandler
      protocolChannel.close()
    }
  })

  setClientDestroyedCallback(wlClient, () => {
    if (nativeClientSession.destroyResolve) {
      nativeClientSession.destroyResolve()
      nativeClientSession.destroyResolve = undefined
      nativeClientSession.wlClient = undefined
    }
  })
  setRegistryCreatedCallback(wlClient, (wlRegistry: unknown, registryId: number) =>
    nativeClientSession.onRegistryCreated(wlRegistry, registryId),
  )
  setWireMessageCallback(wlClient, (wlClient: unknown, message: ArrayBuffer, objectId: number, opcode: number) =>
    nativeClientSession.onWireMessageRequest(wlClient, message, objectId, opcode),
  )
  setWireMessageEndCallback(wlClient, (wlClient: unknown, fdsIn: ArrayBuffer) =>
    nativeClientSession.onWireMessageEnd(wlClient, fdsIn),
  )

  setBufferCreatedCallback(wlClient, (bufferId: number) => {
    messageInterceptor.interceptors[bufferId] = new ProxyBuffer(messageInterceptor.interceptors, bufferId)
    // send buffer creation notification. opcode: 2
    protocolChannel.send(new Uint32Array([2, bufferId]).buffer)
  })

  let wasOpen = false
  protocolChannel.addEventListener('error', (event) => {
    logger.info(`Wayland client web socket error.`, event)
    if (!wasOpen) {
      nativeClientSession.destroy()
    }
  })
  protocolChannel.addEventListener('close', () => {
    logger.info(`Wayland client web socket closed.`)
    nativeClientSession.destroy()
  })
  protocolChannel.addEventListener('message', (event) => {
    try {
      nativeClientSession.onMessage(event.data as ArrayBuffer)
    } catch (e) {
      logger.error('BUG? Error while processing event from compositor.', e)
      nativeClientSession.destroy()
    }
  })
  protocolChannel.addEventListener('open', () => {
    wasOpen = true
    // flush out any requests that came in while we were waiting for the data channel to open.
    logger.info(`Wayland client web socket to browser is open.`)
    nativeClientSession.flushOutboundMessageOnOpen()
  })

  nativeClientSession.allocateBrowserServerObjectIdsBatch()

  return nativeClientSession
}

export class NativeClientSession {
  destroyResolve?: (value: void | PromiseLike<void>) => void
  private readonly destroyPromise = new Promise<void>((resolve) => {
    this.destroyResolve = resolve
  })
  private readonly browserChannelOutOfBandHandlers: Record<number, (payload: Uint8Array) => void>

  constructor(
    public wlClient: unknown,
    private readonly nativeCompositorSession: NativeCompositorSession,
    private readonly webSocket: WebSocketLike,
    public readonly messageInterceptor: MessageInterceptor,
    private pendingWireMessages: Uint32Array[] = [],
    private pendingMessageBufferSize = 0,
    private readonly outboundMessages: ArrayBuffer[] = [],
    private readonly inboundMessages: Uint32Array[] = [],
    private readonly wlRegistries: Record<number, unknown> = {},
    private disconnecting = false,
  ) {
    this.browserChannelOutOfBandHandlers = {
      // listen for out-of-band resource destroy. opcode: 1
      1: (payload) => this.destroyResourceSilently(payload),
    }
  }

  /**
   * Delegates messages from the browser compositor to its native counterpart.
   */
  private onWireMessageEvents(receiveBuffer: Uint32Array) {
    // logger.debug(`Delegating messages from browser to client. Total size: ${receiveBuffer.byteLength}`)

    if (this.inboundMessages.push(receiveBuffer) > 1) {
      return
    }

    while (this.inboundMessages.length) {
      const inboundMessage = this.inboundMessages[0]

      let readOffset = 0
      let localGlobalsEmitted = false
      while (readOffset < inboundMessage.length) {
        const fdsCount = inboundMessage[readOffset++]
        const fdsBuffer = new Uint32Array(fdsCount)
        for (let i = 0; i < fdsCount; i++) {
          const { webfd, bytesRead } = deserializeWebFDJSON(inboundMessage.subarray(readOffset))
          fdsBuffer[i] = this.nativeCompositorSession.webFS.webFDtoNativeFD(webfd)
          readOffset += bytesRead / Uint32Array.BYTES_PER_ELEMENT
        }

        const objectId = inboundMessage[readOffset]
        const sizeOpcode = inboundMessage[readOffset + 1]
        const size = sizeOpcode >>> 16
        const opcode = sizeOpcode & 0x0000ffff

        const length = size / Uint32Array.BYTES_PER_ELEMENT
        const messageBuffer = inboundMessage.subarray(readOffset, readOffset + length)
        readOffset += length

        if (!localGlobalsEmitted) {
          // check if browser compositor is emitting globals, if so, emit the local globals as well.
          localGlobalsEmitted = this.emitLocalGlobals(messageBuffer)
        }

        this.messageInterceptor.interceptEvent(objectId, opcode, {
          buffer: messageBuffer.buffer,
          fds: Array.from(fdsBuffer),
          bufferOffset: messageBuffer.byteOffset + 2 * Uint32Array.BYTES_PER_ELEMENT,
          consumed: 0,
          size: messageBuffer.length * 4 * Uint32Array.BYTES_PER_ELEMENT,
        })
        // logger.debug(`Sending messages to client. Total size: ${messageBuffer.byteLength}`)
        sendEvents(this.wlClient, messageBuffer, fdsBuffer)
      }
      logger.debug('Flushing messages send to client.')
      flush(this.wlClient)

      this.inboundMessages.shift()
    }
  }

  allocateBrowserServerObjectIdsBatch(): void {
    const idsReply = new Uint32Array(1001)
    getServerObjectIdsBatch(this.wlClient, idsReply.subarray(1))
    // out-of-band w. opcode 6
    idsReply[0] = 6
    if (this.webSocket.readyState === 1) {
      this.webSocket.send(idsReply.buffer)
    } else {
      // web socket not open, queue up reply
      this.outboundMessages.push(idsReply.buffer)
    }
  }

  flushOutboundMessageOnOpen(): void {
    this.allocateBrowserServerObjectIdsBatch()
    while (this.outboundMessages.length) {
      const outboundMessage = this.outboundMessages.shift()
      if (outboundMessage) {
        this.webSocket.send(outboundMessage)
      }
    }
  }

  private emitLocalGlobals(wireMessageBuffer: Uint32Array): boolean {
    const id = wireMessageBuffer[0]
    const wlRegistry = this.wlRegistries[id]
    if (wlRegistry) {
      const sizeOpcode = wireMessageBuffer[1]
      const messageOpcode = sizeOpcode & 0x0000ffff
      const globalOpcode = 0
      if (messageOpcode === globalOpcode) {
        emitGlobals(wlRegistry)
        return true
      }
    }
    return false
  }

  onWireMessageRequest(wlClient: unknown, message: ArrayBuffer, objectId: number, opcode: number): number {
    logger.debug(
      `Received messages from client, will delegate. Size: ${message.byteLength}, object-id: ${objectId}, opcode: ${opcode}`,
    )
    if (this.disconnecting) {
      return 0
    }
    try {
      const receiveBuffer = new Uint32Array(message)
      const sizeOpcode = receiveBuffer[1]
      const size = sizeOpcode >>> 16

      const interceptedMessage = { buffer: message, fds: [], bufferOffset: 8, consumed: 0, size }
      const destination = this.messageInterceptor.interceptRequest(objectId, opcode, interceptedMessage)

      if (destination.browser) {
        const interceptedBuffer = new Uint32Array(interceptedMessage.buffer)
        this.pendingMessageBufferSize += interceptedBuffer.length
        this.pendingWireMessages.push(interceptedBuffer)
      }

      return destination.native ? 1 : 0
    } catch (e: any) {
      logger.fatal(`\tname: ${e.name} message: ${e.message} text: ${e.text}`)
      logger.fatal('error object stack: ')
      logger.fatal(e.stack)
      process.exit(-1)
    }
  }

  onWireMessageEnd(wlClient: unknown, fdsInBuffer: ArrayBuffer): void {
    logger.debug('Received end of client message.')
    let nroFds = 0
    let fdsIntBufferSize = 1 // start with one because we start with the number of webfds specified
    const serializedWebFDs = new Array<Uint8Array>(nroFds)
    if (fdsInBuffer) {
      const fdsInWithType = new Uint32Array(fdsInBuffer)
      nroFds = fdsInWithType.length
      for (let i = 0; i < nroFds; i++) {
        const fd = fdsInWithType[i]
        const webfd: Webfd = {
          handle: fd,
          type: 'unknown',
          host: this.nativeCompositorSession.webFS.baseURL,
        }
        const serializedWebFD = textEncoder.encode(JSON.stringify(webfd))
        serializedWebFDs[i] = serializedWebFD
        // align webfdurl size to 32bits
        fdsIntBufferSize += 1 + ((serializedWebFD.byteLength + 3) & ~3) / 4 // size (1) + data (n)
      }
    }

    const sendBuffer = new Uint32Array(1 + fdsIntBufferSize + this.pendingMessageBufferSize)
    let offset = 0
    sendBuffer[offset++] = 0 // disable out-of-band
    sendBuffer[offset++] = nroFds
    for (let i = 0; i < serializedWebFDs.length; i++) {
      const serializedWebFD = serializedWebFDs[i]
      sendBuffer[offset++] = serializedWebFD.byteLength
      new Uint8Array(sendBuffer.buffer, offset * Uint32Array.BYTES_PER_ELEMENT, serializedWebFD.length).set(
        serializedWebFD,
      )
      // align offset to 32bits
      offset += ((serializedWebFD.byteLength + 3) & ~3) / 4
    }

    for (let i = 0; i < this.pendingWireMessages.length; i++) {
      const pendingWireMessage = this.pendingWireMessages[i]
      sendBuffer.set(pendingWireMessage, offset)
      offset += pendingWireMessage.length
    }

    if (this.webSocket.readyState === ReadyState.OPEN) {
      // 1 === 'open'
      logger.debug('Client message send over websocket.')
      this.webSocket.send(sendBuffer.buffer)
    } else {
      // queue up data until the channel is open
      logger.debug('Client message queued because websocket is not open.')
      this.outboundMessages.push(sendBuffer.buffer)
    }

    this.pendingMessageBufferSize = 0
    this.pendingWireMessages = []
  }

  onDestroy(): Promise<void> {
    return this.destroyPromise
  }

  destroy(): void {
    if (this.destroyResolve) {
      this.destroyResolve()
      this.destroyResolve = undefined
      destroyClient(this.wlClient)
      this.wlClient = null
    }
  }

  requestWebSocket(): void {
    this.webSocket.send(Uint32Array.from([5]).buffer)
  }

  onMessage(receiveBuffer: ArrayBuffer): void {
    if (!this.wlClient) {
      return
    }

    const outOfBandOpcode = new Uint32Array(receiveBuffer, 0, 1)[0]
    if (outOfBandOpcode) {
      logger.debug(`Received out of band message with opcode: ${outOfBandOpcode}`)
      this.browserChannelOutOfBandHandlers[outOfBandOpcode](
        new Uint8Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT),
      )
    } else {
      this.onWireMessageEvents(new Uint32Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT))
    }
  }

  private destroyResourceSilently(payload: Uint8Array) {
    const deleteObjectId = new Uint32Array(payload.buffer, payload.byteOffset, 1)[0]
    delete this.messageInterceptor.interceptors[deleteObjectId]
    if (deleteObjectId === 1) {
      // 1 is the display id, which means client is being disconnected
      this.disconnecting = true
    }

    if (this.disconnecting) {
      return
    }

    destroyWlResourceSilently(this.wlClient, deleteObjectId)
  }

  onRegistryCreated(wlRegistry: unknown, registryId: number): void {
    this.wlRegistries[registryId] = wlRegistry
  }
}
