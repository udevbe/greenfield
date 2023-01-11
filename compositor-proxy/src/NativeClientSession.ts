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

import { createLogger } from './Logger'
import { NativeCompositorSession } from './NativeCompositorSession'

// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_display_interceptor from './protocol/wl_display_interceptor'
// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_buffer_interceptor from './protocol/wl_buffer_interceptor'
import { ProxyFD } from './io/types'
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
import { incrementAndGetNextBufferSerial, ProxyBuffer } from './ProxyBuffer'
import { ARQDataChannel } from './ARQDataChannel'
import wl_surface_interceptor from './@types/protocol/wl_surface_interceptor'

const logger = createLogger('native-client-session')

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

function deserializeProxyFDJSON(sourceBuf: ArrayBufferView): { proxyFD: ProxyFD; bytesRead: number } {
  const proxyFDByteLength = new Uint32Array(sourceBuf.buffer, sourceBuf.byteOffset, 1)[0]
  const encodedProxyFDJSON = new Uint8Array(
    sourceBuf.buffer,
    sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT,
    proxyFDByteLength,
  )
  const proxyFDJSON = textDecoder.decode(encodedProxyFDJSON)
  const proxyFD: ProxyFD = JSON.parse(proxyFDJSON)

  const alignedProxyFDBytesLength = (proxyFDByteLength + 3) & ~3
  return { proxyFD: proxyFD, bytesRead: alignedProxyFDBytesLength + Uint32Array.BYTES_PER_ELEMENT }
}

