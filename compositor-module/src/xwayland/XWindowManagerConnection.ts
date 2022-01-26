import { connect, webConnectionSetup, XConnection } from 'xtsb'
import { RetransmittingWebSocket } from 'retransmitting-websocket'
import Session from '../Session'

export class XWindowManagerConnection {
  static create(session: Session, webSocket: RetransmittingWebSocket): Promise<XWindowManagerConnection> {
    return new Promise<XWindowManagerConnection>((resolve, reject) => {
      webSocket.binaryType = 'arraybuffer'
      webSocket.onopen = async (_) => {
        webSocket.onerror = (ev) => session.logger.error(`XWM connection ${webSocket.url} error: ${ev}`)
        const xwm = new XWindowManagerConnection(webSocket)
        webSocket.onclose = (_) => xwm.destroy()
        resolve(xwm)
      }
      webSocket.onerror = (ev) => {
        if (webSocket.readyState === WebSocket.CONNECTING) {
          reject(new Error(`XWM connection ${webSocket.url} failed: ${ev}`))
        }
      }
    })
  }

  // @ts-ignore assigned in constructor in promise cb
  private destroyResolve: (value?: PromiseLike<void> | void) => void
  private readonly destroyPromise: Promise<void>

  // @ts-ignore assigned in constructor in promise cb
  private setupPromise?: Promise<XConnection>

  xConnection?: XConnection
  readonly webSocket: RetransmittingWebSocket

  constructor(webSocket: RetransmittingWebSocket) {
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
