import { DataChannel, DataChannelInitConfig, PeerConnection } from 'node-datachannel'
import { URLSearchParams } from 'url'
import { Kcp } from './kcp'
import { PeerConnectionState } from './CompositorProxySession'

const dataChannelConfig: DataChannelInitConfig = {
  ordered: false,
  maxRetransmits: 0,
}

function createDataChannel(peerConnectionState: PeerConnectionState, label: string) {
  const dataChannel = peerConnectionState.peerConnection.createDataChannel(label, dataChannelConfig)
  const arqDataChannel = new ARQDataChannel(dataChannel, label)
  peerConnectionState.peerConnectionResetListeners.push((newPeerConnection) => {
    if (arqDataChannel.state === 'connecting') {
      arqDataChannel.resetDataChannel(newPeerConnection)
    }
  })
  return arqDataChannel
}

export function createXWMDataChannel(peerConnectionState: PeerConnectionState, clientId: string) {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'xwm')
  labelParams.append('cid', clientId)
  return createDataChannel(peerConnectionState, labelParams.toString())
}

export function createFrameDataChannel(peerConnectionState: PeerConnectionState, clientId: string) {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'frmdt')
  labelParams.append('cid', clientId)
  return createDataChannel(peerConnectionState, labelParams.toString())
}

export function createProtocolChannel(peerConnectionState: PeerConnectionState, clientId: string): ARQDataChannel {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'prtcl')
  labelParams.append('cid', clientId)
  return createDataChannel(peerConnectionState, labelParams.toString())
}

export class ARQDataChannel {
  public state: 'connecting' | 'connected' | 'closed' = 'connecting'
  private kcp?: Kcp
  private openCb?: () => void
  private closeCb?: () => void
  private errorCb?: (err: string) => void
  private msgCb?: (event: Buffer) => void
  private checkTimer?: NodeJS.Timeout

  constructor(private dataChannel: DataChannel, private readonly label: string) {
    this.addDataChannelListeners(dataChannel)
  }

  private addDataChannelListeners(dataChannel: DataChannel) {
    if (dataChannel.isOpen()) {
      this.initKcp(dataChannel)
      this.openCb?.()
    } else {
      dataChannel.onOpen(() => {
        this.initKcp(dataChannel)
        this.openCb?.()
      })
    }
    dataChannel.onClosed(() => {
      this.close()
      this.closeCb?.()
    })
    dataChannel.onError((err) => {
      this.errorCb?.(err)
    })
  }

  sendMessageBinary(buffer: Buffer) {
    // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    if (this.kcp) {
      this.kcp.send(buffer)
      this.kcp.flush(false)
    }
  }

  close(): void {
    if (this.checkTimer) {
      clearTimeout(this.checkTimer)
      this.checkTimer = undefined
    }

    if (this.dataChannel.isOpen() && this.kcp) {
      this.kcp.flush(true)
    }

    this.dataChannel.close()
    this.state = 'closed'

    if (this.kcp) {
      this.kcp.release()
      this.kcp = undefined
    }
  }

  isOpen(): boolean {
    return this.dataChannel.isOpen()
  }

  private check(kcp: Kcp) {
    kcp.update()
    this.checkTimer = setTimeout(() => {
      this.check(kcp)
    }, kcp.check())
  }

  private initKcp(dataChannel: DataChannel) {
    this.state = 'connected'
    if (dataChannel.getId() === 0) {
      throw new Error('BUG. Datachannel does not have an id.')
    }
    const kcp = new Kcp(dataChannel.getId(), {})
    this.kcp = kcp
    kcp.setMtu(1200) // webrtc datachannel MTU
    kcp.setWndSize(256, 256)
    kcp.setNoDelay(1, 20, 2, 1)
    kcp.setOutput((data, size) => {
      if (dataChannel.isOpen()) {
        dataChannel.sendMessageBinary(data.subarray(0, size))
      }
      // else {
      //   throw new Error(`BUG. Sending message on a closed channel`)
      // }
    })

    dataChannel.onMessage((message) => {
      if (this.kcp === undefined) {
        throw new Error(`BUG. Received message on a closed channel`)
      }
      // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
      kcp.input(message as Buffer, true, false)
      const size = kcp.peekSize()
      if (size > 0) {
        const buffer = Buffer.alloc(size)
        kcp.recv(buffer)
        if (this.msgCb) {
          this.msgCb(buffer.subarray(0, size))
        }
      }
    })
    this.check(kcp)
  }

  onOpen(cb: () => void): void {
    this.openCb = cb
  }

  onClosed(cb: () => void): void {
    this.closeCb = cb
  }

  onError(cb: (err: string) => void): void {
    this.errorCb = cb
  }

  onMessage(cb: (msg: Buffer) => void): void {
    this.msgCb = cb
  }

  resetDataChannel(peerConnection: PeerConnection) {
    this.close()
    const dataChannel = peerConnection.createDataChannel(this.label, dataChannelConfig)
    this.dataChannel = dataChannel
    this.addDataChannelListeners(dataChannel)
  }
}
