export class ARQDataChannel {
  constructor(public readonly dataChannel: RTCDataChannel) {}

  send(buffer: ArrayBufferView) {
    // TODO KCP
    // TODO forward error correction: https://github.com/ronomon/reed-solomon#readme & https://github.com/skywind3000/kcp/wiki/KCP-Best-Practice-EN
    this.dataChannel.send(buffer)
  }

  close(): void {
    this.dataChannel.close()
  }

  get readyState(): RTCDataChannelState {
    return this.dataChannel.readyState
  }

  onOpen(cb: () => void): void {
    this.dataChannel.addEventListener('open', cb, { passive: true })
  }

  onClose(cb: () => void): void {
    this.dataChannel.addEventListener('close', cb, { passive: true })
  }

  onError(cb: (err: Event) => void): void {
    this.dataChannel.addEventListener('error', cb, { passive: true })
  }

  onMessage(cb: (msg: MessageEvent<ArrayBuffer>) => void): void {
    this.dataChannel.addEventListener('message', cb, { passive: true })
  }
}
