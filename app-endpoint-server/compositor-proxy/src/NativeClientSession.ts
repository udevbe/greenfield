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

import Logger from 'pino'
import { URL } from 'url'
import { Endpoint, MessageInterceptor } from 'westfield-endpoint'
import { MessageEvent } from 'ws'
import { loggerConfig } from './index'
import { NativeCompositorSession } from './NativeCompositorSession'

// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_display_interceptor from './protocol/wl_display_interceptor'
// eslint-disable-next-line camelcase,@typescript-eslint/ban-ts-comment
// @ts-ignore
import wl_buffer_interceptor from './protocol/wl_buffer_interceptor'
import { noopHandler, WebSocketChannel } from './WebSocketChannel'

const logger = Logger({
  ...loggerConfig,
  name: `native-client-session`,
})

export function createNativeClientSession(
  wlClient: unknown,
  nativeCompositorSession: NativeCompositorSession,
  webSocketChannel: WebSocketChannel,
): NativeClientSession {
  const messageInterceptor = MessageInterceptor.create(
    wlClient,
    nativeCompositorSession.wlDisplay,
    wl_display_interceptor,
    { communicationChannel: webSocketChannel },
  )

  const nativeClientSession = new NativeClientSession(
    wlClient,
    nativeCompositorSession,
    webSocketChannel,
    messageInterceptor,
  )
  nativeClientSession.onDestroy().then(() => {
    if (webSocketChannel.readyState === 1 || webSocketChannel.readyState === 0) {
      webSocketChannel.onerror = noopHandler
      webSocketChannel.onclose = noopHandler
      webSocketChannel.onmessage = noopHandler
      webSocketChannel.close()
    }
  })

  Endpoint.setClientDestroyedCallback(wlClient, () => {
    if (nativeClientSession._destroyResolve) {
      nativeClientSession._destroyResolve()
      nativeClientSession._destroyResolve = undefined
      nativeClientSession.wlClient = undefined
    }
  })
  Endpoint.setRegistryCreatedCallback(wlClient, (wlRegistry: unknown, registryId: number) =>
    nativeClientSession._onRegistryCreated(wlRegistry, registryId),
  )
  Endpoint.setWireMessageCallback(
    wlClient,
    (wlClient: unknown, message: ArrayBuffer, objectId: number, opcode: number) =>
      nativeClientSession._onWireMessageRequest(wlClient, message, objectId, opcode),
  )
  Endpoint.setWireMessageEndCallback(wlClient, (wlClient: unknown, fdsIn: ArrayBuffer) =>
    nativeClientSession._onWireMessageEnd(wlClient, fdsIn),
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
    webSocketChannel.send(new Uint32Array([2, bufferId]).buffer)
  })

  webSocketChannel.onerror = () => nativeClientSession.destroy()
  webSocketChannel.onclose = (event) => nativeClientSession._onClose()
  webSocketChannel.onmessage = (event) => nativeClientSession.onMessage(event)

  webSocketChannel.onopen = () => {
    webSocketChannel.onerror = (event) => nativeClientSession._onError()
    // flush out any requests that came in while we were waiting for the data channel to open.
    logger.info(`Web socket to browser is open.`)
    nativeClientSession._flushOutboundMessageOnOpen()
  }

  nativeClientSession._allocateBrowserServerObjectIdsBatch()

  return nativeClientSession
}

export class NativeClientSession {
  _destroyResolve?: (value: void | PromiseLike<void>) => void
  private readonly _destroyPromise = new Promise<void>((resolve) => {
    this._destroyResolve = resolve
  })
  private readonly _browserChannelOutOfBandHandlers: Record<number, (payload: Uint8Array) => void>

  constructor(
    public wlClient: unknown,
    private readonly _nativeCompositorSession: NativeCompositorSession,
    private readonly _webSocketChannel: WebSocketChannel,
    private readonly _messageInterceptor: MessageInterceptor,
    private _pendingWireMessages: Uint32Array[] = [],
    private _pendingMessageBufferSize = 0,
    private readonly _outboundMessages: ArrayBuffer[] = [],
    private readonly _inboundMessages: Uint32Array[] = [],
    private readonly _wlRegistries: Record<number, unknown> = {},
    private _disconnecting = false,
  ) {
    this._browserChannelOutOfBandHandlers = {
      // listen for out-of-band resource destroy. opcode: 1
      1: (payload) => this._destroyResourceSilently(payload),
      // listen for file contents request. opcode: 4
      4: (payload) => this._nativeCompositorSession.appEndpointWebFS.handleWebFDContentTransferReply(payload),
    }
  }

