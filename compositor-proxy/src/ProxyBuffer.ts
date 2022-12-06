import { MessageDestination } from 'westfield-proxy'

let bufferSerial = 0

export function incrementAndGetNextBufferSerial() {
  return ++bufferSerial
}

export class ProxyBuffer {
  constructor(
    private readonly interceptors: Record<number, any>,
    public readonly bufferId: number,
    public readonly creationSerial: number,
    public destroyed = false,
    public destroyListeners: (() => void)[] = [],
  ) {}

  // destroy
  R0(message: {
    buffer: ArrayBuffer
    fds: Array<number>
    bufferOffset: number
    consumed: number
    size: number
  }): MessageDestination {
    this.destroyListeners.forEach((listener) => listener())
    this.destroyListeners = []
    this.destroyed = true
    delete this.interceptors[this.bufferId]
    return { native: false, browser: true }
  }
}
