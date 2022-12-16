import { CompositorConnector } from '../index'
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

function getCrossOriginWorkerURL(originalWorkerUrl: string): Promise<string> | string {
  const options = {
    useBlob: false,
  }

  if (!originalWorkerUrl.includes('://') || originalWorkerUrl.includes(window.location.origin)) {
    // The same origin - Worker will run fine
    return originalWorkerUrl
  }

  return new Promise<string>((resolve, reject) =>
    fetch(originalWorkerUrl)
      .then((res) => res.text())
      .then((codeString) => {
        const workerPath = new URL(originalWorkerUrl).href.split('/')
        workerPath.pop()

        const importScriptsFix = `const _importScripts = importScripts;
const _fixImports = (url) => new URL(url, '${workerPath.join('/') + '/'}').href;
importScripts = (...urls) => _importScripts(...urls.map(_fixImports));`

        const finalURL = `data:application/javascript,${encodeURIComponent(importScriptsFix + codeString)}`

        resolve(finalURL)
      })
      .catch(reject),
  )
}

export class WebWorkerAppLauncher implements CompositorConnector {
  static create(session: Session) {
    return new WebWorkerAppLauncher(session)
  }

  readonly webAppSocket: WebWorkerConnectionHandler

  private constructor(readonly session: Session) {
    this.webAppSocket = WebWorkerConnectionHandler.create(session)
  }

  async connectTo(url: URL, auth?: string): Promise<Client> {
    const clientId = randomString()
    const workerUrl = await getCrossOriginWorkerURL(url.href)
    const worker = new Worker(new URL(workerUrl), { name: clientId })
    const client = this.webAppSocket.onWebAppWorker(worker, clientId)
    client.onClose().then(() => {
      worker.terminate()
    })
    return client
  }
}
