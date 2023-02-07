import { Kcp } from './kcp'
import { DataChannelDesc, FeedbackDataChannelDesc } from './SignalingController'
import { PeerConnectionState } from './CompositorProxySession'
import { RTCDataChannel, RTCDataChannelInit, RTCDataChannelState, RTCErrorEvent, RTCPeerConnection } from '@koush/wrtc'

const MAX_BUFFERED_AMOUNT = 1048576
const MTU = 1200 // webrtc datachannel MTU
const SND_WINDOW_SIZE = 256
const RCV_WINDOW_SIZE = 256

const dataChannelConfig: RTCDataChannelInit = {
  ordered: false,
  maxRetransmits: 0,
}

function createDataChannel(peerConnection: RTCPeerConnection, desc: DataChannelDesc): RTCDataChannel {
  return peerConnection.createDataChannel(JSON.stringify(desc), dataChannelConfig)
}

function createARQDataChannel(
  peerConnectionState: PeerConnectionState,
  type: DataChannelDesc['type'],
  clientId: string,
  desc: DataChannelDesc = {
    type,
    clientId,
  },
): ARQDataChannel {
  const dataChannel = createDataChannel(peerConnectionState.peerConnection, desc)
  const arqDataChannel = new ARQDataChannel(peerConnectionState, dataChannel, desc)
  peerConnectionState.peerConnectionResetListeners.push(arqDataChannel.resetListener)
  return arqDataChannel
}

export function createXWMDataChannel(peerConnectionState: PeerConnectionState, clientId: string): ARQDataChannel {
  return createARQDataChannel(peerConnectionState, 'xwm', clientId)
}

export function createFrameDataChannel(peerConnectionState: PeerConnectionState, clientId: string): ARQDataChannel {
  return createARQDataChannel(peerConnectionState, 'frame', clientId)
}

export function createProtocolChannel(peerConnectionState: PeerConnectionState, clientId: string): ARQDataChannel {
  return createARQDataChannel(peerConnectionState, 'protocol', clientId)
}

export function createFeedbackChannel(
  peerConnectionState: PeerConnectionState,
  clientId: string,
  surfaceId: number,
): ARQDataChannel {
  const feedbackDataChannelDesc: FeedbackDataChannelDesc = {
    type: 'feedback',
    clientId,
    surfaceId,
  }
  return createARQDataChannel(peerConnectionState, 'feedback', clientId, feedbackDataChannelDesc)
}

export class ARQDataChannel {
  private kcp?: Kcp
  private openCb?: () => void
  private closeCb?: () => void
  private errorCb?: (err: RTCErrorEvent) => void
  private msgCb?: (event: Buffer) => void
  public resetListener = (newPeerConnection: RTCPeerConnection) => {
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
    if (kcp.snd_buf === undefined) {
      return
    }

    kcp.update()

    setTimeout(() => {
      this.check(kcp)
    }, kcp.check())
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
    kcp.setNoDelay(1, 30, 2, 1)
    kcp.setOutput((data, len) => {
      if (dataChannel.readyState === 'open' && dataChannel.bufferedAmount <= MAX_BUFFERED_AMOUNT) {
        dataChannel.send(data.subarray(0, len))
      }
    })

    dataChannel.addEventListener('message', (message) => {
      if (kcp.snd_buf === undefined) {
        return
      }
      // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
      kcp.input(Buffer.from(message.data as ArrayBuffer), true, false)
      const size = kcp.peekSize()
      if (size > 0) {
        const buffer = Buffer.alloc(size)
        const len = kcp.recv(buffer)
        if (len > 0 && this.msgCb) {
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

  onClosed(cb: () => void): void {
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
