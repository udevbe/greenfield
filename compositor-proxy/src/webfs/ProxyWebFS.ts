import fs from 'fs'
import type { WebSocketLike } from 'retransmitting-websocket'
import {
  CloseEventLike,
  ErrorEventLike,
  MessageEventLike,
  ReadyState,
} from 'retransmitting-websocket/dist/RetransmittingWebSocket'
import { Duplex, Transform } from 'stream'
import { URL } from 'url'

import { TextDecoder, TextEncoder } from 'util'
import { Endpoint } from 'westfield-endpoint'

import WebSocket, { createWebSocketStream } from 'ws'
import { config } from '../config'
import { createLogger } from '../Logger'

const logger = createLogger('webfs')

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

enum FDType {
  ARRAY_BUFFER = 1 as const,
  MESSAGE_PORT = 2 as const,
}

function deserializeWebFdURL(sourceBuf: ArrayBufferView): { webFdURL: URL; bytesRead: number } {
  const webFDByteLength = new Uint32Array(sourceBuf.buffer, sourceBuf.byteOffset, 1)[0]
  const fdURLUint8Array = new Uint8Array(
    sourceBuf.buffer,
    sourceBuf.byteOffset + Uint32Array.BYTES_PER_ELEMENT,
    webFDByteLength,
  )
  const fdURLString = textDecoder.decode(fdURLUint8Array)
  const webFdURL = new URL(fdURLString)
  // sort so we can do string comparison of urls
  webFdURL.searchParams.sort()

  const alignedWebFDBytesLength = (webFDByteLength + 3) & ~3
  return { webFdURL, bytesRead: alignedWebFDBytesLength + Uint32Array.BYTES_PER_ELEMENT }
}

/**
 * Returns a native write pipe fd that -when written- will transfer its data to the given websocket
 * @param fdCommunicationChannel
 */
function toPipeWriteFD(fdCommunicationChannel: WebSocketLike): number {
  const resultBuffer = new Uint32Array(2)
  Endpoint.makePipe(resultBuffer)
  const readFd = resultBuffer[0]

  const fileReadStream = fs.createReadStream('ignored', {
    fd: readFd,
    autoClose: true,
    highWaterMark: TRANSFER_CHUNK_SIZE,
  })

  const websocketStream =
    fdCommunicationChannel instanceof WebSocket
      ? createWebSocketStream(fdCommunicationChannel)
      : webSocketStream(fdCommunicationChannel)
  if (fdCommunicationChannel.readyState === ReadyState.CONNECTING) {
    fdCommunicationChannel.addEventListener('open', () => {
      fileReadStream.pipe(websocketStream)
    })
  } else {
    fileReadStream.pipe(websocketStream)
  }
  return resultBuffer[1]
}

function webSocketStream(socket: WebSocketLike): Duplex {
  const proxy = new Transform({
    autoDestroy: true,
    allowHalfOpen: false,
    emitClose: true,
    objectMode: false,
  })
  proxy._write = (chunk, enc, next) => {
    // avoid errors, this never happens unless
    // destroy() is called
    if (socket.readyState !== ReadyState.OPEN) {
      next()
      return
    }
    try {
      // FIXME make retransmitting websocket support done callback as extra argument
      socket.send(chunk)
    } catch (err: any) {
      return next(err)
    }
    next()
  }
  proxy.on('close', () => {
    if (socket.readyState === ReadyState.OPEN) {
      socket.close(4000, '')
    }
  })

  socket.addEventListener('close', (closeDetails: CloseEventLike) => {
    if (!proxy.destroyed) {
      proxy.end()
    }
  })
  socket.addEventListener('error', (err: ErrorEventLike) => proxy.destroy(err.error))
  socket.addEventListener('message', (event: MessageEventLike) => proxy.push(Buffer.from(event.data as ArrayBuffer)))

  return proxy
}

// 64*1024=64kb
export const TRANSFER_CHUNK_SIZE = 65792 as const

export function createCompositorProxyWebFS(compositorSessionId: string): AppEndpointWebFS {
  const baseURL = config.public.baseURL
  const localWebFDBaseURL = new URL(baseURL)

  return new AppEndpointWebFS(compositorSessionId, localWebFDBaseURL)
}

