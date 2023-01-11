import { DataChannel, PeerConnection } from 'node-datachannel'
import { URLSearchParams } from 'url'
// import { KCP } from 'node-kcp-x'

// function checkLoop(kcpDataChannel: KCP) {
//   const next = kcpDataChannel.check(Date.now())
//   setTimeout(() => {
//     kcpDataChannel.update(Date.now())
//     checkLoop(kcpDataChannel)
//   }, next)
// }

export function createXWMDataChannel(peerConnection: PeerConnection, clientId: string) {
  const labelParams = new URLSearchParams()
  labelParams.append('t', 'xwm')
  labelParams.append('cid', clientId)

  // TODO wrap with KCP ARQ protocol: https://github.com/skywind3000/kcp/blob/master/README.en.md
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

  // TODO wrap with KCP ARQ protocol: https://github.com/skywind3000/kcp/blob/master/README.en.md
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

  // TODO wrap with KCP ARQ protocol: https://github.com/skywind3000/kcp/blob/master/README.en.md
  const dataChannel = peerConnection.createDataChannel(labelParams.toString(), {
    ordered: false,
    maxRetransmits: 0,
  })

  return new ARQDataChannel(dataChannel)
}

export class ARQDataChannel {
  // private kcpDataChannel?: KCP

  constructor(private readonly dataChannel: DataChannel) {
    // const kcpDataChannel = new KCP(dataChannel.getId(), {})
    // this.kcpDataChannel = kcpDataChannel
    // this.kcpDataChannel.nodelay(1, 15, 2, 1)
    // this.kcpDataChannel.setmtu(1192)
    //
    // this.kcpDataChannel.output((data: Buffer, size) => {
    //   dataChannel.sendMessageBinary(data)
    // })
    //
    // this.dataChannel.onMessage((message) => {
    //   if (typeof message === 'string') {
    //     throw new Error('Only binary data supported')
    //   }
    //   // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    //   kcpDataChannel.input(message)
    // })
    //
    // checkLoop(kcpDataChannel)
  }

  sendMessageBinary(buffer: Buffer) {
    // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    // TODO this.kcpDataChannel.send(buffer)
    this.dataChannel.sendMessageBinary(buffer)
  }

  close(): void {
    this.dataChannel.close()
  }

  isOpen(): boolean {
    return this.dataChannel.isOpen()
  }

  onOpen(cb: () => void): void {
    this.dataChannel.onOpen(cb)
  }

  onClosed(cb: () => void): void {
    this.dataChannel.onClosed(cb)
  }

  onError(cb: (err: string) => void): void {
    this.dataChannel.onError(cb)
  }

  onMessage(cb: (msg: string | Buffer) => void): void {
    // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    // TODO from KCP
    this.dataChannel.onMessage(cb)
  }
}
