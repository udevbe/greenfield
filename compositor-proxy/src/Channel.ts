import { Kcp } from './kcp'
import { DataChannelDesc, FeedbackDataChannelDesc } from './SignalingController'
import { PeerConnectionState } from './CompositorProxySession'
import { RTCDataChannel, RTCDataChannelInit, RTCDataChannelState, RTCErrorEvent, RTCPeerConnection } from '@koush/wrtc'

const MAX_BUFFERED_AMOUNT = 1048576
const MTU = 1200 // webrtc datachannel MTU
const SND_WINDOW_SIZE = 1024
const RCV_WINDOW_SIZE = 128

const dataChannelConfig: RTCDataChannelInit = {
  ordered: false,
  maxRetransmits: 0,
}

function createDataChannel(peerConnection: RTCPeerConnection, desc: DataChannelDesc): RTCDataChannel {
  return peerConnection.createDataChannel(JSON.stringify(desc), dataChannelConfig)
}

export interface Channel {
  send(buffer: ArrayBufferView): void

  close(): void

  readyState: RTCDataChannelState

  onOpen(cb: () => void): void

  onClose(cb: () => void): void

  onError(cb: (err: RTCErrorEvent) => void): void

  onMessage(cb: (msg: Buffer) => void): void
}

function createARQChannel(
  peerConnectionState: PeerConnectionState,
  type: DataChannelDesc['type'],
  clientId: string,
  desc: DataChannelDesc = {
    type,
    clientId,
  },
): ARQChannel {
  const dataChannel = createDataChannel(peerConnectionState.peerConnection, desc)
  const arqDataChannel = new ARQChannel(peerConnectionState, dataChannel, desc)
  peerConnectionState.peerConnectionResetListeners.push(arqDataChannel.resetListener)
  return arqDataChannel
}

function createSimpleChannel(
  peerConnectionState: PeerConnectionState,
  type: DataChannelDesc['type'],
  clientId: string,
  desc: DataChannelDesc = {
    type,
    clientId,
  },
): SimpleChannel {
  const dataChannel = createDataChannel(peerConnectionState.peerConnection, desc)
  const simpleChannel = new SimpleChannel(peerConnectionState, dataChannel, desc)
  peerConnectionState.peerConnectionResetListeners.push(simpleChannel.resetListener)
  return simpleChannel
}

export function createXWMDataChannel(peerConnectionState: PeerConnectionState, clientId: string): Channel {
  return createARQChannel(peerConnectionState, 'xwm', clientId)
}

export function createFrameDataChannel(peerConnectionState: PeerConnectionState, clientId: string): Channel {
  return createARQChannel(peerConnectionState, 'frame', clientId)
}

export function createProtocolChannel(peerConnectionState: PeerConnectionState, clientId: string): Channel {
  return createARQChannel(peerConnectionState, 'protocol', clientId)
}

export function createFeedbackChannel(
  peerConnectionState: PeerConnectionState,
  clientId: string,
  surfaceId: number,
): Channel {
  const feedbackDataChannelDesc: FeedbackDataChannelDesc = {
    type: 'feedback',
    clientId,
    surfaceId,
  }
  return createSimpleChannel(peerConnectionState, 'feedback', clientId, feedbackDataChannelDesc)
}

export class SimpleChannel implements Channel {
  private openCb?: () => void
  private msgCb?: (msg: Buffer) => void
  private closeCb?: () => void
  private errorCb?: (err: RTCErrorEvent) => void
  public readonly resetListener = (newPeerConnection: RTCPeerConnection) => {
    this.resetDataChannel(newPeerConnection)
  }

  constructor(
    private readonly peerConnectionState: PeerConnectionState,
    private dataChannel: RTCDataChannel,
    private readonly desc: DataChannelDesc,
  ) {
    this.addDataChannelListeners(dataChannel)
  }

  private addDataChannelListeners(dataChannel: RTCDataChannel) {
    dataChannel.binaryType = 'arraybuffer'
    if (dataChannel.readyState === 'open') {
      this.openCb?.()
    } else {
      dataChannel.addEventListener(
        'open',
        () => {
          this.openCb?.()
        },
        { passive: true, once: true },
      )
    }
    dataChannel.addEventListener(
      'close',
      () => {
        this.closeCb?.()
      },
      { passive: true, once: true },
    )
    dataChannel.addEventListener(
      'error',
      // @ts-ignore
      (err: RTCErrorEvent) => {
        this.errorCb?.(err)
      },
      { passive: true },
    )
    dataChannel.addEventListener(
      'message',
      (ev) => {
        if (this.msgCb) {
          this.msgCb(Buffer.from(ev.data as ArrayBuffer))
        }
      },
      { passive: true },
    )
  }

  get readyState(): RTCDataChannelState {
    return this.dataChannel.readyState
  }

  send(buffer: ArrayBufferView): void {
    if (this.dataChannel.readyState === 'open' && this.dataChannel.bufferedAmount <= MAX_BUFFERED_AMOUNT) {
      this.dataChannel.send(buffer)
    }
  }

  close(): void {
    if (this.dataChannel.readyState === 'open' || this.dataChannel.readyState === 'connecting') {
      this.dataChannel.close()
    }
  }