export class AppEndpointWebFS {
  constructor(
    private compositorSessionId: string,
    private localWebFDBaseURL: URL,
    private webFDTransferRequests: Record<string, (data: Uint8Array) => void> = {},
  ) {}

  toNativeFD(
    serializedWebFD: ArrayBufferView,
    compositorWebSocket: WebSocketLike,
  ): { fd: number | Promise<number>; bytesRead: number } {
    const { webFdURL, bytesRead } = deserializeWebFdURL(serializedWebFD)
    const fd = this.webFDtoNativeFD(webFdURL, compositorWebSocket)
    return { fd, bytesRead }
  }

  handleWebFDContentTransferReply(payload: Uint8Array): void {
    // payload = fdURLByteSize (4 bytes) + fdURL (aligned to 4 bytes) + contents
    const { webFdURL, bytesRead } = deserializeWebFdURL(payload)
    const webFDTransfer = this.webFDTransferRequests[webFdURL.href]
    delete this.webFDTransferRequests[webFdURL.href]
    webFDTransfer(payload.subarray(bytesRead))
  }

  toSerializedWebFD(fd: number, fdType: number): Uint8Array {
    let type
    switch (fdType) {
      case FDType.ARRAY_BUFFER:
        type = 'ArrayBuffer'
        break
      case FDType.MESSAGE_PORT:
        type = 'MessagePort'
        break
      default:
        type = 'unsupported'
    }

    const webFdURL = this.createLocalWebFDURL(fd, type)
    return textEncoder.encode(webFdURL.href)
  }

  /**
   * Stream incoming data from websocket to given fd.
   * @param webSocket
   * @param query
   */
  incomingDataTransfer(webSocket: WebSocketLike, query: { fd: number }): void {
    const fd = query.fd
    const fileWriteStream = fs.createWriteStream('ignored', { fd, highWaterMark: TRANSFER_CHUNK_SIZE, autoClose: true })
    const websocketStream =
      webSocket instanceof WebSocket ? createWebSocketStream(webSocket) : webSocketStream(webSocket)

    if (webSocket.readyState === ReadyState.CONNECTING) {
      webSocket.addEventListener('open', () => {
        websocketStream.pipe(fileWriteStream)
      })
    } else {
      websocketStream.pipe(fileWriteStream)
    }
  }

  private createLocalWebFDURL(fd: number, type: string): URL {
    const localWebFDURL = new URL(this.localWebFDBaseURL.href)
    localWebFDURL.searchParams.append('compositorSessionId', `${this.compositorSessionId}`)
    localWebFDURL.searchParams.append('fd', `${fd}`)
    localWebFDURL.searchParams.append('type', type)
    localWebFDURL.searchParams.sort()
    return localWebFDURL
  }

  /**
   * Creates a native fd that matches the content & behavior of the foreign webfd
   */
  private webFDtoNativeFD(webFdURL: URL, compositorWebSocket: WebSocketLike): number | Promise<number> {
    if (
      webFdURL.host === this.localWebFDBaseURL.host &&
      webFdURL.searchParams.get('compositorSessionId') === this.compositorSessionId
    ) {
      const fd = webFdURL.searchParams.get('fd') ?? '-1'
      // the fd originally came from this process, which means we can just use it as is.
      return Number.parseInt(fd)
    } else {
      // foreign fd.
      // the fd comes from a different host. In case of shm, we need to create local shm and
      // transfer the contents of the remote fd. In case of pipe, we need to create a local pipe and transfer
      // the contents on-demand.
      return this.handleForeignWebFdURL(webFdURL, compositorWebSocket)
    }
  }

  private findFdTransferWebSocket(webFdURL: URL, compositorWebSocket: WebSocketLike): WebSocketLike | undefined {
    if (
      webFdURL.protocol === 'compositor:' &&
      this.compositorSessionId === webFdURL.searchParams.get('compositorSessionId')
    ) {
      // If the fd originated from the compositor, we can reuse the existing websocket connection to transfer the fd contents
      return compositorWebSocket
    } else if (webFdURL.protocol.startsWith('ws')) {
      // fd came from another endpoint, establish a new communication channel
      logger.info(`Establishing data transfer websocket connection to ${webFdURL.href}`)
      const webSocket = new WebSocket(webFdURL)
      webSocket.binaryType = 'arraybuffer'
      webSocket.onerror = (event) => logger.error(`Data transfer websocket is in error. ${event.message}`)
      return webSocket
    } else {
      logger.error(`Unsupported websocket URL ${webFdURL.href}.`)
    }
  }

