import { createLogger } from './Logger'
import { nodeFDConnectionSetup } from '@gfld/xtsb'
import { ClientEntry, NativeWaylandCompositorSession } from './NativeWaylandCompositorSession'
import { equalValueExternal, setupXWayland, teardownXWayland, WlClient, XWaylandHandle } from './wayland-server'
import { createReadStream } from 'fs'
import { Channel, createXWMDataChannel } from './Channel'

const logger = createLogger('xwayland')
const textEncoder = new TextEncoder()

export function createXWaylandSession(nativeCompositorSession: NativeWaylandCompositorSession): XWaylandSession {
  return new XWaylandSession(nativeCompositorSession)
}

export class XWaylandSession {
  private nativeXWayland?: XWaylandHandle
  private xWaylandClientEntry?: ClientEntry

  constructor(
    private nativeCompositorSession: NativeWaylandCompositorSession,
    private xwmDataChannel?: Channel,
  ) {}

  /**
   * Don't await as this function will block until an XClient is connecting!
   */
  async createXWaylandListenerSocket(): Promise<void> {
    // Will only continue once an XWayland server is launching which is triggered by an X client trying to connect.
    const { onXWaylandStarting, onDestroyed } = this.listenXWayland()

    onDestroyed.then(() => {
      this.xWaylandClientEntry = undefined
      this.destroy()
    })

    const { wmFd, wlClient, displayFd } = await onXWaylandStarting

    createReadStream('ignored', {
      fd: displayFd,
      autoClose: true,
    }).on('data', (_chunk) => {
      logger.info('XWayland started.')

      const xWaylandClientEntry = this.nativeCompositorSession.clients.find((value) => {
        if (value.nativeClientSession === undefined) {
          return false
        }
        return equalValueExternal(value.nativeClientSession.wlClient, wlClient)
      })

      if (xWaylandClientEntry === undefined) {
        logger.error('BUG? Could not find a XWayland wayland client entry after XWayland startup.')
        return
      }

      if (xWaylandClientEntry.nativeClientSession === undefined) {
        logger.error('BUG? Found XWaylandClient entry but it did not have a native wayland client session associated.')
        return
      }

      const xwmDataChannel = createXWMDataChannel(
        xWaylandClientEntry.clientId,
        xWaylandClientEntry.protocolChannel.nativeAppContext,
      )
      this.upsertXWMConnection(xwmDataChannel, wmFd).catch((e: any) => {
        logger.error(`\tname: ${e.name} message: ${e.message} text: ${e.text}`)
        logger.error('error object stack: ')
        logger.error(e.stack)
        xwmDataChannel.close()
      })

      xWaylandClientEntry.nativeClientSession.destroyListeners.push(() => {
        xwmDataChannel.close()
        this.destroy()
      })

      this.xWaylandClientEntry = xWaylandClientEntry
    })
  }

  async upsertXWMConnection(xwmDataChannel: Channel, wmFD: number): Promise<void> {
    logger.info('Handling incoming XWM connection')
    this.xwmDataChannel = xwmDataChannel
    // initialize an X11 client connection, used by the compositor's X11 window manager.
    const { xConnectionSocket, setup } = await nodeFDConnectionSetup(wmFD)()

    const setupJSON = JSON.stringify(setup)
    xwmDataChannel.send(Buffer.from(textEncoder.encode(setupJSON)))
    this.xwmDataChannel.onMessage = (ev) => {
      xConnectionSocket.write(ev)
    }
    xConnectionSocket.onData = (data) => xwmDataChannel.send(Buffer.from(data.buffer, data.byteOffset, data.byteLength))
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

    if (this.xWaylandClientEntry) {
      this.xWaylandClientEntry.nativeClientSession?.destroy()
      this.xWaylandClientEntry.protocolChannel.close()
      this.xWaylandClientEntry = undefined
    }
  }

  private listenXWayland(): {
    onXWaylandStarting: Promise<{ wmFd: number; wlClient: WlClient; displayFd: number }>
    onDestroyed: Promise<void>
  } {
    let destroyResolve: () => void
    const onDestroyed = new Promise<void>((resolve) => (destroyResolve = resolve))

    const onXWaylandStarting = new Promise<{
      wmFd: number
      wlClient: WlClient
      display: unknown
      displayFd: number
    }>((resolve) => {
      let display: unknown
      this.nativeXWayland = setupXWayland(
        this.nativeCompositorSession.wlDisplay,
        (wmFd: number, wlClient: WlClient, displayFd: number) => resolve({ wmFd, wlClient, display, displayFd }),
        () => destroyResolve(),
      )
    })

    return { onXWaylandStarting, onDestroyed }
  }
}
