import { WebClientConnectionListener, WebCompositorConnector } from '../index'
import { Client } from 'westfield-runtime-server'
import { WebConnectionHandler } from './WebConnectionHandler'
import Session from '../Session'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567' as const

function base32Encode(data: Uint8Array) {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength)

  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < view.byteLength; i++) {
    value = (value << 8) | view.getUint8(i)
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  return output
}

export function randomString(): string {
  const randomBytes = new Uint8Array(16)
  window.crypto.getRandomValues(randomBytes)
  return `wa${base32Encode(randomBytes).toLowerCase()}`
}

type GreenfieldMessage =
  | {
      type: 'ConnectReq'
      connectionId: string
    }
  | {
      type: 'ConnectAck'
      connectionId: string
    }
  | {
      type: 'Disconnect'
      connectionId: string
    }
  | {
      type: 'Terminate'
    }

function isGreenfieldMessage(message: any): message is GreenfieldMessage {
  return message.type === 'ConnectReq' || message.type === 'Terminate'
}

type WebAppEntry = {
  webAppLauncher: WebAppLauncher
  iframe: HTMLIFrameElement
  clients: Client[]
  webClientConnectionListener: WebClientConnectionListener
}
let webApps: WebAppEntry[] = []
window.addEventListener('message', (ev) => {
  // check if ev.source is a known webAppFrame, else ignore it
  const source = ev.source as Window
  if (source === null) {
    return
  }

  const webAppEntry = webApps.find((value) => value.iframe.contentWindow === source)
  if (webAppEntry === undefined) {
    return
  }

  const message = ev.data
  if (isGreenfieldMessage(message)) {
    if (message.type === 'ConnectReq') {
      const messageChannel = new MessageChannel()
      const clientId = randomString()
      const client = webAppEntry.webAppLauncher.webAppSocket.onWebApp(
        webAppEntry.iframe,
        clientId,
        messageChannel.port1,
      )
      client.onClose().then(() => {
        messageChannel.port1.close()
        messageChannel.port2.close()
        const disconnect: GreenfieldMessage = {
          type: 'Disconnect',
          connectionId: message.connectionId,
        }
        source.postMessage(disconnect, '*')
      })
      webAppEntry.clients.push(client)
      webAppEntry.webClientConnectionListener.onClient(client)
      const connectAck: GreenfieldMessage = {
        type: 'ConnectAck',
        connectionId: message.connectionId,
      }
      source.postMessage(connectAck, '*', [messageChannel.port2])
    } else if (message.type === 'Terminate') {
      webAppEntry.webClientConnectionListener.close()
    }
  }
})

export class WebAppLauncher implements WebCompositorConnector {
  readonly type = 'web' as const

  static create(session: Session) {
    return new WebAppLauncher(session)
  }

  readonly webAppSocket: WebConnectionHandler

  private constructor(readonly session: Session) {
    this.webAppSocket = WebConnectionHandler.create(session)
  }

  launch(url: URL): WebClientConnectionListener {
    const webAppFrame = document.createElement('iframe')
    webAppFrame.hidden = true
    webAppFrame.sandbox.add('allow-scripts')
    webAppFrame.src = url.href

    const webClientConnectionListener: WebClientConnectionListener = {
      type: 'web',
      onClient(client: Client) {
        /*noop*/
      },
      close() {
        webApps = webApps.filter((value) => value.iframe !== webAppFrame)

        for (const client of webAppEntry.clients) {
          client.close()
        }
        webAppFrame.remove()
        this.onClose?.()
      },
    }

    const webAppEntry: WebAppEntry = {
      webAppLauncher: this,
      iframe: webAppFrame,
      clients: [] as Client[],
      webClientConnectionListener,
    }
    webApps.push(webAppEntry)

    setTimeout(() => {
      webClientConnectionListener.webAppIFrame = webAppFrame
      webClientConnectionListener.onNeedIFrameAttach?.(webAppFrame)
    })

    return webClientConnectionListener
  }
}
