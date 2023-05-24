import { Configuration, IoApi, ProxyFD, ProxyFDTypeEnum } from '../api'
import { InputOutput, InputOutputFD } from '../InputOutput'
import { FD } from 'westfield-runtime-common'

export function isProxyFD(fd: any): fd is ProxyFD {
  return typeof fd?.handle === 'number' && typeof fd?.host === 'string' && typeof fd?.type === 'string'
}

export function createRemoteInputOutput(basePath: string, compositorSessionId: string): InputOutput {
  return new RemoteInputOutput(basePath, compositorSessionId)
}

class RemoteInputOutput implements InputOutput {
  readonly api: IoApi

  constructor(public readonly basePath: string, compositorSessionId: string) {
    this.api = new IoApi(
      new Configuration({
        basePath,
        headers: {
          ['x-compositor-session-id']: compositorSessionId,
        },
      }),
    )
  }

  async mkstempMmap(data: Blob): Promise<InputOutputFD> {
    const proxyFD: ProxyFD = await this.api.mkstempMmap({ body: data })
    return new RemoteInputOutputFD(this.api, proxyFD)
  }

  async mkfifo(): Promise<Array<InputOutputFD>> {
    const pipe: ProxyFD[] = await this.api.mkfifo()
    return [new RemoteInputOutputFD(this.api, pipe[0]), new RemoteInputOutputFD(this.api, pipe[1])]
  }

  wrapFD(fd: FD, type: ProxyFDTypeEnum.PipeRead | ProxyFDTypeEnum.PipeWrite | ProxyFDTypeEnum.Shm): InputOutputFD {
    if (isProxyFD(fd)) {
      fd.type = type
      return new RemoteInputOutputFD(this.api, fd)
    }

    throw new Error('BUG. Unsupported client fd. Need ProxyFD.')
  }
}

class RemoteInputOutputFD implements InputOutputFD {
  constructor(private readonly api: IoApi, readonly fd: ProxyFD) {}

  write(data: Blob): Promise<void> {
    if (this.fd.type === ProxyFDTypeEnum.PipeRead) {
      throw new Error(`BUG. Can't write to a pipe-read fd.`)
    }
    return this.api.writeStream({
      fd: this.fd.handle,
      body: data,
    })
  }

  read(count: number): Promise<Blob> {
    if (this.fd.type === ProxyFDTypeEnum.PipeWrite) {
      throw new Error(`BUG. Can't read from a pipe-write fd.`)
    }
    return this.api.read({ fd: this.fd.handle, count })
  }

  async readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>> {
    if (this.fd.type === ProxyFDTypeEnum.PipeWrite) {
      throw new Error(`BUG. Can't read from a pipe-write fd.`)
    }
    const rawResponse = await this.api.readStreamRaw({ fd: this.fd.handle, chunkSize })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a fd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.body
  }

  async readBlob(): Promise<Blob> {
    if (this.fd.type === ProxyFDTypeEnum.PipeWrite) {
      throw new Error(`BUG. Can't read from a pipe-write fd.`)
    }
    const rawResponse = await this.api.readStreamRaw({ fd: this.fd.handle })
    if (rawResponse.raw.body === null) {
      throw new Error(
        `BUG. Tried reading a fd as stream but failed: ${rawResponse.raw.status} ${rawResponse.raw.statusText}`,
      )
    }
    return rawResponse.raw.blob()
  }

  close(): Promise<void> {
    return this.api.close({ fd: this.fd.handle })
  }
}
