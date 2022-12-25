import { connect, webConnectionSetup, XConnection } from 'xtsb'
import type { WebSocketLike } from 'retransmitting-websocket'
import Session from '../../Session'

export class XWindowManagerConnection {
  static create(session: Session, webSocket: WebSocketLike): Promise<XWindowManagerConnection> {
    return new Promise<XWindowManagerConnection>((resolve, reject) => {
      let wasOpen = false
      webSocket.addEventListener('open', (_) => {
        wasOpen = true
        webSocket.addEventListener('error', (ev) => session.logger.error(`XWM connection error: ${ev}`))
        const xwm = new XWindowManagerConnection(webSocket)
        webSocket.addEventListener('close', (_) => xwm.destroy())
        resolve(xwm)
      })
      webSocket.addEventListener('error', (ev) => {
        if (wasOpen) {
          return
        }
        if (webSocket.readyState === WebSocket.CONNECTING) {
          reject(new Error(`XWM connection failed: ${ev}`))
        }
      })
    })
  }

  // @ts-ignore assigned in constructor in promise cb
  private destroyResolve: (value?: PromiseLike<void> | void) => void
  private readonly destroyPromise: Promise<void>

  // @ts-ignore assigned in constructor in promise cb
  private setupPromise?: Promise<XConnection>

  xConnection?: XConnection
  readonly webSocket: WebSocketLike

  constructor(webSocket: WebSocketLike) {
    this.webSocket = webSocket
    this.destroyPromise = new Promise<void>((resolve) => (this.destroyResolve = resolve))
  }

  destroy() {
    this.webSocket.close()
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }

  setup(): Promise<XConnection> {
    if (this.setupPromise === undefined) {
      this.setupPromise = new Promise<XConnection>(async (resolve) => {
        this.xConnection = await connect(webConnectionSetup(this.webSocket as unknown as WebSocket))
        resolve(this.xConnection)
      })
    }
    return this.setupPromise
  }
}
