import { MessageDestination } from 'westfield-proxy'

export class ProxyBuffer {
  constructor(
    private readonly interceptors: Record<number, any>,
    public readonly bufferId: number,
    public destroyed = false,
  ) {}

  destroyListeners: (() => void)[] = []

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