  private handleForeignWebFdURL(webFdURL: URL, compositorWebSocket: WebSocketLike): number | Promise<number> {
    const fdTransferWebSocket = this.findFdTransferWebSocket(webFdURL, compositorWebSocket)
    if (fdTransferWebSocket === undefined) {
      return -1
    }

    let localFD: number | Promise<number> = -1
    const webFdType = webFdURL.searchParams.get('type')
    if (webFdType === null) {
      throw new Error(`BUG. WebFD URL does not have a type param: ${webFdURL.href}`)
    }
    if (webFdType === 'ArrayBuffer') {
      localFD = this.receiveForeignShmContent(fdTransferWebSocket, webFdURL)
    } else if (webFdType === 'MessagePort') {
      // because we can't distinguish between read or write end of a pipe, we always assume write-end of pipe here (as per c/p & DnD use-case in wayland protocol)
      localFD = toPipeWriteFD(fdTransferWebSocket)
    }

    return localFD
  }

  private async receiveForeignShmContent(fdTransferWebSocket: WebSocketLike, webFdURL: URL): Promise<number> {
    return new Promise<Uint8Array>((resolve, reject) => {
      // register listener for incoming content on com channel
      this.webFDTransferRequests[webFdURL.href] = resolve
      const fdParam = webFdURL.searchParams.get('fd')
      if (fdParam === null) {
        throw new Error(`BUG. No fd param from WebFD url: ${webFdURL.href}`)
      }
      const fd = Number.parseInt(fdParam)
      // request file contents. opcode: 4
      fdTransferWebSocket.send(new Uint32Array([4, fd]).buffer)
    }).then((uint8Array: Uint8Array) =>
      Endpoint.createMemoryMappedFile(Buffer.from(uint8Array.buffer, uint8Array.byteOffset)),
    )
  }

  private createSerializedPipeWebFds(): [Uint8Array, Uint8Array] {
    const pipeFds = new Uint32Array(2)
    Endpoint.makePipe(pipeFds)
    const pipeReadWebFD = this.toSerializedWebFD(pipeFds[0], FDType.MESSAGE_PORT)
    const pipeWriteWebFD = this.toSerializedWebFD(pipeFds[1], FDType.MESSAGE_PORT)

    return [pipeReadWebFD, pipeWriteWebFD]
  }

  handleCreatePipeWebFds(payload: Uint8Array): ArrayBuffer {
    const webFdRequestSerial = new Uint32Array(payload)[0]
    const pipeWebFDs = this.createSerializedPipeWebFds()

    const payloadLength =
      Uint32Array.BYTES_PER_ELEMENT + // opcode
      Uint32Array.BYTES_PER_ELEMENT + // serial
      Uint32Array.BYTES_PER_ELEMENT + // pipeReadWebFD length
      pipeWebFDs[0].byteLength +
      Uint32Array.BYTES_PER_ELEMENT + // pipeWriteWebFD length
      pipeWebFDs[1].byteLength
    const padding = (4 - (payloadLength & 3)) & 3 // 32bit padding

    const replyBuffer = new ArrayBuffer(payloadLength + padding)

    let offset = 0
    new Uint32Array(replyBuffer, offset, 1)[0] = 8 // opcode
    offset += Uint32Array.BYTES_PER_ELEMENT
    new Uint32Array(replyBuffer, offset, 1)[0] = webFdRequestSerial
    offset += Uint32Array.BYTES_PER_ELEMENT
    new Uint32Array(replyBuffer, Uint32Array.BYTES_PER_ELEMENT, 1)[0] = pipeWebFDs[0].byteLength
    offset += Uint32Array.BYTES_PER_ELEMENT
    new Uint8Array(replyBuffer, offset, pipeWebFDs[0].byteLength).set(pipeWebFDs[0])
    offset += pipeWebFDs[0].byteLength
    new Uint32Array(replyBuffer, offset, 1)[0] = pipeWebFDs[1].byteLength
    offset += Uint32Array.BYTES_PER_ELEMENT
    new Uint8Array(replyBuffer, offset, pipeWebFDs[1].byteLength).set(pipeWebFDs[1])
    offset += pipeWebFDs[1].byteLength

    return replyBuffer
  }
}