import { Client } from '@gfld/compositor-protocol'
import { WebConnectionHandler } from './WebConnectionHandler'
import Session from '../Session'
import { AppContext, AppLauncher } from '../index'

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
  const randomBytes = new Uint8Array(8)
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
  webAppContext: WebAppContext
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
      webAppEntry.webAppContext.onClient(client)
    } else if (message.type === 'Terminate') {
      webAppEntry.webAppContext.close()
    }
  }
})

class WebAppContext implements AppContext {
  public readonly key = randomString()

  private _state: AppContext['state'] = 'connecting'
  private _name: AppContext['name'] = 'Unknown Web Application'

  onStateChange: AppContext['onStateChange'] = () => {}
  onClient: AppContext['onClient'] = () => {}
  onError: AppContext['onError'] = () => {}
  onKeyChanged: AppContext['onKeyChanged'] = () => {}
  onNameChanged: AppContext['onNameChanged'] = () => {}

  constructor(public close: AppContext['close']) {}

  get state() {
    return this._state
  }

  set state(state: AppContext['state']) {
    this._state = state
  }
}

export class WebAppLauncher implements AppLauncher {
  static create(session: Session) {
    return new WebAppLauncher(session)
  }

  readonly webAppSocket: WebConnectionHandler

  private constructor(readonly session: Session) {
    this.webAppSocket = WebConnectionHandler.create(session)
  }

  launch(url: URL): AppContext {
    const webAppIFRame = document.createElement('iframe')
    webAppIFRame.hidden = true

    const webAppContext = new WebAppContext(() => {
      webApps = webApps.filter((value) => value.iframe !== webAppIFRame)

      for (const client of webAppEntry.clients) {
        client.close()
      }
      webAppIFRame.remove()
      webAppContext.state = 'terminated'
    })

    fetch(url).then((response) => {
      response.text().then((html) => {
        if (url.pathname.endsWith('.html') || url.pathname.endsWith('.htm')) {
          const lastSlash = url.pathname.lastIndexOf('/')
          url.pathname = url.pathname.substring(0, lastSlash)
        }
        webAppIFRame.srcdoc = html.replace(/(<head[^>]*>\s*)/i, `$1<base href="${url.pathname}/" />\r`)
        document.body.appendChild(webAppIFRame)
        webAppContext.state = 'open'
        webAppContext.onStateChange('open')
      })
    })

    const webAppEntry: WebAppEntry = {
      webAppLauncher: this,
      iframe: webAppIFRame,
      clients: [] as Client[],
      webAppContext,
    }
    webApps.push(webAppEntry)

    return webAppContext
  }
}
