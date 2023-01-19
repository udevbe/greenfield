import { MessageEvent, RTCDataChannel } from '@koush/wrtc'
import { URLSearchParams } from 'url'
import { Kcp } from './kcp'
import { PeerConnectionState } from './CompositorProxySession'

export function createXWMDataChannel(peerConnectionState: PeerConnectionState, clientId: string) {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'xwm')
  labelParams.append('cid', clientId)

  const dataChannel = peerConnectionState.peerConnection.createDataChannel(labelParams.toString(), {
    ordered: false,
    maxRetransmits: 0,
  })

  return new ARQDataChannel(dataChannel)
}

export function createFrameDataChannel(peerConnectionState: PeerConnectionState, clientId: string) {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'frmdt')
  labelParams.append('cid', clientId)

  const dataChannel = peerConnectionState.peerConnection.createDataChannel(labelParams.toString(), {
    ordered: false,
    maxRetransmits: 0,
  })

  return new ARQDataChannel(dataChannel)
}

export function createProtocolChannel(peerConnectionState: PeerConnectionState, clientId: string): ARQDataChannel {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'prtcl')
  labelParams.append('cid', clientId)

  const dataChannel = peerConnectionState.peerConnection.createDataChannel(labelParams.toString(), {
    ordered: false,
    maxRetransmits: 0,
  })

  return new ARQDataChannel(dataChannel)
}

export class ARQDataChannel {
  private kcp?: Kcp
  private msgCb?: (event: MessageEvent<ArrayBuffer>) => void
  private openCb?: () => void
  private checkTimer?: NodeJS.Timeout

  constructor(private readonly dataChannel: RTCDataChannel) {
    if (dataChannel.readyState === 'open') {
      this.initKcp()
    } else {
      this.dataChannel.addEventListener(
        'open',
        () => {
          this.initKcp()
          this.openCb?.()
        },
        {
          passive: true,
        },
      )
    }
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
    if (this.kcp) {
      this.kcp.release()
      this.kcp = undefined
    }
    if (this.dataChannel.readyState === 'open' || this.dataChannel.readyState === 'connecting') {
      this.dataChannel.close()
    }
  }

  isOpen(): boolean {
    return this.dataChannel.readyState === 'open'
  }

  private checkLoop(kcp: Kcp) {
    kcp.update()
    this.checkTimer = setTimeout(() => {
      this.checkLoop(kcp)
    }, kcp.check())
  }

  private initKcp() {
    if (this.dataChannel.id === null) {
      throw new Error('BUG. Datachannel does not have an id.')
    }
    const kcp = new Kcp(this.dataChannel.id, {})
    kcp.setNoDelay(1, 20, 2, 1)
    kcp.setMtu(1200) // webrtc datachannel MTU
    kcp.setWndSize(256, 256)

    kcp.setOutput((data, size) => {
      this.dataChannel.send(data.subarray(0, size))
    })

    this.dataChannel.addEventListener(
      'message',
      (message) => {
        if (typeof message.data === 'string') {
          throw new Error('Only binary data supported')
        }
        if (this.kcp === undefined) {
          return
        }
        // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
        this.kcp.input(Buffer.from(message.data), true, false)
        const size = kcp.peekSize()
        if (size > 0) {
          const buffer = Buffer.alloc(size)
          this.kcp.recv(buffer)
          if (this.msgCb) {
            this.msgCb({ data: buffer.subarray(0, size) })
          }
        }
      },
      {
        passive: true,
      },
    )

    this.kcp = kcp
    this.checkLoop(kcp)
  }

  onOpen(cb: () => void): void {
    if (this.dataChannel.readyState === 'open') {
      cb()
    } else {
      this.openCb = cb
    }
  }

  onClosed(cb: () => void): void {
    this.dataChannel.addEventListener('close', () => {
      this.close()
      cb()
    })
  }

  onError(cb: (err: Event) => void): void {
    this.dataChannel.addEventListener('error', cb)
  }

  onMessage(cb: (msg: MessageEvent<ArrayBuffer>) => void): void {
    this.msgCb = cb
  }
}
