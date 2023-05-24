import { NativeClientSession } from './NativeClientSession'
import { WebSocket } from 'uWebSockets.js'
import { randomBytes } from 'crypto'
import type { SignalingUserData } from './AppWebSocketsController'
import { ChannelDesc, WebSocketChannel } from './Channel'
import { config } from './config'
import { createLogger } from './Logger'
import { execFile } from 'child_process'
import { ProxySession } from './ProxySession'
import { setTimeout } from 'timers'

export const enum SignalingMessageType {
  CONNECT_CHANNEL,
  DISCONNECT_CHANNEL,
  CREATE_NEW_CLIENT,
  APP_TERMINATED,
  KILL_APP,
}

type SignalingMessage =
  | {
      readonly type: SignalingMessageType.CONNECT_CHANNEL
      readonly data: { url: string; desc: ChannelDesc }
    }
  | {
      readonly type: SignalingMessageType.DISCONNECT_CHANNEL
      readonly data: { channelId: string }
    }
  | {
      readonly type: SignalingMessageType.CREATE_NEW_CLIENT
      readonly data: { baseURL: string; signalURL: string; key: string }
    }
  | {
      readonly type: SignalingMessageType.APP_TERMINATED
      readonly data: { exitCode: number } | { signal: string }
    }
  | {
      readonly type: SignalingMessageType.KILL_APP
      readonly data: { signal: 'SIGTERM' }
    }

const textEncoder = new TextEncoder()

export class ClientSignaling {
  public readonly key = randomBytes(8).toString('hex')

  public nativeClientSession: NativeClientSession | undefined
  public signalingWebSocket: WebSocket<SignalingUserData> | undefined
  public destroyListeners: (() => void)[] = []

  private signalingSendBuffer: Uint8Array[] = []
  private channels: Record<string, WebSocketChannel> = {}
  private sigKillTimer?: NodeJS.Timeout
  private sigHupTimer?: NodeJS.Timeout

  constructor(public readonly proxySession: ProxySession, readonly pid: number) {}

  signalingSend(message: Uint8Array) {
    if (this.signalingWebSocket) {
      this.signalingWebSocket.send(message, true)
    } else {
      this.signalingSendBuffer.push(message)
    }
  }

  private flushCachedSignalingSends() {
    if (this.signalingWebSocket === undefined || this.signalingSendBuffer.length === 0) {
      return
    }
    for (const message of this.signalingSendBuffer) {
      this.signalingWebSocket.send(message, true)
    }
    this.signalingSendBuffer = []
  }

  onExit(args: { exitCode: number } | { signal: string }) {
    if (this.sigKillTimer) {
      clearTimeout(this.sigKillTimer)
      this.sigKillTimer = undefined
    }
    if (this.sigHupTimer) {
      clearTimeout(this.sigHupTimer)
      this.sigHupTimer = undefined
    }
    for (const destroyListener of this.destroyListeners) {
      destroyListener()
    }
    this.destroyListeners = []
    this.sendExit(args)
  }

  kill(signal: 'SIGTERM' | 'SIGHUP') {
    if (this.sigKillTimer === undefined) {
      this.sigKillTimer = setTimeout(() => {
        this.sigKillTimer = undefined
        try {
          process.kill(this.pid, 0)
          process.kill(this.pid, 'SIGKILL')
        } catch (e: any) {
          if (e.code === 'ESRCH') {
            // PID already destroyed, we can safely ignore this error.
          } else {
            throw e
          }
        }
      }, 10000)
    }
    process.kill(this.pid, signal)
  }

  onConnect(signalingWebSocket: WebSocket<SignalingUserData>) {
    this.signalingWebSocket = signalingWebSocket
    if (this.sigHupTimer) {
      clearTimeout(this.sigHupTimer)
      this.sigHupTimer = undefined
    }
    this.flushCachedSignalingSends()
  }

  onDisconnect() {
    this.signalingWebSocket = undefined

    if (this.sigKillTimer === undefined && this.sigHupTimer === undefined) {
      this.sigHupTimer = setTimeout(() => {
        this.sigHupTimer = undefined
        this.kill('SIGHUP')
      }, 600 * 1000)
    }
  }

  sendConnectionRequest(channel: WebSocketChannel) {
    const url: URL = new URL(config.public.baseURL.replace('http', 'ws'))
    url.searchParams.append('id', `${channel.desc.id}`)
    url.searchParams.append('key', `${channel.clientSignaling.key}`)
    url.searchParams.append('compositorSessionId', `${channel.clientSignaling.proxySession.compositorSessionId}`)
    url.pathname = url.pathname.endsWith('/') ? `${url.pathname}channel` : `${url.pathname}/channel`
    const connectionRequest: SignalingMessage = {
      type: SignalingMessageType.CONNECT_CHANNEL,
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
      type: SignalingMessageType.DISCONNECT_CHANNEL,
      data: { channelId: channel.desc.id },
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(clientDisconnect)))
  }

  sendClientConnectionsDisconnect() {
    for (const channel of Object.values(this.channels)) {
      this.sendChannelDisconnect(channel)
    }
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
      type: SignalingMessageType.CREATE_NEW_CLIENT,
      data,
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(newClientNotify)))
  }

  sendExit(args: { exitCode: number } | { signal: string }) {
    const exitMessage: SignalingMessage = {
      type: SignalingMessageType.APP_TERMINATED,
      data: args,
    }
    this.signalingSend(textEncoder.encode(JSON.stringify(exitMessage)))
  }
}

export function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === SignalingMessageType.KILL_APP
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
      if (childProcess.pid === undefined) {
        throw new Error('BUG? Tried to create client signaling for child process without an id.')
      }

      const clientSignaling = proxySession.createClientSignaling(childProcess.pid)
      childProcess.once('exit', (exitCode, signal) => {
        if (exitCode !== null) {
          clientSignaling.onExit({ exitCode })
        }
        if (signal !== null) {
          clientSignaling.onExit({ signal })
        }
      })
      resolve(clientSignaling)
    })
  })
}