export function createNativeClientSession(
  wlClient: unknown,
  nativeCompositorSession: NativeCompositorSession,
  protocolChannel: ARQDataChannel,
  id: string,
): NativeClientSession {
  const nativeClientSession = new NativeClientSession(wlClient, nativeCompositorSession, protocolChannel, id)
  nativeClientSession.onDestroy().then(() => {
    // userData.nativeClientSession = undefined
    if (protocolChannel.isOpen()) {
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
    const bufferCreationSerial = incrementAndGetNextBufferSerial()
    nativeClientSession.messageInterceptor.interceptors[bufferId] = new ProxyBuffer(
      nativeClientSession.messageInterceptor.interceptors,
      bufferId,
      bufferCreationSerial,
    )
    // send buffer creation notification. opcode: 2
    const msg = new Uint32Array([2, bufferId, bufferCreationSerial])
    protocolChannel.sendMessageBinary(Buffer.from(msg.buffer, msg.byteOffset, msg.byteLength))
  })

  let wasOpen = false
  protocolChannel.onError((event) => {
    logger.info(`Wayland client web socket error.`, event)
    if (!wasOpen) {
      nativeClientSession.destroy()
    }
  })
  protocolChannel.onClosed(() => {
    logger.info(`Wayland client web socket closed.`)
    nativeClientSession.destroy()
  })
  protocolChannel.onMessage((event) => {
    try {
      const message = event as Buffer
      nativeClientSession.onMessage(message)
    } catch (e) {
      logger.error('BUG? Error while processing event from compositor.', e)
      nativeClientSession.destroy()
    }
  })
  protocolChannel.onOpen(() => {
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
  public readonly messageInterceptor: MessageInterceptor

  constructor(
    public wlClient: unknown,
    private readonly nativeCompositorSession: NativeCompositorSession,
    private readonly protocolDataChannel: ARQDataChannel,
    public readonly id: string,
    private pendingWireMessages: Uint32Array[] = [],
    private pendingMessageBufferSize = 0,
    private outboundMessages: Buffer[] = [],
    private readonly inboundMessages: Uint32Array[] = [],
    private readonly wlRegistries: Record<number, unknown> = {},
    private disconnecting = false,
  ) {
    this.browserChannelOutOfBandHandlers = {
      // listen for out-of-band resource destroy. opcode: 1
      1: (payload) => this.destroyResourceSilently(payload),
    }

    const messageInterceptors: Record<number, any> = {}
    const userData: wl_surface_interceptor['userData'] = {
      peerConnection: nativeCompositorSession.peerConnection,
      protocolChannel: this.protocolDataChannel,
      drmContext: nativeCompositorSession.drmContext,
      messageInterceptors,
      nativeClientSession: this,
    }
    this.messageInterceptor = MessageInterceptor.create(
      wlClient,
      nativeCompositorSession.wlDisplay,
      wl_display_interceptor,
      userData,
      messageInterceptors,
    )
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
          const { proxyFD, bytesRead } = deserializeProxyFDJSON(inboundMessage.subarray(readOffset))
          fdsBuffer[i] = this.nativeCompositorSession.webFS.proxyFDtoNativeFD(proxyFD)
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
    if (this.protocolDataChannel.isOpen()) {
      this.protocolDataChannel.sendMessageBinary(Buffer.from(idsReply.buffer, idsReply.byteOffset, idsReply.byteLength))
    } else {
      // web socket not open, queue up reply
      this.outboundMessages.push(Buffer.from(idsReply.buffer, idsReply.byteOffset, idsReply.byteLength))
    }
  }

  flushOutboundMessageOnOpen(): void {
    this.allocateBrowserServerObjectIdsBatch()
    for (const outboundMessage of this.outboundMessages) {
      this.protocolDataChannel.sendMessageBinary(outboundMessage)
    }
    this.outboundMessages = []
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
    let fdsIntBufferSize = 1 // start with one because we start with the number of proxyfds specified
    const serializedFDs = new Array<Uint8Array>(nroFds)
    if (fdsInBuffer) {
      const fdsIn = new Uint32Array(fdsInBuffer)
      nroFds = fdsIn.length
      for (let i = 0; i < nroFds; i++) {
        const fd = fdsIn[i]
        const proxyFD: ProxyFD = {
          handle: fd,
          type: 'unknown',
          host: this.nativeCompositorSession.webFS.baseURL,
        }
        const encodedProxyFDJSON = textEncoder.encode(JSON.stringify(proxyFD))
        serializedFDs[i] = encodedProxyFDJSON
        // align fdurl size to 32bits
        fdsIntBufferSize += 1 + ((encodedProxyFDJSON.byteLength + 3) & ~3) / 4 // size (1) + data (n)
      }
    }

    const sendBuffer = new Uint32Array(1 + fdsIntBufferSize + this.pendingMessageBufferSize)
    let offset = 0
    sendBuffer[offset++] = 0 // disable out-of-band
    sendBuffer[offset++] = nroFds
    for (let i = 0; i < serializedFDs.length; i++) {
      const serializedFD = serializedFDs[i]
      sendBuffer[offset++] = serializedFD.byteLength
      new Uint8Array(sendBuffer.buffer, offset * Uint32Array.BYTES_PER_ELEMENT, serializedFD.length).set(serializedFD)
      // align offset to 32bits
      offset += ((serializedFD.byteLength + 3) & ~3) / 4
    }

    for (let i = 0; i < this.pendingWireMessages.length; i++) {
      const pendingWireMessage = this.pendingWireMessages[i]
      sendBuffer.set(pendingWireMessage, offset)
      offset += pendingWireMessage.length
    }

    if (this.protocolDataChannel.isOpen()) {
      // 1 === 'open'
      logger.debug('Client message send over websocket.')
      this.protocolDataChannel.sendMessageBinary(
        Buffer.from(sendBuffer.buffer, sendBuffer.byteOffset, sendBuffer.byteLength),
      )
    } else {
      // queue up data until the channel is open
      logger.debug('Client message queued because websocket is not open.')
      this.outboundMessages.push(Buffer.from(sendBuffer.buffer, sendBuffer.byteOffset, sendBuffer.byteLength))
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

  onMessage(receiveBuffer: Buffer): void {
    if (!this.wlClient) {
      return
    }

    const outOfBandOpcode = new Uint32Array(receiveBuffer.buffer, receiveBuffer.byteOffset, 1)[0]
    if (outOfBandOpcode) {
      logger.debug(`Received out of band message with opcode: ${outOfBandOpcode}`)
      this.browserChannelOutOfBandHandlers[outOfBandOpcode](
        new Uint8Array(receiveBuffer.buffer, receiveBuffer.byteOffset + Uint32Array.BYTES_PER_ELEMENT),
      )
    } else {
      this.onWireMessageEvents(
        new Uint32Array(receiveBuffer.buffer, receiveBuffer.byteOffset + Uint32Array.BYTES_PER_ELEMENT),
      )
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
