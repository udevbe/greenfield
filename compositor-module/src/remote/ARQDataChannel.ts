import { Kcp } from './kcp'

const MAX_BUFFERED_AMOUNT = 36000
const LOW_BUFFERED_AMOUNT = 3600

export class ARQDataChannel {
  private kcp?: Kcp
  private openCb?: () => void
  private msgCb?: (msg: Uint8Array) => void
  private checkTimer?: number
  private sendBuffer: ArrayBufferView[] = []

  constructor(public readonly dataChannel: RTCDataChannel) {
    dataChannel.bufferedAmountLowThreshold = LOW_BUFFERED_AMOUNT
    dataChannel.onbufferedamountlow = () => {
      for (const buffer of this.sendBuffer) {
        this.send(buffer)
      }
      this.sendBuffer = []
      this.check()
    }

    if (dataChannel.readyState === 'open') {
      this.initKcp()
      this.openCb?.()
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

  private check() {
    if (this.checkTimer === undefined && this.kcp && this.dataChannel.bufferedAmount <= MAX_BUFFERED_AMOUNT) {
      this.kcp.update()
      this.checkTimer = window.setTimeout(() => {
        this.checkTimer = undefined
        this.check()
      }, this.kcp.check())
    }
  }

  send(buffer: ArrayBufferView) {
    // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    if (this.dataChannel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
      this.sendBuffer.push(buffer)
      return
    } else if (this.kcp) {
      this.kcp.send(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength))
      this.kcp.flush(false)
    }
  }

  close(): void {
    if (this.checkTimer) {
      clearTimeout(this.checkTimer)
      this.checkTimer = undefined
    }

    if (this.dataChannel.readyState === 'open' && this.kcp) {
      this.kcp.flush(true)
    }

    if (this.dataChannel.readyState === 'open' || this.dataChannel.readyState === 'connecting') {
      this.dataChannel.close()
    }

    if (this.kcp) {
      this.kcp.release()
      this.kcp = undefined
    }
  }

  get readyState(): RTCDataChannelState {
    return this.dataChannel.readyState
  }

  private initKcp() {
    if (this.dataChannel.id === null) {
      throw new Error('BUG. Datachannel does not have an id.')
    }
    const kcp = new Kcp(this.dataChannel.id, this)
    kcp.setMtu(1200) // webrtc datachannel MTU
    kcp.setWndSize(256, 256)
    kcp.setNoDelay(1, 20, 2, 1)
    kcp.setOutput((buf, len) => {
      if (this.dataChannel.readyState === 'open') {
        this.dataChannel.send(buf.subarray(0, len))
      } else {
        throw new Error(`BUG. Sending message on a ${this.dataChannel.readyState} channel`)
      }
    })

    this.dataChannel.addEventListener(
      'message',
      (ev) => {
        if (this.kcp === undefined) {
          throw new Error(`BUG. Received message on a ${this.dataChannel.readyState} channel`)
        }
        // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
        this.kcp.input(new Uint8Array(ev.data), true, false)
        const size = this.kcp.peekSize()
        if (size > 0) {
          const buffer = new Uint8Array(size)
          const len = this.kcp.recv(buffer)
          if (len && this.msgCb) {
            this.msgCb(buffer.subarray(0, len))
          }
        }
      },
      { passive: true },
    )

    this.kcp = kcp
    this.check()
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
      () => {
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
