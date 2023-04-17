import { createLogger } from './Logger'
import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import type { CompositorProxySession } from './CompositorProxySession'
import { randomBytes } from 'crypto'
import { config } from './config'
import type { ChannelDesc, WebSocketChannel } from './Channel'

const logger = createLogger('compositor-proxy-signaling')

type UserData = {
  searchParams: URLSearchParams
}

const enum SignalingMessageType {
  IDENTITY,
  CONNECTION,
  DISCONNECT,
  PING,
  PONG,
}

type SignalingMessage =
  | {
      readonly type: SignalingMessageType.IDENTITY
      readonly identity: string
    }
  | {
      readonly type: SignalingMessageType.CONNECTION
      readonly data: { url: string; desc: ChannelDesc }
      readonly identity: string
    }
  | {
      readonly type: SignalingMessageType.DISCONNECT
      readonly data: string
      readonly identity: string
    }
  | {
      readonly type: SignalingMessageType.PING
      readonly data: number
      readonly identity: string
    }
  | {
      readonly type: SignalingMessageType.PONG
      readonly data: number
      readonly identity: string
    }

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

let openWs: WebSocket<UserData> | null = null
const identity = randomBytes(8).toString('hex')
const peerIdentity: SignalingMessage = {
  type: SignalingMessageType.IDENTITY,
  identity,
}
const peerIdentityMessage = textEncoder.encode(JSON.stringify(peerIdentity))
let compositorPeerIdentity: string | undefined

let sendBuffer: Uint8Array[] = []

function cachedSend(message: Uint8Array) {
  openWs?.send(message, true) ?? sendBuffer.push(message)
}

function flushCachedSends(openWs: WebSocket<UserData>) {
  if (sendBuffer.length === 0) {
    return
  }
  for (const message of sendBuffer) {
    openWs.send(message, true)
  }
  sendBuffer = []
}

export function signalHandling(compositorProxySession: CompositorProxySession): WebSocketBehavior<UserData> {
  logger.info(`Listening for signaling connections using identity: ${peerIdentity.identity}`)

  const resetPeerConnection = (killAllClients: boolean) => {
    compositorProxySession.resetPeerConnectionState(killAllClients)
  }

  return {
    sendPingsAutomatically: true,
    upgrade(res, req, context) {
      /* This immediately calls open handler, you must not use res after this call */
      res.upgrade(
        {
          searchParams: new URLSearchParams(req.getQuery()),
        },
        /* Spell these correctly */
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context,
      )
    },
    open(ws: WebSocket<UserData>) {
      if (openWs !== null) {
        ws.close()
        return
      }

      const { searchParams } = ws.getUserData()
      if (searchParams.get('compositorSessionId') !== compositorProxySession.compositorSessionId) {
        const message = 'Bad or missing compositorSessionId query parameter.'
        ws.end(4403, message)
        return
      }

      logger.info(`New signaling connection from ${textDecoder.decode(ws.getRemoteAddressAsText())}.`)

      ws.send(peerIdentityMessage, true)
      openWs = ws
      flushCachedSends(ws)
    },
    message(ws: WebSocket<UserData>, message: ArrayBuffer) {
      const messageData = textDecoder.decode(message)
      const messageObject = JSON.parse(messageData)

      if (isSignalingMessage(messageObject)) {
        switch (messageObject.type) {
          case SignalingMessageType.IDENTITY: {
            logger.info(`Received compositor signaling identity: ${messageObject.identity}.`)
            if (compositorPeerIdentity && messageObject.identity !== compositorPeerIdentity) {
              logger.info(
                `Compositor signaling identity has changed. Old: ${compositorPeerIdentity}. New: ${messageObject.identity}. Creating new peer connection.`,
              )
              // Remote compositor has restarted. Shutdown the old peer connection before handling any signaling.
              compositorPeerIdentity = messageObject.identity
              compositorProxySession.resetPeerConnectionState(false)
            } else if (compositorPeerIdentity === undefined) {
              // Connecting to remote proxy for the first time
              compositorPeerIdentity = messageObject.identity
            } // else re-connecting, ignore.
            break
          }
          case SignalingMessageType.PING: {
            const pongMessage: SignalingMessage = {
              type: SignalingMessageType.PONG,
              data: messageObject.data,
              identity,
            }
            cachedSend(textEncoder.encode(JSON.stringify(pongMessage)))
          }
        }
      } else {
        throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
      }
    },
    close(ws: WebSocket<UserData>, code: number, message: ArrayBuffer) {
      logger.info(`Signaling connection closed. Code: ${code}. Message: ${textDecoder.decode(message)}`)
      openWs = null
      if (code === 4001) {
        // user closed connection
        compositorPeerIdentity = undefined
        compositorProxySession.resetPeerConnectionState(true)
      }
    },
  }
}

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return messageObject.type === SignalingMessageType.IDENTITY || messageObject.type === SignalingMessageType.PING
}

type ConnectionUserData = {
  channel: WebSocketChannel
}

export function connectionHandling(
  compositorProxySession: CompositorProxySession,
): WebSocketBehavior<ConnectionUserData> {
  return {
    sendPingsAutomatically: true,
    maxPayloadLength: 256 * 1450,
    upgrade(res, req, context) {
      const searchParams = new URLSearchParams(req.getQuery())

      if (searchParams.get('compositorSessionId') !== compositorProxySession.compositorSessionId) {
        const message = 'Bad or missing compositorSessionId query parameter.'
        res.end(message, true)
        return
      }

      const channelId = searchParams.get('id')
      if (channelId === null || channels[channelId] === undefined) {
        const message = 'Bad or missing channel id query parameter.'
        res.end(message, true)
        return
      }

      const channel = channels[channelId]
      const userData: ConnectionUserData = { channel }
      /* This immediately calls open handler, you must not use res after this call */
      res.upgrade(
        userData,
        /* Spell these correctly */
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context,
      )
    },
    open(ws) {
      ws.getUserData().channel.doOpen(ws)
      logger.info(`New data connection from ${textDecoder.decode(ws.getRemoteAddressAsText())})}`)
    },
    message(ws, message: ArrayBuffer) {
      ws.getUserData().channel.doMessage(Buffer.from(message))
    },
    close(ws, code: number, message: ArrayBuffer) {
      const channel = ws.getUserData().channel
      if (code === 4001) {
        // user closed connection
        delete channels[channel.desc.id]
        channel.doClose()
      }
      channel.ws = undefined
      logger.info(`Data connection closed. Code: ${code}. Message: ${textDecoder.decode(message)}`)
    },
  }
}

const channels: Record<string, WebSocketChannel> = {}

export function sendConnectionRequest(channel: WebSocketChannel) {
  const url: URL = new URL(config.public.baseURL)
  url.searchParams.append('id', `${channel.desc.id}`)
  const connectionRequest: SignalingMessage = {
    type: SignalingMessageType.CONNECTION,
    identity,
    data: { url: url.href, desc: channel.desc },
  }
  channels[channel.desc.id] = channel
  cachedSend(textEncoder.encode(JSON.stringify(connectionRequest)))
}

export function sendChannelDisconnect(channelId: string) {
  const clientDisconnect: SignalingMessage = {
    type: SignalingMessageType.DISCONNECT,
    identity,
    data: channelId,
  }
  cachedSend(textEncoder.encode(JSON.stringify(clientDisconnect)))
}

export function sendClientConnectionsDisconnect(clientId: string) {
  for (const [channelId, channel] of Object.entries(channels)) {
    if (channel.desc.clientId === clientId) {
      sendChannelDisconnect(channelId)
    }
  }
}
