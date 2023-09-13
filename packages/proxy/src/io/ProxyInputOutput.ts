import { createReadStream } from 'fs'
import { ProxyFD } from './types'
import { createLogger } from '../Logger'
import { createMemoryMappedFile, makePipe } from '@gfld/proxy-runtime'
import { createWebSocketStream, WebSocket } from 'ws'
import { Session } from '../Session'

const logger = createLogger('webfs')

// 64*1024=64kb
export const TRANSFER_CHUNK_SIZE = 65792 as const

export function createProxyInputOutput(session: Session, baseURL: string): ProxyInputOutput {
  return new ProxyInputOutput(session, baseURL)
}

export class ProxyInputOutput {
  constructor(
    private readonly session: Session,
    readonly baseURL: string,
  ) {}

  /**
   * Creates a native fd that matches the content & behavior of the foreign proxyFD
   */
  proxyFDtoNativeFD(proxyFD: ProxyFD): number {
    if (proxyFD.host === this.baseURL) {
      return proxyFD.handle
    } else {
      return this.handleForeignProxyFd(proxyFD)
    }
  }

  /**
   * Returns a native write pipe fd that when written, will transfer its data to the given proxyFD's host
   */
  private toNativePipeWriteFD(proxyFD: ProxyFD): number {
    const pipeFds = new Uint32Array(2)
    makePipe(pipeFds)
    const readFd = pipeFds[0]

    const fileReadStream = createReadStream('ignored', {
      fd: readFd,
      autoClose: true,
      highWaterMark: TRANSFER_CHUNK_SIZE,
    })

    const url = new URL(`${proxyFD.host}/write-fd-as-stream`)
    url.searchParams.set('fd', `${proxyFD.handle}`)
    url.searchParams.set('compositorSessionId', this.session.compositorSessionId)
    url.searchParams.set('chunkSize', `${TRANSFER_CHUNK_SIZE}`)

    const ws = new WebSocket(url)
    const wsStream = createWebSocketStream(ws, { highWaterMark: TRANSFER_CHUNK_SIZE })
    ws.binaryType = 'nodebuffer'
    ws.onopen = () => {
      fileReadStream.pipe(wsStream)
    }
    fileReadStream.on('end', () => ws.close())

    return pipeFds[1]
  }

  private handleForeignProxyFd(proxyFD: ProxyFD): number {
    const proxyFdType = proxyFD.type

    switch (proxyFdType) {
      case 'pipe-write':
        return this.toNativePipeWriteFD(proxyFD)
      case 'pipe-read':
      case 'shm':
      case 'unknown':
        logger.error(`Sharing proxy fds of type ${proxyFdType} between proxies is currently not supported.`)
        return -1
    }
  }

  mkpipe(): [ProxyFD, ProxyFD] {
    const pipeFds = new Uint32Array(2)
    makePipe(pipeFds)

    return [
      {
        handle: pipeFds[0],
        type: 'pipe-read',
        host: this.baseURL,
      },
      {
        handle: pipeFds[1],
        type: 'pipe-write',
        host: this.baseURL,
      },
    ]
  }

  mkstempMmap(buffer: Buffer): ProxyFD {
    const fd = createMemoryMappedFile(buffer)
    return {
      handle: fd,
      type: 'shm',
      host: this.baseURL,
    }
  }
}
