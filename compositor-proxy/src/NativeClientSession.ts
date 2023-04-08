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
  setSyncDoneCallback,
  setWireMessageCallback,
  setWireMessageEndCallback,
} from 'westfield-proxy'
import { ProxyBuffer } from './ProxyBuffer'
import type { Channel } from './Channel'
import wl_surface_interceptor from './@types/protocol/wl_surface_interceptor'
import { sendClientConnectionsDisconnect } from './SignalingController'
import { createAudioEncoder, destroyAudioEncoder } from './encoding/proxy-encoding-addon'
import { createAudioChannel } from './Channel'

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
  // TODO Add an extra audio Channel to send audio data to the browser. This happens nearly identical as how the protocol channels is set up.

  protocolChannel: Channel,
  id: string,
): NativeClientSession {
  // Creates the native audio encoder struct and wraps it in a javascript object. We can't use this javascript object directly, instead we pass it to other
  // javascript functions that will call into native code that will know how to unwrap and use the struct.
  const audioChannel = createAudioChannel(id)
  const audioEncoder = createAudioEncoder(wlClient, (sample) => {
    audioChannel.send(sample)
  })
  const nativeClientSession = new NativeClientSession(wlClient, nativeCompositorSession, protocolChannel, id)
  // Cleanup the native struct and free the natively allocated memory.
  nativeClientSession.destroyListeners.push(() => {
    audioChannel.close()
    destroyAudioEncoder(audioEncoder)
  })

  setClientDestroyedCallback(wlClient, () => {
    for (const destroyListener of nativeClientSession.destroyListeners) {
      destroyListener()
    }
    if ((nativeClientSession.hasCompositorState = true)) {
      sendClientConnectionsDisconnect(id)
    }
    nativeClientSession.destroyListeners = []
  })
  setRegistryCreatedCallback(wlClient, (wlRegistry: unknown, registryId: number) => {
    nativeClientSession.onRegistryCreated(wlRegistry, registryId)
  })
  setSyncDoneCallback(wlClient, (callbackId: number) => {
    nativeClientSession.onNativeSyncDone(callbackId)
  })
  setWireMessageCallback(wlClient, (wlClient: unknown, message: ArrayBuffer, objectId: number, opcode: number) => {
    return nativeClientSession.onWireMessageRequest(wlClient, message, objectId, opcode)
  })
  setWireMessageEndCallback(wlClient, (wlClient: unknown, fdsIn: ArrayBuffer) => {
    nativeClientSession.onWireMessageEnd(wlClient, fdsIn)
  })

  setBufferCreatedCallback(wlClient, (bufferId: number) => {
    let proxyBuffer: ProxyBuffer = nativeClientSession.messageInterceptor.interceptors[bufferId]
    if (proxyBuffer === undefined) {
      proxyBuffer = new ProxyBuffer(nativeClientSession.messageInterceptor.interceptors, bufferId)
      nativeClientSession.messageInterceptor.interceptors[bufferId] = proxyBuffer
    }
    // send buffer creation notification. opcode: 2
    const msg = new Uint32Array([2, bufferId, proxyBuffer.creationSerial])
    protocolChannel.send(Buffer.from(msg.buffer, msg.byteOffset, msg.byteLength))
  })

  protocolChannel.onClose = () => {
    logger.info(`Wayland client protocol channel is closed.`)
  }
  protocolChannel.onMessage = (event) => {
    try {
      nativeClientSession.onMessage(event)
    } catch (e) {
      logger.error('BUG? Error while processing event from compositor.', e)
      nativeClientSession.destroy()
    }
  }
  protocolChannel.onOpen = () => {
    // flush out any requests that came in while we were waiting for the data channel to open.
    logger.info(`Wayland client connection to browser is open.`)
    nativeClientSession.hasCompositorState = true
    nativeClientSession.flushOutboundMessageOnOpen()
  }

  nativeClientSession.allocateBrowserServerObjectIdsBatch()

  return nativeClientSession
}

type SyncDone = {
  nativeDone: boolean
  browserDone: boolean
  // syncDoneMessage?: Uint32Array
  serial: number
  callbackId: number
  fastSync: boolean
}

export class NativeClientSession {
  private readonly browserChannelOutOfBandHandlers: Record<number, (payload: Uint8Array) => void>
  public readonly messageInterceptor: MessageInterceptor

  private syncDones: SyncDone[] = []
  private lastEventSerial = 0

