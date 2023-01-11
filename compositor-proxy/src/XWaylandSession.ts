import { createLogger } from './Logger'
import { nodeFDConnectionSetup } from 'xtsb'
import { ClientEntry, NativeCompositorSession } from './NativeCompositorSession'
import { equalValueExternal, setupXWayland, teardownXWayland } from 'westfield-proxy'
import { createReadStream } from 'fs'
import { DataChannel } from 'node-datachannel'
import { ARQDataChannel, createXWMDataChannel } from './ARQDataChannel'

const logger = createLogger('xwayland')

export class XWaylandSession {
  private nativeXWayland?: unknown
  private xWaylandClient?: ClientEntry

  constructor(private nativeCompositorSession: NativeCompositorSession, private xwmDataChannel?: ARQDataChannel) {}

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

      const xwmDataChannel = createXWMDataChannel(this.nativeCompositorSession.peerConnection, xWaylandClient.clientId)
      this.upsertXWMConnection(xwmDataChannel, wmFd).catch((e: any) => {
        logger.error(`\tname: ${e.name} message: ${e.message} text: ${e.text}`)
        logger.error('error object stack: ')
        logger.error(e.stack)
        xwmDataChannel.close()
      })

      this.xWaylandClient = xWaylandClient
    })
  }

  async upsertXWMConnection(xwmDataChannel: ARQDataChannel, wmFD: number): Promise<void> {
    logger.info('Handling incoming XWM connection')
    this.xwmDataChannel = xwmDataChannel
    // initialize an X11 client connection, used by the compositor's X11 window manager.
    const { xConnectionSocket, setup } = await nodeFDConnectionSetup(wmFD)()

    const setupJSON = JSON.stringify(setup)
    xwmDataChannel.sendMessage(setupJSON)
    this.xwmDataChannel.onMessage((ev) => {
      if (ev instanceof Buffer) {
        xConnectionSocket.write(ev)
      }
    })
    this.xwmDataChannel.onClosed(() => xConnectionSocket.close())
    this.xwmDataChannel.onError((ev) => console.error('XConnection websocket error: ' + ev))
    xConnectionSocket.onData = (data) =>
      xwmDataChannel.sendMessageBinary(Buffer.from(data.buffer, data.byteOffset, data.byteLength))
  }

  destroy(): void {
    if (this.xwmDataChannel) {
      this.xwmDataChannel.close()
      this.xwmDataChannel = undefined
    }

    if (this.nativeXWayland) {
      teardownXWayland(this.nativeXWayland)
      this.nativeXWayland = undefined
    }

    if (this.xWaylandClient) {
      this.xWaylandClient.nativeClientSession?.destroy()
      this.xWaylandClient.protocolChannel.close()
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
