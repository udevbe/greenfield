import fs from 'fs'
import http, { ClientRequest, RequestOptions } from 'http'
import https from 'https'
import { Endpoint } from 'westfield-endpoint'
import { Webfd } from './types'
import { createLogger } from '../Logger'

const logger = createLogger('webfs')

// 64*1024=64kb
export const TRANSFER_CHUNK_SIZE = 65792 as const

export function createCompositorProxyWebFS(compositorSessionId: string, baseURL: string): ProxyWebFS {
  return new ProxyWebFS(compositorSessionId, baseURL)
}

export class ProxyWebFS {
  constructor(private readonly compositorSessionId: string, readonly baseURL: string) {}

  /**
   * Creates a native fd that matches the content & behavior of the foreign webfd
   */
  webFDtoNativeFD(webfd: Webfd): number {
    if (webfd.host === this.baseURL) {
      return webfd.handle
    } else {
      return this.handleForeignWebFd(webfd)
    }
  }

  /**
   * Returns a native write pipe fd that -when written- will transfer its data to the given webfd host
   */
  private toNativePipeWriteFD(webfd: Webfd): number {
    const pipeFds = new Uint32Array(2)
    Endpoint.makePipe(pipeFds)
    const readFd = pipeFds[0]

    const fileReadStream = fs.createReadStream('ignored', {
      fd: readFd,
      autoClose: true,
      highWaterMark: TRANSFER_CHUNK_SIZE,
    })

    const url = new URL(`${webfd.host}/webfd/${webfd.handle}/stream`)
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

      let httpRequest: ClientRequest
      if (isHttp) {
        httpRequest = http.request(url, options)
      } else if (isHttps) {
        httpRequest = https.request(url, options)
      } else {
        logger.error(`unsupported webfd host protocol. Only http or https is supported. Got: ${url.protocol}`)
        return -1
      }

      httpRequest
        .once('response', (response) => {
          if (response.statusCode !== 200) {
            logger.error(`Failed to stream data to remote compositor-proxy: ${response.statusMessage}`)
          }
        })
        .on('error', (err) => {
          logger.error('Error while perform a PUT on webfd stream.')
          logger.error(err)
        })

      httpRequest.write(buffer)
      httpRequest.end()
    })

    return pipeFds[1]
  }

  private handleForeignWebFd(webfd: Webfd): number {
    const webFdType = webfd.type

    switch (webFdType) {
      case 'pipe-write':
        return this.toNativePipeWriteFD(webfd)
      case 'pipe-read':
      case 'shm':
      case 'unknown':
        logger.error(`Sharing webfds of type ${webFdType} between proxies is currently not supported.`)
        return -1
    }
  }

  mkpipe(): [Webfd, Webfd] {
    const pipeFds = new Uint32Array(2)
    Endpoint.makePipe(pipeFds)

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

  mkstempMmap(buffer: Buffer): Webfd {
    const fd = Endpoint.createMemoryMappedFile(buffer)
    return {
      handle: fd,
      type: 'shm',
      host: this.baseURL,
    }
  }
}