  constructor(
    public wlClient: unknown,
    private readonly nativeCompositorSession: NativeCompositorSession,
    private readonly protocolDataChannel: Channel,
    public readonly id: string,
    private pendingWireMessages: Uint32Array[] = [],
    private pendingMessageBufferSize = 0,
    private outboundMessages: Buffer[] = [],
    private readonly wlRegistries: Record<number, unknown> = {},
    private disconnecting = false,
    public destroyListeners: (() => void)[] = [],
    public hasCompositorState = false,
    private fastSync = true,
  ) {
    this.browserChannelOutOfBandHandlers = {
      // listen for out-of-band resource destroy. opcode: 1
      1: (payload) => this.destroyResourceSilently(payload),
    }
    this.destroyListeners.push(() => {
      this.protocolDataChannel.close()
    })

    const messageInterceptors: Record<number, any> = {}
    const userData: wl_surface_interceptor['userData'] = {
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
  private onWireMessageEvents(lastEventSerial: number, inboundMessage: Uint32Array) {
    this.lastEventSerial = lastEventSerial
    // logger.debug(`Delegating messages from browser to client. Total size: ${receiveBuffer.byteLength}`)

    let readOffset = 0
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

      // check if browser compositor is emitting globals, if so, emit the local globals as well.
      this.emitLocalGlobals(messageBuffer)

      this.messageInterceptor.interceptEvent(objectId, opcode, {
        buffer: messageBuffer.buffer,
        fds: Array.from(fdsBuffer),
        bufferOffset: messageBuffer.byteOffset + 2 * Uint32Array.BYTES_PER_ELEMENT,
        consumed: 0,
        size: messageBuffer.length * 4 * Uint32Array.BYTES_PER_ELEMENT,
      })
      // logger.debug(`Sending messages to client. Total size: ${messageBuffer.byteLength}`)

      const syncDoneState = this.syncDones.find(({ callbackId }) => callbackId === objectId)
      if (syncDoneState) {
        syncDoneState.browserDone = true
        this.sendIfSyncDone(syncDoneState)
      } else {
        sendEvents(this.wlClient, messageBuffer, fdsBuffer)
      }
    }
    logger.debug('Flushing messages send to client.')

    flush(this.wlClient)
  }

  allocateBrowserServerObjectIdsBatch(): void {
    const idsReply = new Uint32Array(1001)
    getServerObjectIdsBatch(this.wlClient, idsReply.subarray(1))
    // out-of-band w. opcode 6
    idsReply[0] = 6
    if (this.protocolDataChannel.isOpen) {
      this.protocolDataChannel.send(Buffer.from(idsReply.buffer, idsReply.byteOffset, idsReply.byteLength))
    } else {
      this.outboundMessages.push(Buffer.from(idsReply.buffer, idsReply.byteOffset, idsReply.byteLength))
    }
  }

  flushOutboundMessageOnOpen(): void {
    for (const outboundMessage of this.outboundMessages) {
      this.protocolDataChannel.send(outboundMessage)
    }
    this.outboundMessages = []
  }

  private emitLocalGlobals(wireMessageBuffer: Uint32Array): void {
    const id = wireMessageBuffer[0]
    const wlRegistry = this.wlRegistries[id]
    if (wlRegistry) {
      const sizeOpcode = wireMessageBuffer[1]
      const messageOpcode = sizeOpcode & 0x0000ffff
      const globalOpcode = 0
      const firstBrowserGlobal = 4294901761
      if (messageOpcode === globalOpcode && wireMessageBuffer[2] === firstBrowserGlobal) {
        emitGlobals(wlRegistry)
      }
    }
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

      if (objectId === 1 && opcode === 0) {
        // If we encounter a display sync request, we have to intercept the corresponding callback event
        // and delay its delivery until both the browser & native requests have been processed else
        // we risk sending a done event too early.
        const callbackId = receiveBuffer[2]

        this.syncDones.push({
          nativeDone: false,
          browserDone: this.fastSync,
          serial: this.lastEventSerial,
          callbackId,
          fastSync: this.fastSync,
        })
        // intercept sync request and handle it through the fast sync routine avoiding a round-trip to the compositor
        destination.browser = !this.fastSync
        this.fastSync = true
        // console.log(`objectId: ${objectId}, opcode:${opcode}`)
        // console.log(`sync dones: ${JSON.stringify(this.syncDones)}`)
        // console.log(`resetting fastSync to ${this.fastSync}`)
      } else {
        // console.log(`objectId: ${objectId}, opcode:${opcode}`)
        this.fastSync = this.fastSync && (destination.neverReplies ?? false)
        // console.log(`destination: ${JSON.stringify(destination)}, updated fastSync to ${this.fastSync}`)
      }

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

    if (this.protocolDataChannel.isOpen) {
      // 1 === 'open'
      logger.debug('Client message send over protocol channel.')
      this.protocolDataChannel.send(Buffer.from(sendBuffer.buffer, sendBuffer.byteOffset, sendBuffer.byteLength))
    } else {
      // queue up data until the channel is open
      logger.debug('Client message queued because websocket is not open.')
      this.outboundMessages.push(Buffer.from(sendBuffer.buffer, sendBuffer.byteOffset, sendBuffer.byteLength))
    }

    this.pendingMessageBufferSize = 0
    this.pendingWireMessages = []
  }

  destroy(): void {
    if (!this.wlClient) {
      return
    }

    const wlClient = this.wlClient
    this.wlClient = undefined
    this.syncDones = []
    destroyClient(wlClient)
  }

  onMessage(receiveBuffer: Uint8Array): void {
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
      const lastEventSerial = new Uint32Array(receiveBuffer.buffer, receiveBuffer.byteOffset, 2)[1]
      this.onWireMessageEvents(
        lastEventSerial,
        new Uint32Array(receiveBuffer.buffer, receiveBuffer.byteOffset + 2 * Uint32Array.BYTES_PER_ELEMENT),
      )
    }
  }

