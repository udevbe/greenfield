import { InputOutput, InputOutputFD } from '../InputOutput'
import { FD } from 'westfield-runtime-common'

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

  mkstempMmap(data: Blob): Promise<InputOutputFD> {
    // TODO mkstempMmap for webIO
    throw new Error('TODO. Not yet implemented.')
  }

  wrapFD(fd: FD, type: 'pipe-read' | 'pipe-write' | 'shm'): InputOutputFD {
    if ((type === 'pipe-write' || type === 'pipe-read') && fd instanceof MessagePort) {
      return new WebPipeInputOutputFD(fd, type)
    }
    // TODO wrap InputOutputFD for webIO shm
    throw new Error('TODO. Not yet implemented.')
  }
}

export const webInputOutput: InputOutput = new WebInputOutput()
