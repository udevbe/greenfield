import { WebClientConnectionListener, WebCompositorConnector } from '../index'
import { Client } from '@gfld/compositor-protocol'
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
      type: 'Connect'
      messagePort: MessagePort
    }
  | {
      type: 'Disconnect'
      messagePort: MessagePort
    }
  | {
      type: 'Terminate'
    }

function isGreenfieldMessage(message: any): message is GreenfieldMessage {
  return message.type === 'Connect' || message.type === 'Terminate'
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
    if (message.type === 'Connect') {
      const clientId = randomString()
      const messagePort = message.messagePort
      const client = webAppEntry.webAppLauncher.webAppSocket.onWebApp(webAppEntry.iframe, clientId, messagePort)
      client.onClose().then(() => {
        message.messagePort
        const disconnect: GreenfieldMessage = {
          type: 'Disconnect',
          messagePort,
        }
        source.postMessage(disconnect, '*', [messagePort])
      })
      webAppEntry.clients.push(client)
      webAppEntry.webClientConnectionListener.onClient(client)
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

    fetch(url).then((response) => {
      response.text().then((html) => {
        webAppFrame.srcdoc = html.replace(/(<head[^>]*>\s*)/i, `$1<base href="${url.pathname}/" />\r`)
      })
    })

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
