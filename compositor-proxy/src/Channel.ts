import { Kcp } from './kcp'
import { sendChannelDisconnect, sendConnectionRequest } from './SignalingController'
import { WebSocket } from 'uWebSockets.js'

const MTU = 64000
const MAX_BUFFERED_AMOUNT = 2949120
const SND_WINDOW_SIZE = 128
const RCV_WINDOW_SIZE = 1024
const INTERVAL = 100

let nextChannelId = 1

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

  ws?: WebSocket<any>
}

function createChannel(desc: ChannelDesc) {
  if (desc.channelType === ChannelType.ARQ) {
    return new ARQChannel(desc)
  } else if (desc.channelType === ChannelType.SIMPLE) {
    return new SimpleChannel(desc)
  } else {
    throw new Error(`BUG. Unknown channel type ${JSON.stringify(desc)}`)
  }
}

export function createXWMDataChannel(clientId: string): Channel {
  const desc: ChannelDesc = {
    id: `${nextChannelId++}`,
    type: ChannelDescriptionType.XWM,
    clientId,
    channelType: ChannelType.ARQ,
  }
  const channel = createChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export function createFrameDataChannel(clientId: string): Channel {
  const desc: ChannelDesc = {
    id: `${nextChannelId++}`,
    type: ChannelDescriptionType.FRAME,
    clientId,
    channelType: ChannelType.ARQ,
  }
  const channel = createChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export function createProtocolChannel(clientId: string): Channel {
  const desc: ChannelDesc = {
    id: `${nextChannelId++}`,
    type: ChannelDescriptionType.PROTOCOL,
    clientId,
    channelType: ChannelType.ARQ,
  }
  const channel = createChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export function createAudioChannel(clientId: string): Channel {
  const desc: ChannelDesc = {
    id: `${nextChannelId++}`,
    type: ChannelDescriptionType.AUDIO,
    clientId,
    channelType: ChannelType.SIMPLE,
  }
  const channel = createChannel(desc)
  sendConnectionRequest(channel)
  return channel
}

export function createFeedbackChannel(clientId: string, surfaceId: number): Channel {
  const desc: FeedbackChannelDesc = {
    id: `${nextChannelId++}`,
    type: ChannelDescriptionType.FEEDBACK,
    clientId,
    surfaceId,
    channelType: ChannelType.SIMPLE,
  }
  const channel = createChannel(desc)
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
  ws?: WebSocket<any>

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
    this.ws = undefined
    sendChannelDisconnect(this.desc.id)
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
  ws?: WebSocket<any>

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
    if (this.kcp.snd_buf) {
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
    this.ws = undefined
    sendChannelDisconnect(this.desc.id)
  }

  get isOpen() {
    return this.ws !== undefined
  }

  doClose(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = undefined
    }
    if (this.kcp.snd_buf) {
      this.kcp.release()
    }
    this.ws = undefined
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
