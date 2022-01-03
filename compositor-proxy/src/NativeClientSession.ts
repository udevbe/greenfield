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

import { URL } from 'url'
import { Endpoint, MessageInterceptor } from 'westfield-endpoint'
import { MessageEvent } from 'ws'
import { RetransmittingWebSocket } from 'retransmitting-websocket'
import wl_surface_interceptor from './@types/protocol/wl_surface_interceptor'
import { createLogger } from './Logger'
import { NativeCompositorSession } from './NativeCompositorSession'

// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_display_interceptor from './protocol/wl_display_interceptor'
// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_buffer_interceptor from './protocol/wl_buffer_interceptor'

const logger = createLogger('native-client-session')

export function createNativeClientSession(
  wlClient: unknown,
  nativeCompositorSession: NativeCompositorSession,
  retransmittingWebSocket: RetransmittingWebSocket,
): NativeClientSession {
  const messageInterceptor = MessageInterceptor.create(
    wlClient,
    nativeCompositorSession.wlDisplay,
    wl_display_interceptor,
    { communicationChannel: retransmittingWebSocket },
  )

  const nativeClientSession = new NativeClientSession(
    wlClient,
    nativeCompositorSession,
    retransmittingWebSocket,
    messageInterceptor,
  )
  nativeClientSession.onDestroy().then(() => {
    if (retransmittingWebSocket.readyState === 1 || retransmittingWebSocket.readyState === 0) {
      // retransmittingWebSocket.onerror = noopHandler
      // retransmittingWebSocket.onclose = noopHandler
      // retransmittingWebSocket.onmessage = noopHandler
      retransmittingWebSocket.close()
    }
  })

  Endpoint.setClientDestroyedCallback(wlClient, () => {
    if (nativeClientSession.destroyResolve) {
      nativeClientSession.destroyResolve()
      nativeClientSession.destroyResolve = undefined
      nativeClientSession.wlClient = undefined
    }
  })
  Endpoint.setRegistryCreatedCallback(wlClient, (wlRegistry: unknown, registryId: number) =>
    nativeClientSession.onRegistryCreated(wlRegistry, registryId),
  )
  Endpoint.setWireMessageCallback(
    wlClient,
    (wlClient: unknown, message: ArrayBuffer, objectId: number, opcode: number) =>
      nativeClientSession.onWireMessageRequest(wlClient, message, objectId, opcode),
  )
  Endpoint.setWireMessageEndCallback(wlClient, (wlClient: unknown, fdsIn: ArrayBuffer) =>
    nativeClientSession.onWireMessageEnd(wlClient, fdsIn),
  )

  Endpoint.setBufferCreatedCallback(wlClient, (bufferId: number) => {
    // eslint-disable-next-line new-cap
    messageInterceptor.interceptors[bufferId] = new wl_buffer_interceptor(
      wlClient,
      messageInterceptor.interceptors,
      1,
      null,
      null,
    )
    // send buffer creation notification. opcode: 2
    retransmittingWebSocket.send(new Uint32Array([2, bufferId]).buffer)
  })

  retransmittingWebSocket.onerror = (event) => {
    logger.info(`Wayland client web socket error.`, event)
    nativeClientSession.destroy()
  }
  retransmittingWebSocket.onclose = (event) => {
    logger.info(`Wayland client web socket closed.`)
    nativeClientSession.destroy()
  }
  retransmittingWebSocket.onmessage = (event) => {
    try {
      nativeClientSession.onMessage(event)
    } catch (e) {
      logger.error('BUG? Error while processing event from compositor.', e)
      nativeClientSession.destroy()
    }
  }

  retransmittingWebSocket.onopen = () => {
    retransmittingWebSocket.onerror = (event) => {
      logger.error(`Wayland client web socket error.`, event)
    }
    // flush out any requests that came in while we were waiting for the data channel to open.
    logger.info(`Wayland client web socket to browser is open.`)
    nativeClientSession.flushOutboundMessageOnOpen()
  }

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
    private readonly webSocketChannel: RetransmittingWebSocket,
    private readonly messageInterceptor: MessageInterceptor,
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
      // listen for file contents request. opcode: 4
      4: (payload) => this.nativeCompositorSession.appEndpointWebFS.handleWebFDContentTransferReply(payload),
      // listen for force key frame request. opcode 5
      5: (payload) => this.requestKeyFrameUnit(payload),
      // listen for force key frame now request. opcode 6
      6: (payload) => this.requestKeyFrameUnitNow(payload),
    }
  }

  /**
   * Delegates messages from the browser compositor to it's native counterpart.
   * This method is async as transferring the contents of file descriptors might take some time
   */
  private async onWireMessageEvents(receiveBuffer: Uint32Array) {
    logger.debug(`Delegating messages from browser to client. Total size: ${receiveBuffer.byteLength}`)

    if (this.inboundMessages.push(receiveBuffer) > 1) {
      return
    }

    while (this.inboundMessages.length) {
      const inboundMessage = this.inboundMessages[0]

      let readOffset = 0
      let localGlobalsEmitted = false
      while (readOffset < inboundMessage.length) {
        const fdsCount = inboundMessage[readOffset++]
        const webFdURLs: URL[] = []
        for (let i = 0; i < fdsCount; i++) {
          const { webFdURL, bytesRead } = this.nativeCompositorSession.appEndpointWebFS.deserializeWebFdURL(
            inboundMessage.subarray(readOffset),
          )
          webFdURLs.push(webFdURL)
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

        const fdsBuffer = new Uint32Array(fdsCount)
        for (let i = 0; i < webFdURLs.length; i++) {
          const webFdURL = webFdURLs[i]
          logger.debug('Waiting for webfd conversion to native fd...')
          fdsBuffer[i] = await this.nativeCompositorSession.appEndpointWebFS.handleWebFdURL(
            webFdURL,
            this.webSocketChannel,
          )
          logger.debug('...done waiting for webfd conversion to native fd.')
        }

        this.messageInterceptor.interceptEvent(objectId, opcode, {
          buffer: messageBuffer.buffer,
          fds: Array.from(fdsBuffer),
          bufferOffset: messageBuffer.byteOffset + 2 * Uint32Array.BYTES_PER_ELEMENT,
          consumed: 0,
          size: messageBuffer.length * 4 * Uint32Array.BYTES_PER_ELEMENT,
        })
        logger.debug(`Sending messages to client. Total size: ${messageBuffer.byteLength}`)
        Endpoint.sendEvents(this.wlClient, messageBuffer, fdsBuffer)
      }
      logger.debug('Flushing messages send to client.')
      Endpoint.flush(this.wlClient)

      this.inboundMessages.shift()
    }
  }

  allocateBrowserServerObjectIdsBatch(): void {
    const idsReply = new Uint32Array(1001)
    Endpoint.getServerObjectIdsBatch(this.wlClient, idsReply.subarray(1))
    // out-of-band w. opcode 6
    idsReply[0] = 6
    if (this.webSocketChannel.readyState === 1) {
      this.webSocketChannel.send(idsReply.buffer)
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
        this.webSocketChannel.send(outboundMessage)
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
        Endpoint.emitGlobals(wlRegistry)
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
      if (destination === 1) {
      } else {
        const interceptedBuffer = new Uint32Array(interceptedMessage.buffer)
        this.pendingMessageBufferSize += interceptedBuffer.length
        this.pendingWireMessages.push(interceptedBuffer)
      }

      // destination: 0 => browser only,  1 => native only, 2 => both
      logger.debug(
        `Message from client delegated to ${
          destination === 0 ? 'browser' : destination === 1 ? 'native' : 'browser and native.'
        }`,
      )
      return destination
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
    /** @type {Array<Uint8Array>} */ const serializedWebFDs = new Array(nroFds)
    if (fdsInBuffer) {
      const fdsInWithType = new Uint32Array(fdsInBuffer)
      nroFds = fdsInWithType.length / 2 // fd + type (shm or pipe) = 2
      for (let i = 0; i < nroFds; i++) {
        // TODO keep track of (web)fd in case another host wants to get it's content or issues an fd close
        const fd = fdsInWithType[i * 2]
        const fdType = fdsInWithType[i * 2 + 1]

        const serializedWebFD = this.nativeCompositorSession.appEndpointWebFS.serializeWebFD(fd, fdType)
        serializedWebFDs[i] = serializedWebFD
        // align webfdurl size to 32bits
        fdsIntBufferSize += 1 + ((serializedWebFD.byteLength + 3) & ~3) / 4 // size (1) + data (n)
      }
    }

    const sendBuffer = new Uint32Array(1 + fdsIntBufferSize + this.pendingMessageBufferSize)
    let offset = 0
    sendBuffer[offset++] = 0 // disable out-of-band
    sendBuffer[offset++] = nroFds
    serializedWebFDs.forEach((serializedWebFD) => {
      sendBuffer[offset++] = serializedWebFD.byteLength
      new Uint8Array(sendBuffer.buffer, offset * Uint32Array.BYTES_PER_ELEMENT, serializedWebFD.length).set(
        serializedWebFD,
      )
      // align offset to 32bits
      offset += ((serializedWebFD.byteLength + 3) & ~3) / 4
    })

    this.pendingWireMessages.forEach((pendingWireMessage) => {
      sendBuffer.set(pendingWireMessage, offset)
      offset += pendingWireMessage.length
    })

    if (this.webSocketChannel.readyState === 1) {
      // 1 === 'open'
      logger.debug('Client message send over websocket.')
      this.webSocketChannel.send(sendBuffer.buffer)
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
      Endpoint.destroyClient(this.wlClient)
      this.wlClient = null
    }
  }

  requestWebSocket(): void {
    this.webSocketChannel.send(Uint32Array.from([5]).buffer)
  }

  onMessage(event: MessageEvent): void {
    if (!this.wlClient) {
      return
    }

    const receiveBuffer = event.data as ArrayBufferLike
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
    Endpoint.destroyWlResourceSilently(this.wlClient, deleteObjectId)

    delete this.messageInterceptor.interceptors[deleteObjectId]
    if (deleteObjectId === 1) {
      // 1 is the display id, which means client is being disconnected
      this.disconnecting = true
    }
  }

  private requestKeyFrameUnit(payload: Uint8Array) {
    const wlSurfaceInterceptor = this.messageInterceptor.interceptors[
      new Uint32Array(payload)[0]
    ] as wl_surface_interceptor
    if (wlSurfaceInterceptor === undefined) {
      logger.error('BUG. Received a key frame unit request but no surface found that matches the request.')
    }
    wlSurfaceInterceptor.encoder.requestKeyUnit()
  }

  private requestKeyFrameUnitNow(payload: Uint8Array) {
    const uint32Payload = new Uint32Array(payload)
    const wlSurfaceInterceptor = this.messageInterceptor.interceptors[uint32Payload[0]] as wl_surface_interceptor
    if (wlSurfaceInterceptor === undefined) {
      logger.error('BUG. Received a key frame unit request but no surface found that matches the request.')
    }
    wlSurfaceInterceptor.encoder.requestKeyUnit()
    wlSurfaceInterceptor.encodeAndSendBuffer(uint32Payload[1])
  }

  onRegistryCreated(wlRegistry: unknown, registryId: number): void {
    this.wlRegistries[registryId] = wlRegistry
  }
}
