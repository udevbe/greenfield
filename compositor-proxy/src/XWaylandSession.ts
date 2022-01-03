import { RetransmittingWebSocket } from 'retransmitting-websocket'
import { createLogger } from './Logger'
import { Endpoint } from 'westfield-endpoint'
import { nodeFDConnectionSetup } from 'xtsb'
import { ClientEntry, NativeCompositorSession } from './NativeCompositorSession'

const logger = createLogger('xwayland')

export class XWaylandSession {
  private nativeXWayland?: unknown
  private xWaylandClient?: ClientEntry
  xwmWebSocket?: RetransmittingWebSocket

  constructor(private nativeCompositorSession: NativeCompositorSession) {}

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

    const { wmFd, wlClient } = await onXWaylandStarting

    // SIGUSR1 is raised once Xwayland is done initializing.
    process.on('SIGUSR1', () => {
      logger.info('XWayland started.')
      process.on('SIGCHLD', () => {
        // TODO call to native code
      })

      const xWaylandClient = this.nativeCompositorSession.clients.find((value) => {
        if (value.nativeClientSession === undefined) {
          return false
        }
        return Endpoint.equalValueExternal(value.nativeClientSession.wlClient, wlClient)
      })

      if (xWaylandClient === undefined) {
        logger.error('BUG? Could not find a XWayland wayland client entry after XWayland startup.')
        return
      }

      if (xWaylandClient.nativeClientSession === undefined) {
        logger.error('BUG? Found XWaylandClient entry but it did not have a native wayland client session associated.')
        return
      }

      xWaylandClient.nativeClientSession.onDestroy().then(() => {
        this.destroy()
      })
      xWaylandClient.webSocket.send(Uint32Array.from([7, wmFd]).buffer)
      this.xWaylandClient = xWaylandClient
    })
  }

  async createXWMConnection(xwmWebSocket: RetransmittingWebSocket, wmFD: number): Promise<void> {
    logger.info('Handling incoming XWM connection')
    // initialize an X11 client connection, used by the compositor's X11 window manager.
    const { xConnectionSocket, setup } = await nodeFDConnectionSetup(wmFD)()

    const setupJSON = JSON.stringify(setup)
    xwmWebSocket.send(setupJSON)

    xwmWebSocket.binaryType = 'arraybuffer'
    xwmWebSocket.onmessage = (ev) => {
      if (ev.data instanceof ArrayBuffer) {
        xConnectionSocket.write(Buffer.from(ev.data))
      }
    }
    xwmWebSocket.onclose = () => xConnectionSocket.close()
    xwmWebSocket.onerror = (ev) => console.error('XConnection websocket error: ' + ev)

    this.xwmWebSocket = xwmWebSocket
    xConnectionSocket.onData = (data) => this.xwmWebSocket?.send(data)
  }

  destroy(): void {
    if (this.xwmWebSocket) {
      this.xwmWebSocket.close()
      this.xwmWebSocket = undefined
    }

    if (this.nativeXWayland) {
      Endpoint.teardownXWayland(this.nativeXWayland)
      this.nativeXWayland = undefined
    }

    if (this.xWaylandClient) {
      this.xWaylandClient.nativeClientSession?.destroy()
      this.xWaylandClient.webSocket.close()
      this.xWaylandClient = undefined
    }
  }

  private listenXWayland(): {
    onXWaylandStarting: Promise<{ wmFd: number; wlClient: unknown }>
    onDestroyed: Promise<void>
  } {
    let destroyResolve: () => void
    const onDestroyed = new Promise<void>((resolve) => {
      destroyResolve = resolve
    })

    const onXWaylandStarting = new Promise<{
      wmFd: number
      wlClient: unknown
      display: unknown
    }>((resolve) => {
      let display: unknown
      this.nativeXWayland = Endpoint.setupXWayland(
        this.nativeCompositorSession.wlDisplay,
        (wmFd, wlClient) => {
          resolve({ wmFd, wlClient, display })
        },
        () => {
          destroyResolve()
        },
      )
    })

    return { onXWaylandStarting, onDestroyed }
  }
}
