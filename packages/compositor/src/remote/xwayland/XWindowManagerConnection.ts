import { connect, webConnectionSetup, XConnection } from '@gfld/xtsb'
import Session from '../../Session'
import { Channel } from '../Channel'

export class XWindowManagerConnection {
  static create(session: Session, xwmDataChannel: Channel): Promise<XWindowManagerConnection> {
    return new Promise<XWindowManagerConnection>((resolve, reject) => {
      let wasOpen = false
      xwmDataChannel.onOpen = () => {
        wasOpen = true
        xwmDataChannel.onError = (ev) => session.logger.error(`XWM connection error: ${ev}`)
        const xwm = new XWindowManagerConnection(xwmDataChannel)
        xwmDataChannel.onClose = () => xwm.destroy()
        resolve(xwm)
      }
      xwmDataChannel.onError = (err) => {
        if (wasOpen) {
          return
        }

        reject(new Error(`XWM connection failed: ${err}`))
      }
    })
  }

  // @ts-ignore assigned in constructor in promise cb
  private destroyResolve: (value?: PromiseLike<void> | void) => void
  private readonly destroyPromise: Promise<void>

  // @ts-ignore assigned in constructor in promise cb
  private setupPromise?: Promise<XConnection>

  xConnection?: XConnection

  constructor(public readonly xwmDataChannel: Channel) {
    this.destroyPromise = new Promise<void>((resolve) => (this.destroyResolve = resolve))
  }

  destroy() {
    this.xwmDataChannel.close()
    this.destroyResolve()
  }

  onDestroy() {
    return this.destroyPromise
  }

  setup(): Promise<XConnection> {
    if (this.setupPromise === undefined) {
      this.setupPromise = new Promise<XConnection>(async (resolve) => {
        this.xConnection = await connect(
          webConnectionSetup({
            close: () => {
              this.xwmDataChannel.close()
            },
            onError: (cb: (ev: Event) => void): void => {
              this.xwmDataChannel.onError = (err) => {
                cb(
                  new window.ErrorEvent(err?.message ?? 'no error message', {
                    error: err,
                  }),
                )
              }
            },
            onMessage: (cb: (ev: Uint8Array) => void): void => {
              this.xwmDataChannel.onMessage = (message) => {
                cb(message)
              }
            },
            send: (data: Uint8Array): void => {
              this.xwmDataChannel.send(data)
            },
          }),
        )
        resolve(this.xConnection)
      })
    }
    return this.setupPromise
  }
}
