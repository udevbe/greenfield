import { connect, webConnectionSetup, XConnection } from 'xtsb'
import { RetransmittingWebSocket } from '../../../../retransmit.js'
import Session from '../Session'

export class XWaylandConnection {
  static create(session: Session, webSocket: RetransmittingWebSocket): Promise<XWaylandConnection> {
    return new Promise<XWaylandConnection>((resolve, reject) => {
      webSocket.onopen = async (_) => {
        webSocket.onerror = (ev) => session.logger.error(`XWM connection ${webSocket.url} error: ${ev}`)
        const xwm = new XWaylandConnection(webSocket)
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
        this.xConnection = await connect(webConnectionSetup(this.webSocket as WebSocket))
        resolve(this.xConnection)
      })
    }
    return this.setupPromise
  }
}