  private destroyResourceSilently(payload: Uint8Array) {
    const deleteObjectId = new Uint32Array(payload.buffer, payload.byteOffset, 1)[0]

    delete this.messageInterceptor.interceptors[deleteObjectId]
    const displayId = 1
    if (deleteObjectId === displayId) {
      this.disconnecting = true
    }

    if (this.disconnecting) {
      return
    }

    // console.log(`destroyResourceSilently from compositor: ${deleteObjectId}`)
    destroyWlResourceSilently(this.wlClient, deleteObjectId)
  }

  onRegistryCreated(wlRegistry: unknown, registryId: number): void {
    this.wlRegistries[registryId] = wlRegistry
  }

  onNativeSyncDone(doneCallbackId: number) {
    const syncDone = this.syncDones.find(({ callbackId }) => callbackId === doneCallbackId)
    if (syncDone) {
      syncDone.nativeDone = true
      if (this.sendIfSyncDone(syncDone)) {
        flush(this.wlClient)
      }
    } else {
      throw new Error('BUG. No sync done entry for native sync done signal.')
    }
  }

  private sendSyncDoneEvent(syncDone: SyncDone) {
    // console.log(`Sending sync done: ${JSON.stringify(syncDone)}`)
    if (syncDone.fastSync) {
      const doneSize = 12 // id+size+opcode+time arg
      const deleteSize = 12 // id+size+opcode+id arg

      const messagesBuffer = new ArrayBuffer(doneSize + deleteSize)

      // send done event to callback
      const doneBufu32 = new Uint32Array(messagesBuffer)
      const doneBufu16 = new Uint16Array(messagesBuffer)
      doneBufu32[0] = syncDone.callbackId
      doneBufu16[2] = 0 // done opcode
      doneBufu16[3] = doneSize
      doneBufu32[2] = syncDone.serial

      // send delete id event to display
      const deleteBufu32 = new Uint32Array(messagesBuffer, doneSize)
      const deleteBufu16 = new Uint16Array(messagesBuffer, doneSize)
      deleteBufu32[0] = 1
      deleteBufu16[2] = 1 // delete opcode
      deleteBufu16[3] = deleteSize
      deleteBufu32[2] = syncDone.callbackId

      sendEvents(this.wlClient, doneBufu32, new Uint32Array([]))
      delete this.messageInterceptor.interceptors[syncDone.callbackId]
      destroyWlResourceSilently(this.wlClient, syncDone.callbackId)
    } else {
      const doneSize = 12 // id+size+opcode+time arg

      const messagesBuffer = new ArrayBuffer(doneSize)

      // send done event to callback
      const doneBufu32 = new Uint32Array(messagesBuffer)
      const doneBufu16 = new Uint16Array(messagesBuffer)
      doneBufu32[0] = syncDone.callbackId
      doneBufu16[2] = 0 // done opcode
      doneBufu16[3] = doneSize
      doneBufu32[2] = syncDone.serial

      sendEvents(this.wlClient, doneBufu32, new Uint32Array([]))
    }
  }

  private destroySyncDone(syncDone: SyncDone) {
    const deleteSize = 12 // id+size+opcode+time arg

    const messagesBuffer = new ArrayBuffer(deleteSize)

    // send delete id event to display
    const deleteBufu32 = new Uint32Array(messagesBuffer, deleteSize)
    const deleteBufu16 = new Uint16Array(messagesBuffer, deleteSize)
    deleteBufu32[0] = 1
    deleteBufu16[2] = 1 // delete opcode
    deleteBufu16[3] = deleteSize
    deleteBufu32[2] = syncDone.callbackId

    sendEvents(this.wlClient, deleteBufu32, new Uint32Array([]))

    destroyWlResourceSilently(this.wlClient, syncDone.callbackId)
  }

  private sendIfSyncDone(syncDone: SyncDone): boolean {
    if (this.syncDones[0] !== syncDone) {
      return false
    }

    if (syncDone.browserDone && syncDone.nativeDone) {
      this.syncDones.shift()
      this.sendSyncDoneEvent(syncDone)
      // fire all continues consecutive fast syncs
      while (this.syncDones.length) {
        const sortedSyncDone = this.syncDones[0]
        if (!sortedSyncDone.browserDone || !sortedSyncDone.nativeDone) {
          break
        }
        this.syncDones.shift()
        this.sendSyncDoneEvent(sortedSyncDone)
      }

      return true
    }

    return false
  }
}
