import { RetransmittingWebSocket, WebSocketLike } from 'retransmitting-websocket'
import { createLogger } from './Logger'
import { nodeFDConnectionSetup } from 'xtsb'
import { ClientEntry, NativeCompositorSession } from './NativeCompositorSession'
import { equalValueExternal, setupXWayland, teardownXWayland } from 'westfield-proxy'
import { createReadStream } from 'fs'

const logger = createLogger('xwayland')

export class XWaylandSession {
  private nativeXWayland?: unknown
  private xWaylandClient?: ClientEntry

  constructor(
    private nativeCompositorSession: NativeCompositorSession,
    private xwmWebSocket?: RetransmittingWebSocket,
  ) {}

  static create(nativeCompositorSession: NativeCompositorSession): XWaylandSession {
    return new XWaylandSession(nativeCompositorSession)
  }

  /**
   * Don't await as this function will block until an XClient is connecting!
   */
  async createXWaylandListenerSocket(): Promise<void> {
    // Will only continue once an XWayland server is launching which is triggered by an X client trying to connect.
    const { onXWaylandStarting, onDestroyed } = this.listenXWayland()

    onDestroyed.then(() => {
      this.xWaylandClient = undefined
      this.destroy()
    })

    const { wmFd, wlClient, displayFd } = await onXWaylandStarting

    createReadStream('ignored', {
      fd: displayFd,
      autoClose: true,
    }).on('data', (chunk) => {
      logger.info('XWayland started.')

      const xWaylandClient = this.nativeCompositorSession.clients.find((value) => {
        if (value.nativeClientSession === undefined) {
          return false
        }
        return equalValueExternal(value.nativeClientSession.wlClient, wlClient)
      })

      if (xWaylandClient === undefined) {
        logger.error('BUG? Could not find a XWayland wayland client entry after XWayland startup.')
        return
      }

      if (xWaylandClient.nativeClientSession === undefined) {
        logger.error('BUG? Found XWaylandClient entry but it did not have a native wayland client session associated.')
        return
      }

      xWaylandClient.nativeClientSession.onDestroy().then(() => this.destroy())
      xWaylandClient.webSocket.send(Uint32Array.from([7, wmFd]).buffer)
      this.xWaylandClient = xWaylandClient
    })
  }

  async upsertXWMConnection(xwmWebSocket: WebSocketLike, wmFD: number): Promise<void> {
    logger.info('Handling incoming XWM connection')
    if (this.xwmWebSocket) {
      // reconnecting, no need to do anything
      this.xwmWebSocket.useWebSocket(xwmWebSocket)
      return
    } else {
      this.xwmWebSocket = new RetransmittingWebSocket()
      this.xwmWebSocket.useWebSocket(xwmWebSocket)
    }
    // initialize an X11 client connection, used by the compositor's X11 window manager.
    const { xConnectionSocket, setup } = await nodeFDConnectionSetup(wmFD)()

    const setupJSON = JSON.stringify(setup)
    this.xwmWebSocket.send(setupJSON)
    this.xwmWebSocket.addEventListener('message', (ev) => {
      if (ev.data instanceof ArrayBuffer) {
        xConnectionSocket.write(Buffer.from(ev.data))
      }
    })
    this.xwmWebSocket.addEventListener('close', () => xConnectionSocket.close())
    this.xwmWebSocket.addEventListener('error', (ev) => console.error('XConnection websocket error: ' + ev))

    xConnectionSocket.onData = (data) => this.xwmWebSocket?.send(data)
  }

  destroy(): void {
    if (this.xwmWebSocket) {
      this.xwmWebSocket.close()
      this.xwmWebSocket = undefined
    }

    if (this.nativeXWayland) {
      teardownXWayland(this.nativeXWayland)
      this.nativeXWayland = undefined
    }

    if (this.xWaylandClient) {
      this.xWaylandClient.nativeClientSession?.destroy()
      this.xWaylandClient.webSocket.close()
      this.xWaylandClient = undefined
    }
  }

  private listenXWayland(): {
    onXWaylandStarting: Promise<{ wmFd: number; wlClient: unknown; displayFd: number }>
    onDestroyed: Promise<void>
  } {
    let destroyResolve: () => void
    const onDestroyed = new Promise<void>((resolve) => (destroyResolve = resolve))

    const onXWaylandStarting = new Promise<{
      wmFd: number
      wlClient: unknown
      display: unknown
      displayFd: number
    }>((resolve) => {
      let display: unknown
      this.nativeXWayland = setupXWayland(
        this.nativeCompositorSession.wlDisplay,
        (wmFd: number, wlClient: unknown, displayFd: number) => resolve({ wmFd, wlClient, display, displayFd }),
        () => destroyResolve(),
      )
    })

    return { onXWaylandStarting, onDestroyed }
  }
}
