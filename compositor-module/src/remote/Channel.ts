import { Kcp } from './kcp'
import ReconnectingWebSocket from './reconnecting-websocket'

const MTU = 64000
const MAX_BUFFERED_AMOUNT = 2949120
const SND_WINDOW_SIZE = 1024
const RCV_WINDOW_SIZE = 128
const INTERVAL = 100

export const enum ChannelDescriptionType {
  PROTOCOL,
  FRAME,
  XWM,
  FEEDBACK,
  AUDIO,
}

export const enum ChannelType {
  ARQ,
  SIMPLE,
}

export type ChannelDesc = {
  readonly id: string
  readonly type: ChannelDescriptionType
  readonly clientId: string
  readonly channelType: ChannelType
}
export type FeedbackChannelDesc = ChannelDesc & { surfaceId: number }

export interface Channel {
  readonly desc: ChannelDesc
  readonly isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onMessage: (msg: Uint8Array) => void
  onError: (err: Error) => void

  send(buffer: ArrayBufferView): void

  close(): void
}

export interface WebSocketChannel extends Channel {
  readonly webSocket: ReconnectingWebSocket
}

export class SimpleChannel implements WebSocketChannel {
  private closed = false

  onOpen = () => {
    /*noop*/
  }
  onMessage = (msg: Uint8Array) => {
    /*noop*/
  }
  onClose = () => {
    /*noop*/
  }
  onError = (err: Error) => {
    /*noop*/
  }

  constructor(readonly webSocket: ReconnectingWebSocket, public readonly desc: ChannelDesc) {
    this.webSocket.binaryType = 'arraybuffer'
    if (this.webSocket.readyState === ReconnectingWebSocket.OPEN) {
      this.onOpen()
    } else {
      this.webSocket.onopen = () => {
        this.onOpen()
      }
    }
    this.webSocket.onclose = (event) => {
      if (this.closed) {
        return
      }
      if (event.code === 4001) {
        this.closed = true
        this.onClose()
      }
    }
    this.webSocket.onerror = (err) => {
      this.onError(err.error)
    }
    this.webSocket.onmessage = (ev: MessageEvent<ArrayBuffer | string>) => {
      this.onMessage(new Uint8Array(ev.data as ArrayBuffer))
    }
  }

  get isOpen(): boolean {
    return this.webSocket.readyState === ReconnectingWebSocket.OPEN
  }

  send(buffer: ArrayBufferView): void {
    if (
      this.webSocket.readyState === ReconnectingWebSocket.OPEN &&
      this.webSocket.bufferedAmount <= MAX_BUFFERED_AMOUNT
    ) {
      this.webSocket.send(buffer)
    }
  }

  close(): void {
    if (this.closed) {
      return
    }
    this.closed = true

    this.webSocket.close(4001)
    this.onClose()
  }
}

export class ARQChannel implements WebSocketChannel {
  private closed = false
  private readonly kcp: Kcp
  onOpen = () => {
    /*noop*/
  }
  onMessage = (msg: Uint8Array) => {
    /*noop*/
  }
  onClose = () => {
    /*noop*/
  }
  onError = (err: Error) => {
    /*noop*/
  }

  private checkInterval?: number

  constructor(readonly webSocket: ReconnectingWebSocket, public readonly desc: ChannelDesc) {
    this.webSocket.binaryType = 'arraybuffer'
    const kcp = new Kcp(+this.desc.id, this)
    kcp.setMtu(MTU) // webrtc datachannel MTU
    kcp.setWndSize(SND_WINDOW_SIZE, RCV_WINDOW_SIZE)
    kcp.setNoDelay(1, INTERVAL, 0, 1)
    kcp.setOutput((data, len) => {
      if (this.webSocket && this.webSocket.bufferedAmount <= MAX_BUFFERED_AMOUNT) {
        // TODO handle backpressure
        this.webSocket.send(data.subarray(0, len))
        this.kcp.update()
      }
    })

    this.check(kcp)
    this.kcp = kcp

    this.webSocket.onopen = () => {
      this.onOpen()
    }

    this.webSocket.onclose = (event) => {
      if (this.closed) {
        return
      }

      if (event.code === 4001) {
        this.closed = true
        if (this.kcp.snd_buf !== undefined) {
          if (this.checkInterval) {
            clearInterval(this.checkInterval)
            this.checkInterval = undefined
          }
          this.kcp.release()
        }
        this.onClose()
      }
    }
    this.webSocket.onerror = (err) => {
      this.onError(err.error)
    }
    this.webSocket.onmessage = (ev: MessageEvent<ArrayBuffer | string>) => {
      if (this.kcp.snd_buf === undefined) {
        return
      }
      this.kcp.input(new Uint8Array(ev.data as ArrayBuffer), true, false)
      let size = -1
      while ((size = this.kcp.peekSize()) >= 0) {
        // TODO if speed (kbs) is consistently lower than what our video codec outputs, we have to decrease fps and/or bitrate
        // let duration = 0
        // while (({ size, duration } = this.kcp.peekSizeAndRecvDuration()).size >= 0) {
        //   if (duration > 0) {
        //     console.log(
        //       `size: ${size}, duration: ${duration}, size/duration: ${Math.round(
        //         (size * 8) / 1024 / (duration / 1000),
        //       )}kbps`,
        //     )
        //   }
        const buffer = new Uint8Array(size)
        const len = this.kcp.recv(buffer)
        if (len >= 0) {
          this.onMessage(buffer.subarray(0, len))
        }
      }
    }
  }

  send(buffer: ArrayBufferView): void {
    if (this.kcp) {
      this.kcp.send(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength))
      this.kcp.flush(false)
    }
  }

  private check(kcp: Kcp) {
    this.checkInterval = window.setInterval(() => {
      kcp.update()
    }, INTERVAL)
  }

  close(): void {
    if (this.closed) {
      return
    }
    this.closed = true
    this.webSocket.close(4001)
    this.onClose()
  }

  get isOpen(): boolean {
    return this.webSocket.readyState === ReconnectingWebSocket.OPEN
  }
}
