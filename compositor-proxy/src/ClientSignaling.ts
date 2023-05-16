import { NativeClientSession } from './NativeClientSession'
import { WebSocket } from 'uWebSockets.js'
import { randomBytes } from 'crypto'
import type { SignalingUserData } from './AppWebSocketsController'
import { ChannelDesc, WebSocketChannel } from './Channel'
import { config } from './config'
import { createLogger } from './Logger'
import { execFile } from 'child_process'
import { ProxySession } from './ProxySession'

export const enum SignalingMessageType {
  CONNECTION,
  DISCONNECT,
  PING,
  PONG,
  NEW_CLIENT,
}

type SignalingMessage =
  | {
      readonly type: SignalingMessageType.CONNECTION
      readonly data: { url: string; desc: ChannelDesc }
    }
  | {
      readonly type: SignalingMessageType.DISCONNECT
      readonly data: string
    }
  | {
      readonly type: SignalingMessageType.PING
      readonly data: number
    }
  | {
      readonly type: SignalingMessageType.PONG
      readonly data: number
    }
  | {
      readonly type: SignalingMessageType.NEW_CLIENT
      readonly data: { baseURL: string; signalURL: string; key: string }
    }

const textEncoder = new TextEncoder()

export class ClientSignaling {
  public readonly key = randomBytes(8).toString('hex')

  public nativeClientSession: NativeClientSession | undefined
  public signalingWebSocket: WebSocket<SignalingUserData> | undefined
  public destroyListeners: (() => void)[] = []

  private signalingSendBuffer: Uint8Array[] = []
  private channels: Record<string, WebSocketChannel> = {}

  constructor(public readonly proxySession: ProxySession) {}

  signalingSend(message: Uint8Array) {
    if (this.signalingWebSocket) {
      this.signalingWebSocket.send(message, true)
    } else {
      this.signalingSendBuffer.push(message)
    }
  }

  flushCachedSignalingSends() {
    if (this.signalingWebSocket === undefined) {
      return
    }
    if (this.signalingSendBuffer.length === 0) {
      return
    }
    for (const message of this.signalingSendBuffer) {
      this.signalingWebSocket.send(message, true)
    }
    this.signalingSendBuffer = []
  }

  close() {
    if (this.nativeClientSession) {
      this.nativeClientSession.destroy()
    }

    for (const destroyListener of this.destroyListeners) {
      destroyListener()
    }
    // TODO more?
  }

  sendConnectionRequest(channel: WebSocketChannel) {
    const url: URL = new URL(config.public.baseURL.replace('http', 'ws'))
    url.searchParams.append('id', `${channel.desc.id}`)
    url.searchParams.append('key', `${channel.clientSignaling.key}`)
    url.searchParams.append('compositorSessionId', `${channel.clientSignaling.proxySession.compositorSessionId}`)
    url.pathname = url.pathname.endsWith('/') ? `${url.pathname}channel` : `${url.pathname}/channel`
    const connectionRequest: SignalingMessage = {
      type: SignalingMessageType.CONNECTION,
      data: { url: url.href, desc: channel.desc },
    }
    this.channels[channel.desc.id] = channel
    channel.onClose = () => {
      delete this.channels[channel.desc.id]
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(connectionRequest)))
  }

  sendChannelDisconnect(channel: WebSocketChannel) {
    const clientDisconnect: SignalingMessage = {
      type: SignalingMessageType.DISCONNECT,
      data: channel.desc.id,
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(clientDisconnect)))
  }

  sendClientConnectionsDisconnect() {
    for (const channel of Object.values(this.channels)) {
      this.sendChannelDisconnect(channel)
    }
  }

  sendPong(data: number) {
    const pongMessage: SignalingMessage = {
      type: SignalingMessageType.PONG,
      data,
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(pongMessage)))
  }

  findChannelById(channelId: string): WebSocketChannel | undefined {
    return this.channels[channelId]
  }

  sendNewClientNotify(key: string) {
    const proxyURL = new URL(config.public.baseURL.replace('http', 'ws'))
    proxyURL.pathname += proxyURL.pathname.endsWith('/') ? 'signal' : '/signal'
    proxyURL.searchParams.set('compositorSessionId', this.proxySession.compositorSessionId)
    proxyURL.searchParams.set('key', key)

    const data: { baseURL: string; signalURL: string; key: string } = {
      baseURL: config.public.baseURL,
      signalURL: proxyURL.href,
      key: key,
    }

    const newClientNotify: SignalingMessage = {
      type: SignalingMessageType.NEW_CLIENT,
      data,
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(newClientNotify)))
  }
}

export function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === SignalingMessageType.PING
}

export function launchApplication(applicationExecutable: string, proxySession: ProxySession): Promise<ClientSignaling> {
  // TODO create child logger from proxy session logger
  return new Promise<ClientSignaling>((resolve, reject) => {
    const appLogger = createLogger(applicationExecutable)
    const childProcess = execFile(
      applicationExecutable,
      // TODO support executable arguments
      [],
      {
        env: {
          ...process.env,
          WAYLAND_DISPLAY: proxySession.nativeCompositorSession.waylandDisplay,
        },
      },
      (error, stdout, stderr) => {
        if (error) {
          appLogger.error(`child process error: ${error.message}. signal: ${error.signal}`)
          reject(error)
          return
        }
        appLogger.info(stdout)
      },
    )
    childProcess.once('spawn', () => {
      appLogger.info(`child process started: ${applicationExecutable}`)
      const clientSignaling = proxySession.createClientSignaling()
      clientSignaling.destroyListeners.push(() => {
        childProcess.kill()
      })
      childProcess.once('exit', () => {
        clientSignaling.close()
      })
      resolve(clientSignaling)
    })
  })
}
