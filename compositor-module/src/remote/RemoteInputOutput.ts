import { Configuration, ProxyWebFD, ProxyWebFDTypeEnum, WebfsApi } from '../api'
import { InputOutputFD, InputOutput } from '../InputOutput'
import { FD } from 'westfield-runtime-common'
import { isProxyFD } from './RemoteConnectionHandler'

export function createRemoteInputOutput(basePath: string, compositorSessionId: string): InputOutput {
  return new RemoteInputOutput(basePath, compositorSessionId)
}

class RemoteInputOutput implements InputOutput {
  readonly api: WebfsApi

  constructor(public readonly basePath: string, compositorSessionId: string) {
    this.api = new WebfsApi(
      new Configuration({
        basePath,
        headers: {
          ['X-Compositor-Session-Id']: compositorSessionId,
        },
      }),
    )
  }

  async mkstempMmap(data: Blob): Promise<InputOutputFD> {
    const proxyWebFD: ProxyWebFD = await this.api.mkstempMmap({ body: data })
    return new RemoteInputOutputFD(this.api, proxyWebFD)
  }

  async mkfifo(): Promise<Array<InputOutputFD>> {
    const pipe: ProxyWebFD[] = await this.api.mkfifo()
    return [new RemoteInputOutputFD(this.api, pipe[0]), new RemoteInputOutputFD(this.api, pipe[1])]
  }

  wrapFD(webFD: FD, type: 'pipe-read' | 'pipe-write' | 'shm'): InputOutputFD {
    if (isProxyFD(webFD)) {
      // @ts-ignore
      webFD.type = type
      return new RemoteInputOutputFD(this.api, webFD)
    }

    throw new Error('BUG. Unsupported client webfd. Need ProxyWebFD.')
  }
}

class RemoteInputOutputFD implements InputOutputFD {
  constructor(private readonly api: WebfsApi, readonly fd: ProxyWebFD) {}

  write(data: Blob): Promise<void> {
    if (this.fd.type === ProxyWebFDTypeEnum.PipeRead) {
      throw new Error(`BUG. Can't write to a pipe-read fd.`)
    }
    return this.api.writeStream({
      fd: this.fd.handle,
      body: data,
    })
  }

  read(count: number): Promise<Blob> {
    if (this.fd.type === ProxyWebFDTypeEnum.PipeWrite) {
      throw new Error(`BUG. Can't read from a pipe-write fd.`)
    }
    return this.api.read({ fd: this.fd.handle, count })
  }

  async readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>> {
    if (this.fd.type === ProxyWebFDTypeEnum.PipeWrite) {
      throw new Error(`BUG. Can't read from a pipe-write fd.`)
    }
    const rawResponse = await this.api.readStreamRaw({ fd: this.fd.handle, chunkSize })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a webfd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.body
  }

  async readBlob(): Promise<Blob> {
    if (this.fd.type === ProxyWebFDTypeEnum.PipeWrite) {
      throw new Error(`BUG. Can't read from a pipe-write fd.`)
    }
    const rawResponse = await this.api.readStreamRaw({ fd: this.fd.handle })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a webfd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.blob()
  }

  close(): Promise<void> {
    return this.api.close({ fd: this.fd.handle })
  }
}
