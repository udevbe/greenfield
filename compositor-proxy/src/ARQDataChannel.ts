import { DataChannel, PeerConnection } from 'node-datachannel'
import { URLSearchParams } from 'url'
import { Kcp } from './kcp'

export function createXWMDataChannel(peerConnection: PeerConnection, clientId: string) {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'xwm')
  labelParams.append('cid', clientId)

  const dataChannel = peerConnection.createDataChannel(labelParams.toString(), {
    ordered: false,
    maxRetransmits: 0,
  })

  return new ARQDataChannel(dataChannel)
}

export function createFrameDataChannel(peerConnection: PeerConnection, clientId: string) {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'frmdt')
  labelParams.append('cid', clientId)

  const dataChannel = peerConnection.createDataChannel(labelParams.toString(), {
    ordered: false,
    maxRetransmits: 0,
  })

  return new ARQDataChannel(dataChannel)
}

export function createProtocolChannel(peerConnection: PeerConnection, clientId: string): ARQDataChannel {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'prtcl')
  labelParams.append('cid', clientId)

  const dataChannel = peerConnection.createDataChannel(labelParams.toString(), {
    ordered: false,
    maxRetransmits: 0,
  })

  return new ARQDataChannel(dataChannel)
}

export class ARQDataChannel {
  private kcp?: Kcp
  private msgCb?: (msg: Buffer) => void
  private openCb?: () => void
  private checkTimer?: NodeJS.Timeout

  constructor(private readonly dataChannel: DataChannel) {
    if (dataChannel.isOpen()) {
      this.initKcp()
    } else {
      this.dataChannel.onOpen(() => {
        this.initKcp()
        this.openCb?.()
      })
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
      this.kcp.flush(false)
      this.kcp.release()
      this.kcp = undefined
    }
    if (this.dataChannel.isOpen()) {
      this.dataChannel.close()
    }
  }

  isOpen(): boolean {
    return this.dataChannel.isOpen()
  }

  private checkLoop(kcp: Kcp) {
    kcp.update()
    this.checkTimer = setTimeout(() => {
      this.checkLoop(kcp)
    }, kcp.check())
  }

  private initKcp() {
    const kcp = new Kcp(this.dataChannel.getId(), {})
    kcp.setNoDelay(1, 20, 2, 1)
    kcp.setMtu(1200) // webrtc datachannel MTU
    kcp.setWndSize(256, 256)

    kcp.setOutput((data, size) => {
      this.dataChannel.sendMessageBinary(data.subarray(0, size))
    })

    this.dataChannel.onMessage((message) => {
      if (typeof message === 'string') {
        throw new Error('Only binary data supported')
      }
      // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
      kcp.input(message, true, false)
      const size = kcp.peekSize()
      if (size > 0) {
        const buffer = Buffer.alloc(size)
        kcp.recv(buffer)
        if (this.msgCb) {
          this.msgCb(buffer.subarray(0, size))
        }
      }
    })

    this.kcp = kcp
    this.checkLoop(kcp)
  }

  onOpen(cb: () => void): void {
    if (this.dataChannel.isOpen()) {
      cb()
    } else {
      this.openCb = cb
    }
  }

  onClosed(cb: () => void): void {
    this.dataChannel.onClosed(() => {
      this.close()
      cb()
    })
  }

  onError(cb: (err: string) => void): void {
    this.dataChannel.onError(cb)
  }

  onMessage(cb: (msg: Buffer) => void): void {
    this.msgCb = cb
  }
}
