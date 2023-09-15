import { SetupConnection, XConnectionSocket } from './connection'
import { Setup } from './xcb'

const textDecoder = new TextDecoder()

export interface Channel {
  onError(cb: (ev: Event) => void): void

  onMessage(cb: (ev: Uint8Array) => void): void

  close(): void

  send(data: Uint8Array): void
}

function isSetup(setup: any): setup is Setup {
  // TODO we could check all Setup attributes but it would be a long list...
  return (
    setup.rootsLen !== undefined &&
    setup.protocolMinorVersion !== undefined &&
    setup.protocolMajorVersion !== undefined &&
    setup.length !== undefined
  )
}

export const webConnectionSetup: (channel: Channel) => SetupConnection = (channel) => async () => {
  return new Promise<{ setup: Setup; xConnectionSocket: XConnectionSocket }>((resolve, reject) => {
    let xConnectionSocket: XConnectionSocket | undefined
    channel.onMessage((ev) => {
      if (xConnectionSocket) {
        xConnectionSocket.onData?.(ev)
      } else {
        const messageData = textDecoder.decode(ev)
        const message = JSON.parse(messageData)
        if (isSetup(message)) {
          const xConnection = {
            close() {
              channel.close()
            },
            write(data: Uint8Array) {
              channel.send(data)
            },
          }
          xConnectionSocket = xConnection
          channel.onError((ev) => {
            xConnection.close()
            console.error('XConnection is in error: ' + ev)
          })

          resolve({ setup: message, xConnectionSocket })
        } else {
          reject('Expected xcb Setup, got: ' + ev)
        }
      }
    })
  })
}
