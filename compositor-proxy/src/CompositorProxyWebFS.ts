import fs from 'fs'
import { URL } from 'url'

import { TextDecoder, TextEncoder } from 'util'
import { Endpoint } from 'westfield-endpoint'
import WebsocketStream from 'websocket-stream'

import WebSocket from 'ws'
import { RetransmittingWebSocket, ErrorEventLike } from 'retransmitting-websocket'
import { config } from './config'
import { createLogger } from './Logger'

const logger = createLogger('webfs')

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

// FIXME this class is pretty broken...
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

  private _createLocalWebFDURL(fd: number, type: string): URL {
    const localWebFDURL = new URL(this.localWebFDBaseURL.href)
    localWebFDURL.searchParams.append('compositorSessionId', `${this.compositorSessionId}`)
    localWebFDURL.searchParams.append('fd', `${fd}`)
    localWebFDURL.searchParams.append('type', type)
    localWebFDURL.searchParams.sort()
    return localWebFDURL
  }

  deserializeWebFdURL(sourceBuf: ArrayBufferView): { webFdURL: URL; bytesRead: number } {
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
   * Creates a local fd that matches the content & behavior of the foreign webfd
   */
  async handleWebFdURL(webFdURL: URL, retransmittingWebSocket: RetransmittingWebSocket): Promise<number> {
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
      return this.handleForeignWebFdURL(webFdURL, retransmittingWebSocket)
    }
  }

  private findFdTransferWebSocket(
    webFdURL: URL,
    clientWebSocket: RetransmittingWebSocket,
  ): RetransmittingWebSocket | undefined {
    if (
      webFdURL.protocol === 'compositor:' &&
      this.compositorSessionId === webFdURL.searchParams.get('compositorSessionId')
    ) {
      // If the fd originated from the compositor, we can reuse the existing websocket connection to transfer the fd contents
      return clientWebSocket
    } else if (webFdURL.protocol.startsWith('ws')) {
      // fd came from another endpoint, establish a new communication channel
      logger.info(`Establishing data transfer websocket connection to ${webFdURL.href}`)
      const retransmittingWebSocket = new RetransmittingWebSocket({
        closeTimeoutMs: 2000,
        webSocketFactory: () => new WebSocket(webFdURL.href),
      })
      retransmittingWebSocket.addEventListener('error', (event: ErrorEventLike) =>
        logger.error(`Data transfer websocket is in error. ${event.message}`),
      )
      return retransmittingWebSocket
    } else {
      logger.error(`Unsupported websocket URL ${webFdURL.href}.`)
    }
  }

  private async handleForeignWebFdURL(webFdURL: URL, clientWebSocket: RetransmittingWebSocket): Promise<number> {
    const fdTransferWebSocket = this.findFdTransferWebSocket(webFdURL, clientWebSocket)
    if (fdTransferWebSocket === undefined) {
      return -1
    }

    let localFD = -1
    const webFdType = webFdURL.searchParams.get('type')
    if (webFdType === 'ArrayBuffer') {
      localFD = await this.handleForeignWebFDShm(fdTransferWebSocket, webFdURL)
    } else if (webFdType === 'MessagePort') {
      // because we can't distinguish between read or write end of a pipe, we always assume write-end of pipe here (as per c/p & DnD use-case in wayland protocol)
      localFD = this.handleForeignWebFDWritePipe(fdTransferWebSocket, webFdURL)
    }

    return localFD
  }

  private async handleForeignWebFDShm(fdTransferWebSocket: RetransmittingWebSocket, webFdURL: URL): Promise<number> {
    return new Promise<Uint8Array>((resolve, reject) => {
      // register listener for incoming content on com channel
      this.webFDTransferRequests[webFdURL.href] = resolve
      // request file contents. opcode: 4

      // TODO ensure this fd is present
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const fd = Number.parseInt(webFdURL.searchParams.get('fd'))
      fdTransferWebSocket.send(new Uint32Array([4, fd]).buffer)
    }).then((uint8Array: Uint8Array) =>
      Endpoint.createMemoryMappedFile(Buffer.from(uint8Array.buffer, uint8Array.byteOffset)),
    )
  }

  private handleForeignWebFDWritePipe(fdCommunicationChannel: RetransmittingWebSocket, webFdURL: URL): number {
    const resultBuffer = new Uint32Array(2)
    Endpoint.makePipe(resultBuffer)
    const readFd = resultBuffer[0]

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const readStream = fs.createReadStream(null, { fd: readFd })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const websocketStream = new WebsocketStream(fdCommunicationChannel)

    readStream.pipe(websocketStream)

    return resultBuffer[1]
  }

  handleWebFDContentTransferReply(payload: Uint8Array): void {
    // payload = fdURLByteSize (4 bytes) + fdURL (aligned to 4 bytes) + contents
    const { webFdURL, bytesRead } = this.deserializeWebFdURL(payload)
    const webFDTransfer = this.webFDTransferRequests[webFdURL.href]
    delete this.webFDTransferRequests[webFdURL.href]
    webFDTransfer(payload.subarray(bytesRead))
  }

  serializeWebFD(fd: number, fdType: number): Uint8Array {
    let type
    switch (fdType) {
      case 1:
        type = 'ArrayBuffer'
        break
      case 2:
        type = 'MessagePort'
        break
      default:
        type = 'unsupported'
    }

    const webFdURL = this._createLocalWebFDURL(fd, type)
    return textEncoder.encode(webFdURL.href)
  }

  /**
   *
   * @param {WebSocket}webSocket
   * @param {ParsedUrlQuery}query
   */
  incomingDataTransfer(webSocket: RetransmittingWebSocket, query: { fd: number }): void {
    logger.info('Handling incoming data transfer from: ' + webSocket.url)
    const fd = query.fd
    // Need to pass in null as path argument so it will use the fd to open the file (undocumented).
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const target = fs.createWriteStream(null, { fd })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const websocketStream = new WebsocketStream(webSocket)
    websocketStream.pipe(target)
  }
}
