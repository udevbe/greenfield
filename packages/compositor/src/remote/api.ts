/** @description This type carefully mimics a native file descriptor and adds additional information to make it usable in a  remote context. */
export type ProxyFD = {
  /**
   * Format: int32
   * @description The native FD
   * @example 12
   */
  handle: number
  /**
   * @description The file type of the native FD. 'unknown' type means that FD was created by an external application, in which case the 'type' should be manually updated to a more concrete type before doing any operations on the ProxyFD.
   *
   * @enum {string}
   */
  type: 'pipe-read' | 'pipe-write' | 'shm' | 'unknown'
  /**
   * Format: uri
   * @description The url where this ProxyFD originated from and where it can be accessed e.g. for reading or writing.
   * @example https://proxy-endpoint.com:8081
   */
  host: string
}

export type RemoteAPI = {
  mkstempMmap(param: { body: Blob }): Promise<ProxyFD>
  mkfifo(): Promise<ProxyFD[]>
  writeFdAsStream(param: { body: Blob; fd: number }): Promise<void>
  readFd(param: { count: number; fd: number }): Promise<Blob>
  readStreamRaw(param: { chunkSize?: number; fd: number }): Promise<{
    raw: { status: number; statusText: string; body: ReadableStream<Uint8Array>; blob: () => Blob }
  }>
  closeFd(param: { fd: number }): Promise<void>
  // TODO
  // keyframe(param: {
  //   clientId: string
  //   surfaceId: number
  //   body: { bufferId: number; bufferContentSerial: number; bufferCreationSerial: number }
  // }): Promise<void>
}

export function createRemoteAPI(baseURL: string, compositorSessionId: string): RemoteAPI {
  return new RemoteWebSocketAPI(baseURL, compositorSessionId)
}

class RemoteWebSocketAPI implements RemoteAPI {
  constructor(readonly baseURL: string, readonly compositorSessionId: string) {}

  closeFd(param: { fd: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseURL}/close-fd`)
      url.searchParams.set('fd', `${param.fd}`)
      url.searchParams.set('compositorSessionId', this.compositorSessionId)
      const ws = new WebSocket(url)
      ws.binaryType = 'blob'
      ws.onerror = (ev) => {
        reject(new Error('websocket error'))
      }
      ws.onclose = (ev) => {
        if (ev.code === 4200) {
          resolve()
        } else {
          reject(new Error(ev.reason))
        }
      }
    })
  }

  mkfifo(): Promise<ProxyFD[]> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseURL}/mkfifo`)
      url.searchParams.set('compositorSessionId', this.compositorSessionId)
      const ws = new WebSocket(url)
      ws.binaryType = 'blob'
      ws.onerror = (ev) => {
        reject(new Error('websocket error'))
      }
      ws.onmessage = (ev) => {
        const fds = JSON.parse(ev.data as string)
        resolve(fds)
      }
      ws.onclose = (ev) => {
        if (ev.code !== 4201) {
          reject(new Error(ev.reason))
        }
      }
    })
  }

  mkstempMmap(param: { body: Blob }): Promise<ProxyFD> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseURL}/mkstemp-mmap`)
      url.searchParams.set('compositorSessionId', this.compositorSessionId)
      const ws = new WebSocket(url)
      ws.binaryType = 'blob'
      ws.onerror = (ev) => {
        reject(new Error('websocket error'))
      }
      ws.onopen = async (ev) => {
        ws.send(param.body)
        ws.send(new Blob([])) /*EOF*/
      }
      ws.onmessage = (ev) => {
        const fds = JSON.parse(ev.data as string)
        resolve(fds)
      }
      ws.onclose = (ev) => {
        if (ev.code !== 4201) {
          reject(new Error(ev.reason))
        }
      }
    })
  }

  readFd(param: { count: number; fd: number }): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseURL}/read-fd`)
      url.searchParams.set('fd', `${param.fd}`)
      url.searchParams.set('count', `${param.count}`)
      url.searchParams.set('compositorSessionId', this.compositorSessionId)
      const ws = new WebSocket(url)
      ws.binaryType = 'blob'
      ws.onerror = (ev) => {
        reject(new Error('websocket error'))
      }
      ws.onmessage = (ev) => {
        resolve(ev.data as Blob)
      }
      ws.onclose = (ev) => {
        if (ev.code !== 4200) {
          reject(new Error(ev.reason))
        }
      }
    })
  }

  readStreamRaw(param: { chunkSize?: number; fd: number }): Promise<{
    raw: { status: number; statusText: string; body: ReadableStream<Uint8Array>; blob: () => Blob }
  }> {
    return new Promise((resolve, reject) => {
      const chunks: BlobPart[] = []
      const url = new URL(`${this.baseURL}/read-fd-as-stream`)
      url.searchParams.set('fd', `${param.fd}`)
      if (param.chunkSize) {
        url.searchParams.set('chunkSize', `${param.chunkSize}`)
      }
      url.searchParams.set('compositorSessionId', this.compositorSessionId)
      const ws = new WebSocket(url)
      ws.binaryType = 'blob'
      ws.onerror = (ev) => {
        reject(new Error('websocket error'))
      }
      ws.onmessage = (ev) => {
        chunks.push(ev.data as Blob)
      }
      ws.onclose = (ev) => {
        if (ev.code === 1005) {
          const blob = new Blob(chunks)
          resolve({ raw: { status: 200, statusText: ev.reason, blob: () => blob, body: blob.stream() } })
        } else {
          reject(new Error(ev.reason))
        }
      }
    })
  }

  writeFdAsStream(param: { body: Blob; fd: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseURL}/write-fd-as-stream`)
      url.searchParams.set('fd', `${param.fd}`)
      url.searchParams.set('compositorSessionId', this.compositorSessionId)
      const ws = new WebSocket(url)
      ws.binaryType = 'blob'
      ws.onerror = (ev) => {
        reject(new Error('websocket error'))
      }
      ws.onopen = (ev) => {
        ws.send(param.body)
        ws.close(4200)
      }
      ws.onclose = (ev) => {
        if (ev.code === 4200) {
          resolve()
        } else {
          reject(new Error(ev.reason))
        }
      }
    })
  }
}
