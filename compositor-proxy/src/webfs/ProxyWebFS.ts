import fs from 'fs'
import http from 'http'
import { Endpoint } from 'westfield-endpoint'
import { Webfd } from './types'

// 64*1024=64kb
export const TRANSFER_CHUNK_SIZE = 65792 as const

export function createCompositorProxyWebFS(compositorSessionId: string, baseURL: string): AppEndpointWebFS {
  return new AppEndpointWebFS(compositorSessionId, baseURL)
}

export class AppEndpointWebFS {
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
    const resultBuffer = new Uint32Array(2)
    Endpoint.makePipe(resultBuffer)
    const readFd = resultBuffer[0]

    const fileReadStream = fs.createReadStream('ignored', {
      fd: readFd,
      autoClose: true,
      highWaterMark: TRANSFER_CHUNK_SIZE,
    })

    const httpRequest = http.request(
      {
        hostname: webfd.host,
        path: `/webfd/${webfd.handle}/stream`,
        method: 'PUT',
        searchParams: new URLSearchParams({
          chunkSize: `${TRANSFER_CHUNK_SIZE}`,
        }),
        headers: {
          ['X-Compositor-Session-Id']: this.compositorSessionId,
        },
      },
      (response) => {
        // TODO do something with response
      },
    )

    // stream file contents over http
    fileReadStream.pipe(httpRequest)
    return resultBuffer[1]
  }

  private handleForeignWebFd(webfd: Webfd): number {
    let localFD: number | Promise<number> = -1
    const webFdType = webfd.type

    switch (webFdType) {
      case 'pipe-write':
        localFD = this.toNativePipeWriteFD(webfd)
        break
      case 'pipe-read':
      case 'shm':
      case 'unknown':
        throw new Error(`Sharing webfds of type ${webFdType} between proxies is currently not supported.`)
    }

    return localFD
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
