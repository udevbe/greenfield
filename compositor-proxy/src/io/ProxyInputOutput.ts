import { createReadStream } from 'fs'
import { ClientRequest, request as httpRequest, RequestOptions } from 'http'
import { request as httpsRequest } from 'https'
import { ProxyFD } from './types'
import { createLogger } from '../Logger'
import { createMemoryMappedFile, makePipe } from 'westfield-proxy'

const logger = createLogger('webfs')

// 64*1024=64kb
export const TRANSFER_CHUNK_SIZE = 65792 as const

export function createProxyInputOutput(compositorSessionId: string, baseURL: string): ProxyInputOutput {
  return new ProxyInputOutput(compositorSessionId, baseURL)
}

export class ProxyInputOutput {
  constructor(private readonly compositorSessionId: string, readonly baseURL: string) {}

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

    const url = new URL(`${proxyFD.host}/fd/${proxyFD.handle}/stream`)
    url.searchParams.append('chunkSize', `${TRANSFER_CHUNK_SIZE}`)
    const isHttp = url.protocol === 'http:'
    const isHttps = url.protocol === 'https:'

    // we can't simply stream file contents because our http server doesn't support chunked transfers 🤦
    // fileReadStream.pipe(httpRequest)

    // buffer all data and pray we don't run out of memory before sending...
    const bufferChunks: Buffer[] = []
    fileReadStream.on('data', (chunk) => bufferChunks.push(chunk as Buffer))
    fileReadStream.on('end', () => {
      const buffer = Buffer.concat(bufferChunks)

      const options: RequestOptions = {
        method: 'PUT',
        headers: {
          ['X-Compositor-Session-Id']: this.compositorSessionId,
          ['Content-Type']: 'application/octet-stream',
          ['Content-Length']: buffer.byteLength,
        },
      }

      let request: ClientRequest
      if (isHttp) {
        request = httpRequest(url, options)
      } else if (isHttps) {
        request = httpsRequest(url, options)
      } else {
        logger.error(`unsupported proxy fd host protocol. Only http or https is supported. Got: ${url.protocol}`)
        return -1
      }

      request
        .once('response', (response) => {
          if (response.statusCode !== 200) {
            logger.error(`Failed to stream data to remote compositor-proxy: ${response.statusMessage}`)
          }
        })
        .on('error', (err) => {
          logger.error('Error while perform a PUT on proxyFD stream.')
          logger.error(err)
        })

      request.write(buffer)
      request.end()
    })

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
