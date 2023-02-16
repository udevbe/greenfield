import { WebClientConnectionListener, WebCompositorConnector } from '../index'
import { Client } from 'westfield-runtime-server'
import { WebWorkerConnectionHandler } from './WebWorkerConnectionHandler'
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

export class WebWorkerAppLauncher implements WebCompositorConnector {
  readonly type = 'web' as const

  static create(session: Session) {
    return new WebWorkerAppLauncher(session)
  }

  readonly webAppSocket: WebWorkerConnectionHandler

  private constructor(readonly session: Session) {
    this.webAppSocket = WebWorkerConnectionHandler.create(session)
  }

  listen(url: URL, auth?: string): WebClientConnectionListener {
    const clientId = randomString()
    // const workerUrl = await getCrossOriginWorkerURL(url.href)
    const worker = new Worker(url, { name: clientId })

    // FIXME use MessagePorts to communicate with webworker, this way a single worker can have multiple client connections.
    const client = this.webAppSocket.onWebAppWorker(worker, clientId)
    client.onClose().then(() => {
      worker.terminate()
    })

    const clientConnectionListener: WebClientConnectionListener = {
      type: 'web',
      onClient(client: Client) {
        /*noop*/
      },
      close() {
        worker.terminate()
      },
    }

    return clientConnectionListener
  }
}
