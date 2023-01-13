import { Kcp } from './kcp'
import { Buffer } from 'buffer/'

export class ARQDataChannel {
  private kcp?: Kcp
  private openCb?: () => void
  private msgCb?: (msg: Uint8Array) => void
  private checkTimer?: number

  constructor(public readonly dataChannel: RTCDataChannel) {
    if (dataChannel.readyState === 'open') {
      this.initKcp()
    } else {
      this.dataChannel.addEventListener(
        'open',
        () => {
          this.initKcp()
          this.openCb?.()
        },
        { passive: true },
      )
    }
  }

  private check(kcp: Kcp) {
    kcp.update()
    this.checkTimer = window.setTimeout(() => {
      this.check(kcp)
    }, kcp.check())
  }

  send(buffer: ArrayBufferView) {
    // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    if (this.kcp) {
      this.kcp.send(Buffer.from(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength).buffer))
      this.kcp.flush(false)
    }
  }

  close(): void {
    if (this.checkTimer) {
      window.clearTimeout(this.checkTimer)
      this.checkTimer = undefined
    }
    if (this.kcp) {
      this.kcp.flush(false)
      this.kcp.release()
      this.kcp = undefined
    }

    this.dataChannel.close()
  }

  get readyState(): RTCDataChannelState {
    return this.dataChannel.readyState
  }

  private initKcp() {
    const kcp = new Kcp(this.dataChannel.id ?? 0, this)
    kcp.setMtu(1280)
    // Max packet size = 1024 * (1280 - 24) = 1256Kb
    kcp.setWndSize(1024, 1024)
    kcp.setNoDelay(1, 20, 2, 1)
    kcp.setOutput((buf, len) => {
      this.dataChannel.send(buf.subarray(0, len))
    })
    this.dataChannel.addEventListener(
      'message',
      (ev) => {
        // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
        kcp.input(Buffer.from(ev.data), true, false)
        const size = kcp.peekSize()
        if (size > 0) {
          const buffer = Buffer.alloc(size)
          const len = kcp.recv(buffer)
          if (len && this.msgCb) {
            this.msgCb(buffer.subarray(0, len))
          }
        }
      },
      { passive: true },
    )
    this.check(kcp)
    this.kcp = kcp
  }

  onOpen(cb: () => void): void {
    if (this.dataChannel.readyState === 'open') {
      cb()
    } else {
      this.openCb = cb
    }
  }

  onClose(cb: () => void): void {
    this.dataChannel.addEventListener(
      'close',
      (ev) => {
        this.close()
        cb()
      },
      { passive: true },
    )
  }

  onError(cb: (err: Event) => void): void {
    this.dataChannel.addEventListener('error', cb, { passive: true })
  }

  onMessage(cb: (msg: Uint8Array) => void): void {
    this.msgCb = cb
  }
}