  onOpen(cb: () => void): void {
    this.openCb = cb
  }

  onClose(cb: () => void): void {
    this.closeCb = cb
  }

  onError(cb: (err: RTCErrorEvent) => void): void {
    this.errorCb = cb
  }

  onMessage(cb: (msg: Buffer) => void): void {
    this.msgCb = cb
  }

  resetDataChannel(newPeerConnection: RTCPeerConnection) {
    if (this.dataChannel.readyState === 'open' || this.dataChannel.readyState === 'connecting') {
      this.dataChannel.close()
    }
    const dataChannel = createDataChannel(newPeerConnection, this.desc)
    this.dataChannel = dataChannel
    this.addDataChannelListeners(dataChannel)
  }
}

export class ARQChannel implements Channel {
  private kcp?: Kcp
  private openCb?: () => void
  private closeCb?: () => void
  private errorCb?: (err: RTCErrorEvent) => void
  private msgCb?: (event: Buffer) => void
  public readonly resetListener = (newPeerConnection: RTCPeerConnection) => {
    this.resetDataChannel(newPeerConnection)
  }
  private checkInterval?: NodeJS.Timer

  constructor(
    private readonly peerConnectionState: PeerConnectionState,
    private dataChannel: RTCDataChannel,
    private readonly desc: DataChannelDesc,
  ) {
    this.addDataChannelListeners(dataChannel)
  }

  private addDataChannelListeners(dataChannel: RTCDataChannel) {
    dataChannel.binaryType = 'arraybuffer'
    if (dataChannel.readyState === 'open') {
      this.initKcp(dataChannel)
      this.openCb?.()
    } else {
      dataChannel.addEventListener(
        'open',
        () => {
          this.initKcp(dataChannel)
          this.openCb?.()
        },
        { passive: true, once: true },
      )
    }
    dataChannel.addEventListener(
      'close',
      () => {
        if (this.kcp) {
          if (this.checkInterval) {
            clearInterval(this.checkInterval)
            this.checkInterval = undefined
          }
          this.kcp.release()
          this.kcp = undefined
        }
        this.closeCb?.()
      },
      { passive: true, once: true },
    )
    dataChannel.addEventListener(
      'error',
      // @ts-ignore
      (err: RTCErrorEvent) => {
        this.errorCb?.(err)
      },
      { passive: true },
    )
  }

  send(buffer: Buffer) {
    // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    if (this.kcp) {
      this.kcp.send(buffer)
      this.kcp.flush(false)
    }
  }

  private check(kcp: Kcp) {
    this.checkInterval = setInterval(() => {
      kcp.update()
    }, 10)
  }

  close(): void {
    if (this.dataChannel.readyState === 'open' || this.dataChannel.readyState === 'connecting') {
      this.dataChannel.close()
    }
    const index = this.peerConnectionState.peerConnectionResetListeners.indexOf(this.resetListener)
    if (index > -1) {
      this.peerConnectionState.peerConnectionResetListeners.splice(index, 1)
    }
  }

  get readyState(): RTCDataChannelState {
    return this.dataChannel.readyState
  }

  private initKcp(dataChannel: RTCDataChannel) {
    if (dataChannel.id === null) {
      throw new Error('BUG. Datachannel does not have an id.')
    }
    const kcp = new Kcp(dataChannel.id, this)
    kcp.setMtu(MTU) // webrtc datachannel MTU
    kcp.setWndSize(SND_WINDOW_SIZE, RCV_WINDOW_SIZE)
    kcp.setNoDelay(1, 10, 2, 1)
    kcp.setOutput((data, len) => {
      if (dataChannel.readyState === 'open' && dataChannel.bufferedAmount <= MAX_BUFFERED_AMOUNT) {
        dataChannel.send(data.subarray(0, len))
        setTimeout(() => {
          if (dataChannel.readyState === 'open') {
            kcp.update()
          }
        })
      }
    })

    dataChannel.addEventListener('message', (message) => {
      if (kcp.snd_buf === undefined) {
        return
      }
      // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
      kcp.input(Buffer.from(message.data as ArrayBuffer), true, false)
      let size = -1
      while ((size = kcp.peekSize()) >= 0) {
        const buffer = Buffer.alloc(size)
        const len = kcp.recv(buffer)
        if (len >= 0 && this.msgCb) {
          this.msgCb(buffer.subarray(0, size))
        }
      }
    })

    this.check(kcp)
    this.kcp = kcp
  }

  onOpen(cb: () => void): void {
    this.openCb = cb
  }

  onClose(cb: () => void): void {
    this.closeCb = cb
  }

  onError(cb: (err: RTCErrorEvent) => void): void {
    this.errorCb = cb
  }

  onMessage(cb: (msg: Buffer) => void): void {
    this.msgCb = cb
  }

  resetDataChannel(newPeerConnection: RTCPeerConnection) {
    if (this.dataChannel.readyState === 'open' || this.dataChannel.readyState === 'connecting') {
      this.dataChannel.close()
    }
    const dataChannel = createDataChannel(newPeerConnection, this.desc)
    this.dataChannel = dataChannel
    this.addDataChannelListeners(dataChannel)
  }
}
