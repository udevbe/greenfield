import { NativeWaylandClientSession } from './NativeWaylandClientSession'
import { randomBytes } from 'crypto'
import { ChannelDesc, WebSocketChannel } from './Channel'
import { createLogger } from './Logger'
import { spawn } from 'child_process'
import { Session } from './Session'
import { setTimeout } from 'timers'
import { WebSocket } from 'ws'

export const enum SignalingMessageType {
  CONNECT_CHANNEL,
  DISCONNECT_CHANNEL,
  CREATE_CHILD_APP_CONTEXT,
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
      readonly type: SignalingMessageType.CREATE_CHILD_APP_CONTEXT
      readonly data: { baseURL: string; signalURL: string; name: string }
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

export class NativeAppContext {
  public readonly key = randomBytes(8).toString('hex')

  private nativeClientSessions: NativeWaylandClientSession[] = []
  public signalingWebSocket: WebSocket | undefined
  public readonly destroyListeners: (() => void)[] = []

  private readonly signalingSendBuffer: Uint8Array[] = []
  private readonly channels: Record<string, WebSocketChannel> = {}
  private sigKillTimer?: NodeJS.Timeout
  private sigHupTimer?: NodeJS.Timeout

  constructor(
    readonly session: Session,
    readonly pid: number,
    readonly name: string,
    private readonly external: boolean,
  ) {}

  addNativeWaylandClientSession(nativeClientSession: NativeWaylandClientSession) {
    this.nativeClientSessions.push(nativeClientSession)
  }

  removeNativeWaylandClientSession(nativeClientSession: NativeWaylandClientSession) {
    this.nativeClientSessions = this.nativeClientSessions.filter(
      (otherNativeClientSession) => otherNativeClientSession !== nativeClientSession,
    )
    if (this.external && this.nativeClientSessions.length === 0) {
      this.onExit({ exitCode: 0 })
    }
  }

  signalingSend(message: Uint8Array) {
    if (this.signalingWebSocket) {
      this.signalingWebSocket.send(message, { binary: true })
    } else {
      this.signalingSendBuffer.push(message)
    }
  }

  private flushCachedSignalingSends() {
    if (this.signalingWebSocket === undefined || this.signalingSendBuffer.length === 0) {
      return
    }
    for (const message of this.signalingSendBuffer) {
      this.signalingWebSocket.send(message, { binary: true })
    }
    this.signalingSendBuffer.splice(0, this.signalingSendBuffer.length)
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
    this.destroyListeners.splice(0, this.destroyListeners.length)
    this.sendExit(args)
  }

  kill(signal: 'SIGTERM' | 'SIGHUP') {
    try {
      process.kill(this.pid, signal)
      if (this.sigKillTimer === undefined) {
        this.sigKillTimer = setTimeout(() => {
          this.sigKillTimer = undefined
          try {
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
    } catch (e: any) {
      if (e.code === 'ESRCH') {
        // PID already destroyed, we can safely ignore this error.
      } else {
        throw e
      }
    }
  }

  onConnect(signalingWebSocket: WebSocket) {
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
    const url: URL = new URL(this.session.config.public.baseURL)
    url.searchParams.append('id', `${channel.desc.id}`)
    url.searchParams.append('key', `${channel.nativeAppContext.key}`)
    url.searchParams.append('compositorSessionId', `${channel.nativeAppContext.session.compositorSessionId}`)
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

  sendCreateChildAppContext(nativeAppContext: NativeAppContext) {
    const proxyURL = new URL(this.session.config.public.baseURL)
    proxyURL.pathname += proxyURL.pathname.endsWith('/') ? 'signal' : '/signal'
    proxyURL.searchParams.set('compositorSessionId', this.session.compositorSessionId)
    proxyURL.searchParams.set('key', nativeAppContext.key)

    const data: { baseURL: string; signalURL: string; name: string } = {
      baseURL: this.session.config.public.baseURL,
      signalURL: proxyURL.href,
      name: nativeAppContext.name,
    }

    const newClientNotify: SignalingMessage = {
      type: SignalingMessageType.CREATE_CHILD_APP_CONTEXT,
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

export function launchApplication(
  name: string,
  applicationExecutable: string,
  args: string[],
  env: Record<string, string>,
  session: Session,
): Promise<NativeAppContext> {
  // TODO create child logger from proxy session logger
  return new Promise<NativeAppContext>((resolve, reject) => {
    const appLogger = createLogger(applicationExecutable)

    const childProcess = spawn(applicationExecutable, args, {
      env: {
        ...process.env,
        ...env,
        WAYLAND_DISPLAY: session.nativeWaylandCompositorSession.waylandDisplay,
      },
    })

    childProcess.stdout.on('data', (data) => {
      appLogger.info(data.toString())
    })

    childProcess.stderr.on('data', (data) => {
      appLogger.error(data.toString())
    })

    const spawnErrorHandler = (error: Error) => {
      appLogger.error(`child process error: ${error.message}.`)
      reject(error)
    }
    childProcess.once('error', spawnErrorHandler)

    childProcess.once('spawn', () => {
      appLogger.info(`Child process started.`)
      childProcess.removeListener('error', spawnErrorHandler)
      childProcess.addListener('error', (error) => {
        appLogger.error(`child process error: ${error.message}.`)
      })

      if (childProcess.pid === undefined) {
        throw new Error('BUG? Tried to create client signaling for child process without an id.')
      }

      const nativeAppContext = session.createNativeAppContext(childProcess.pid, name, false)
      childProcess.once('exit', (exitCode, signal) => {
        if (exitCode !== null) {
          appLogger.info(`Child process terminated with exit code: ${exitCode}.`)
          nativeAppContext.onExit({ exitCode })
        }
        if (signal !== null) {
          appLogger.info(`Child process terminated with signal: ${signal}.`)
          nativeAppContext.onExit({ signal })
        }
      })
      resolve(nativeAppContext)
    })
  })
}