  /**
   * Delegates messages from the browser compositor to it's native counterpart.
   * This method is async as transferring the contents of file descriptors might take some time
   */
  private async onWireMessageEvents(receiveBuffer: Uint32Array) {
    if (this._inboundMessages.push(receiveBuffer) > 1) {
      return
    }

    while (this._inboundMessages.length) {
      const inboundMessage = this._inboundMessages[0]

      let readOffset = 0
      let localGlobalsEmitted = false
      while (readOffset < inboundMessage.length) {
        const fdsCount = inboundMessage[readOffset++]
        const webFdURLs: URL[] = []
        for (let i = 0; i < fdsCount; i++) {
          const { webFdURL, bytesRead } = this._nativeCompositorSession.appEndpointWebFS.deserializeWebFdURL(
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
          localGlobalsEmitted = this._emitLocalGlobals(messageBuffer)
        }

        const fdsBuffer = new Uint32Array(fdsCount)
        for (let i = 0; i < webFdURLs.length; i++) {
          const webFdURL = webFdURLs[i]
          fdsBuffer[i] = await this._nativeCompositorSession.appEndpointWebFS.handleWebFdURL(
            webFdURL,
            this._webSocketChannel,
          )
        }

        this._messageInterceptor.interceptEvent(objectId, opcode, {
          buffer: messageBuffer.buffer,
          fds: Array.from(fdsBuffer),
          bufferOffset: messageBuffer.byteOffset + 2 * Uint32Array.BYTES_PER_ELEMENT,
          consumed: 0,
          size: messageBuffer.length * 4 * Uint32Array.BYTES_PER_ELEMENT,
        })
        Endpoint.sendEvents(this.wlClient, messageBuffer, fdsBuffer)
      }
      Endpoint.flush(this.wlClient)

      this._inboundMessages.shift()
    }
  }

  _allocateBrowserServerObjectIdsBatch() {
    const idsReply = new Uint32Array(1001)
    Endpoint.getServerObjectIdsBatch(this.wlClient, idsReply.subarray(1))
    // out-of-band w. opcode 6
    idsReply[0] = 6
    if (this._webSocketChannel.readyState === 1) {
      this._webSocketChannel.send(idsReply.buffer)
    } else {
      // web socket not open, queue up reply
      this._outboundMessages.push(idsReply.buffer)
    }
  }

  _flushOutboundMessageOnOpen() {
    this._allocateBrowserServerObjectIdsBatch()
    while (this._outboundMessages.length) {
      const outboundMessage = this._outboundMessages.shift()
      if (outboundMessage) {
        this._webSocketChannel.send(outboundMessage)
      }
    }
  }

  private _emitLocalGlobals(wireMessageBuffer: Uint32Array): boolean {
    const id = wireMessageBuffer[0]
    const wlRegistry = this._wlRegistries[id]
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

  _onWireMessageRequest(wlClient: unknown, message: ArrayBuffer, objectId: number, opcode: number): number {
    if (this._disconnecting) {
      return 0
    }
    try {
      const receiveBuffer = new Uint32Array(message)
      const sizeOpcode = receiveBuffer[1]
      const size = sizeOpcode >>> 16

      const interceptedMessage = { buffer: message, fds: [], bufferOffset: 8, consumed: 0, size }
      const destination = this._messageInterceptor.interceptRequest(objectId, opcode, interceptedMessage)
      if (destination === 1) {
      } else {
        const interceptedBuffer = new Uint32Array(interceptedMessage.buffer)
        this._pendingMessageBufferSize += interceptedBuffer.length
        this._pendingWireMessages.push(interceptedBuffer)
      }

      // destination: 0 => browser only,  1 => native only, 2 => both
      return destination
    } catch (e) {
      logger.fatal('\tname: ' + e.name + ' message: ' + e.message + ' text: ' + e.text)
      logger.fatal('error object stack: ')
      logger.fatal(e.stack)
      process.exit(-1)
    }
  }

  _onWireMessageEnd(wlClient: unknown, fdsInBuffer: ArrayBuffer) {
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

        const serializedWebFD = this._nativeCompositorSession.appEndpointWebFS.serializeWebFD(fd, fdType)
        serializedWebFDs[i] = serializedWebFD
        // align webfdurl size to 32bits
        fdsIntBufferSize += 1 + ((serializedWebFD.byteLength + 3) & ~3) / 4 // size (1) + data (n)
      }
    }

    const sendBuffer = new Uint32Array(1 + fdsIntBufferSize + this._pendingMessageBufferSize)
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

    this._pendingWireMessages.forEach((pendingWireMessage) => {
      sendBuffer.set(pendingWireMessage, offset)
      offset += pendingWireMessage.length
    })

    if (this._webSocketChannel.readyState === 1) {
      // 1 === 'open'
      this._webSocketChannel.send(sendBuffer.buffer)
    } else {
      // queue up data until the channel is open
      this._outboundMessages.push(sendBuffer.buffer)
    }

    this._pendingMessageBufferSize = 0
    this._pendingWireMessages = []
  }

  onDestroy(): Promise<void> {
    return this._destroyPromise
  }

  destroy(): void {
    if (this._destroyResolve) {
      this._destroyResolve()
      this._destroyResolve = undefined
      Endpoint.destroyClient(this.wlClient)
      this.wlClient = null
    }
  }

  requestWebSocket(): void {
    this._webSocketChannel.send(Uint32Array.from([5]).buffer)
  }

  onMessage(event: MessageEvent): void {
    if (!this.wlClient) {
      return
    }

    const receiveBuffer = event.data as ArrayBufferLike
    const outOfBandOpcode = new Uint32Array(receiveBuffer, 0, 1)[0]
    if (outOfBandOpcode) {
      this._browserChannelOutOfBandHandlers[outOfBandOpcode](
        new Uint8Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT),
      )
    } else {
      this.onWireMessageEvents(new Uint32Array(receiveBuffer, Uint32Array.BYTES_PER_ELEMENT))
    }
  }

  private _destroyResourceSilently(payload: Uint8Array) {
    const deleteObjectId = new Uint32Array(payload.buffer, payload.byteOffset, 1)[0]
    Endpoint.destroyWlResourceSilently(this.wlClient, deleteObjectId)
    delete this._messageInterceptor.interceptors[deleteObjectId]
    if (deleteObjectId === 1) {
      // 1 is the display id, which means client is being disconnected
      this._disconnecting = true
    }
  }

  _onError(): void {
    logger.error(`Web socket is in error.`)
  }

  _onClose(): void {
    logger.info(`Web socket is closed.`)
    this.destroy()
  }

  _onRegistryCreated(wlRegistry: unknown, registryId: number) {
    this._wlRegistries[registryId] = wlRegistry
  }
}
