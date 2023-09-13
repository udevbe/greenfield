import { InputOutput, InputOutputFD } from '../InputOutput'
import { FD } from 'westfield-runtime-common'

class WebShmFD implements InputOutputFD {
  private readonly blob: Blob
  private readOffset = 0

  constructor(public readonly fd: Uint8Array, private readonly type: 'shm') {
    this.blob = new Blob([fd])
  }

  async close(): Promise<void> {
    /* NOOP */
  }

  async read(count: number): Promise<Blob> {
    const blob = this.blob.slice(this.readOffset)
    this.readOffset += count
    return blob
  }

  async readBlob(): Promise<Blob> {
    return this.blob
  }

  async readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>> {
    return this.blob.stream()
  }

  async write(data: Blob): Promise<void> {
    this.fd.set(new Uint8Array(await data.arrayBuffer()))
  }
}

class WebPipeInputOutputFD implements InputOutputFD {
  private readBuffer?: Blob

  constructor(public readonly fd: MessagePort, private readonly type: 'pipe-read' | 'pipe-write') {}

  async close(): Promise<void> {
    await this.write(new Blob([new ArrayBuffer(0)]))
    this.fd.close()
  }

  private readFromBuffer(count: number): Blob | undefined {
    if (this.readBuffer && this.readBuffer.size >= count) {
      const readDiff = this.readBuffer.size - count
      if (readDiff === 0) {
        const buffer = this.readBuffer
        this.readBuffer = undefined
        return buffer
      } else {
        const buffer = this.readBuffer.slice(readDiff)
        this.readBuffer = this.readBuffer.slice(0, readDiff)
        return buffer
      }
    }
    return undefined
  }

  private appendBuffer(blob: Blob) {
    if (this.readBuffer) {
      this.readBuffer = new Blob([this.readBuffer, blob])
    } else {
      this.readBuffer = blob
    }
  }

  async read(count: number): Promise<Blob> {
    const bufferResult = this.readFromBuffer(count)
    if (bufferResult) {
      return bufferResult
    }

    return new Promise<Blob>((resolve, reject) => {
      this.fd.addEventListener(
        'message',
        (ev) => {
          const eventData = ev.data
          if (eventData instanceof ArrayBuffer) {
            const data = new Blob([eventData])
            this.appendBuffer(data)
            const bufferResult = this.readFromBuffer(count)
            if (bufferResult) {
              resolve(data)
            } else if (data.size === 0) {
              // EOF
              resolve(data)
            }
          } else {
            reject(new Error('Received non blob data.'))
          }
        },
        {
          once: true,
          passive: true,
        },
      )
      this.fd.addEventListener(
        'messageerror',
        (ev) => {
          reject(new Error(ev.data))
        },
        {
          once: true,
          passive: true,
        },
      )
      this.fd.start()
    })
  }

  readBlob(): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      this.fd.addEventListener(
        'message',
        (ev) => {
          const eventData = ev.data
          if (eventData instanceof ArrayBuffer) {
            const data = new Blob([eventData])
            if (data.size === 0) {
              // EOF
              const buffer = this.readBuffer ?? data
              this.readBuffer = undefined
              resolve(buffer)
            } else {
              this.appendBuffer(data)
            }
          } else {
            reject(new Error('Received non ArrayBuffer data.'))
          }
        },
        {
          passive: true,
        },
      )
      this.fd.addEventListener('messageerror', (ev) => reject(new Error(ev.data)), {
        once: true,
        passive: true,
      })
      this.fd.start()
    })
  }

  async readStream(chunkSize: number): Promise<ReadableStream<Uint8Array>> {
    const blob = await this.readBlob()
    // @ts-ignore
    return blob.stream()
  }

  async write(data: Blob): Promise<void> {
    const messageData = await data.arrayBuffer()
    this.fd.postMessage(messageData, [messageData])
  }
}

class WebInputOutput implements InputOutput {
  async mkfifo(): Promise<Array<InputOutputFD>> {
    const messageChannel = new MessageChannel()
    return [
      new WebPipeInputOutputFD(messageChannel.port1, 'pipe-read'),
      new WebPipeInputOutputFD(messageChannel.port2, 'pipe-write'),
    ]
  }

  async mkstempMmap(data: Blob): Promise<InputOutputFD> {
    return new WebShmFD(new Uint8Array(await data.arrayBuffer()), 'shm')
  }

  wrapFD(fd: FD, type: 'pipe-read' | 'pipe-write' | 'shm'): InputOutputFD {
    if ((type === 'pipe-write' || type === 'pipe-read') && fd instanceof MessagePort) {
      return new WebPipeInputOutputFD(fd, type)
    } else if (type === 'shm') {
      if (fd instanceof ArrayBuffer || fd instanceof SharedArrayBuffer) {
        return new WebShmFD(new Uint8Array(fd), 'shm')
      } else if (fd instanceof Uint8Array) {
        return new WebShmFD(fd, 'shm')
      }
    }
    throw new Error('FD type mismatch.')
  }
}

export const webInputOutput: InputOutput = new WebInputOutput()
