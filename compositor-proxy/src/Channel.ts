import { Kcp } from './kcp'
import { ChannelDesc, FeedbackChannelDesc, sendConnectionRequest } from './SignalingController'
import { WebSocket } from 'uWebSockets.js'

const MTU = 64000
const MAX_BUFFERED_AMOUNT = 2949120
const SND_WINDOW_SIZE = 128
const RCV_WINDOW_SIZE = 1024
const INTERVAL = 1000

let nextChannelId = 1

export interface Channel {
  readonly desc: ChannelDesc
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onMessage: (buffer: Buffer) => void

  send(buffer: Buffer): void
  close(): void
}

export interface WebSocketChannel extends Channel {
  doOpen(ws: WebSocket<any>): void
  doMessage(buffer: Buffer): void
  doClose(): void
}

export function createXWMDataChannel(clientId: string): Channel {
  const desc: ChannelDesc = {
    id: `${nextChannelId++}`,
    type: 'xwm',
    clientId,
  }
  const channel = new ARQChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export function createFrameDataChannel(clientId: string): Channel {
  const desc: ChannelDesc = {
    id: `${nextChannelId++}`,
    type: 'frame',
    clientId,
  }
  const channel = new ARQChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export function createProtocolChannel(clientId: string): Channel {
  const desc: ChannelDesc = {
    id: `${nextChannelId++}`,
    type: 'protocol',
    clientId,
  }
  const channel = new ARQChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export function createFeedbackChannel(clientId: string, surfaceId: number): Channel {
  const desc: FeedbackChannelDesc = {
    id: `${nextChannelId++}`,
    type: 'feedback',
    clientId,
    surfaceId,
  }
  const channel = new SimpleChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export class SimpleChannel implements WebSocketChannel {
  onOpen = () => {
    /*noop*/
  }
  onClose = () => {
    /*noop*/
  }
  onMessage = (event: Buffer) => {
    /*noop*/
  }
  private ws?: WebSocket<any>

  constructor(readonly desc: ChannelDesc) {}

  doOpen(ws: WebSocket<any>): void {
    this.ws = ws
    this.onOpen()
  }
  doMessage(buffer: Buffer): void {
    this.onMessage(buffer)
  }
  doClose(): void {
    this.ws = undefined
    this.onClose()
  }

  get isOpen() {
    return this.ws !== undefined
  }

  send(buffer: Buffer): void {
    if (this.ws && this.ws.getBufferedAmount() <= MAX_BUFFERED_AMOUNT) {
      this.ws.send(buffer, true)
    }
  }

  close(): void {
    if (this.ws) {
      this.ws.close()
    }
  }
}

export class ARQChannel implements WebSocketChannel {
  private readonly kcp: Kcp
  onOpen = () => {
    /*noop*/
  }
  onClose = () => {
    /*noop*/
  }
  onMessage = (event: Buffer) => {
    /*noop*/
  }
  private checkInterval?: NodeJS.Timer
  private ws?: WebSocket<any>

  constructor(public readonly desc: ChannelDesc) {
    const kcp = new Kcp(+this.desc.id, this)
    kcp.setMtu(MTU) // webrtc datachannel MTU
    kcp.setWndSize(SND_WINDOW_SIZE, RCV_WINDOW_SIZE)
    kcp.setNoDelay(1, INTERVAL, 0, 1)
    kcp.setOutput((data, len) => {
      if (this.ws && this.ws.getBufferedAmount() <= MAX_BUFFERED_AMOUNT) {
        // TODO handle backpressure
        this.ws.send(data.subarray(0, len), true)
        this.kcp.update()
      }
    })

    this.check(kcp)
    this.kcp = kcp
  }

  send(buffer: Buffer) {
    if (this.kcp) {
      this.kcp.send(buffer)
      this.kcp.flush(false)
    }
  }

  private check(kcp: Kcp) {
    this.checkInterval = setInterval(() => {
      kcp.update()
    }, INTERVAL)
  }

  close(): void {
    if (this.ws) {
      this.ws.close()
    }
  }

  get isOpen() {
    return this.ws !== undefined
  }

  doClose(): void {
    if (this.kcp) {
      if (this.checkInterval) {
        clearInterval(this.checkInterval)
        this.checkInterval = undefined
      }
      this.kcp.release()
      this.ws = undefined
    }
    this.onClose()
  }

  doMessage(buffer: Buffer): void {
    if (this.kcp.snd_buf === undefined) {
      return
    }
    this.kcp.input(buffer, true, false)
    let size = -1
    while ((size = this.kcp.peekSize()) >= 0) {
      const buffer = Buffer.alloc(size)
      const len = this.kcp.recv(buffer)
      if (len >= 0) {
        this.onMessage(buffer.subarray(0, size))
      }
    }
  }

  doOpen(ws: WebSocket<any>): void {
    this.ws = ws
    this.onOpen()
  }
}
