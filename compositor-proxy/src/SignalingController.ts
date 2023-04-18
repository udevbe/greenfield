import { createLogger } from './Logger'
import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import { randomBytes } from 'crypto'
import { config } from './config'
import type { ChannelDesc, WebSocketChannel } from './Channel'
import { createProxySession, findProxySessionById, SignalingUserData } from './ProxySession'

const logger = createLogger('compositor-proxy-signaling')

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

const identity = randomBytes(8).toString('hex')
const peerIdentity: SignalingMessage = {
  type: SignalingMessageType.IDENTITY,
  identity,
}
const peerIdentityMessage = textEncoder.encode(JSON.stringify(peerIdentity))

export function signalHandling(): WebSocketBehavior<SignalingUserData> {
  logger.info(`Listening for signaling connections using identity: ${peerIdentity.identity}`)

  return {
    sendPingsAutomatically: true,
    upgrade(res, req, context) {
      /* This immediately calls open handler, you must not use res after this call */
      const searchParams = new URLSearchParams(req.getQuery())
      const compositorSessionId = searchParams.get('compositorSessionId')
      if (compositorSessionId === null) {
        const message = '403 Missing compositorSessionId query parameter.'
        res.end(message, true)
        return
      }

      let proxySession = findProxySessionById(compositorSessionId)
      if (proxySession === undefined) {
        // TODO we probably want to check if the remote end is allowed to create a new proxy session
        proxySession = createProxySession(compositorSessionId)
      }

      if (proxySession.signalingWebSocket !== undefined) {
        const message = `403 Already have a signaling connection.`
        res.end(message, true)
        return
      }

      const userData: SignalingUserData = {
        proxySession,
      }

      res.upgrade(
        userData,
        /* Spell these correctly */
        req.getHeader('sec-websocket-key'),
        req.getHeader('sec-websocket-protocol'),
        req.getHeader('sec-websocket-extensions'),
        context,
      )
    },
    open(ws: WebSocket<SignalingUserData>) {
      const { proxySession } = ws.getUserData()

      logger.info(`New signaling connection from ${textDecoder.decode(ws.getRemoteAddressAsText())}.`)

      ws.send(peerIdentityMessage, true)
      proxySession.signalingWebSocket = ws
      proxySession.flushCachedSignalingSends()
    },
    message(ws: WebSocket<SignalingUserData>, message: ArrayBuffer) {
      const messageData = textDecoder.decode(message)
      const messageObject = JSON.parse(messageData)
      const { proxySession } = ws.getUserData()

      if (isSignalingMessage(messageObject)) {
        switch (messageObject.type) {
          case SignalingMessageType.IDENTITY: {
            logger.info(`Received compositor identity: ${messageObject.identity}.`)

            if (proxySession.compositorPeerIdentity && messageObject.identity !== proxySession.compositorPeerIdentity) {
              logger.info(
                `Compositor signaling identity has changed. Old: ${proxySession.compositorPeerIdentity}. New: ${messageObject.identity}. Creating new peer connection.`,
              )
              // Remote compositor has restarted. Shutdown the old peer connection before handling any signaling.
              proxySession.compositorPeerIdentity = messageObject.identity
              proxySession.resetPeerConnectionState(false)
            } else if (proxySession.compositorPeerIdentity === undefined) {
              // Connecting to remote proxy for the first time
              proxySession.compositorPeerIdentity = messageObject.identity
            } // else re-connecting, ignore.
            break
          }
          case SignalingMessageType.PING: {
            const pongMessage: SignalingMessage = {
              type: SignalingMessageType.PONG,
              data: messageObject.data,
              identity,
            }
            proxySession.signalingSend(textEncoder.encode(JSON.stringify(pongMessage)))
          }
        }
      } else {
        throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
      }
    },
    close(ws: WebSocket<SignalingUserData>, code: number, message: ArrayBuffer) {
      logger.info(`Signaling connection closed. Code: ${code}. Message: ${textDecoder.decode(message)}`)
      const { proxySession } = ws.getUserData()
      proxySession.signalingWebSocket = undefined
      if (code === 4001) {
        // user closed connection
        proxySession.close()
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

export function connectionHandling(): WebSocketBehavior<ConnectionUserData> {
  return {
    sendPingsAutomatically: true,
    maxPayloadLength: 256 * 1450,
    upgrade(res, req, context) {
      const searchParams = new URLSearchParams(req.getQuery())

      const compositorSessionId = searchParams.get('compositorSessionId')
      if (compositorSessionId && findProxySessionById(compositorSessionId) === undefined) {
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
  findProxySessionById(channel.compositorSessionId)?.signalingSend(
    textEncoder.encode(JSON.stringify(connectionRequest)),
  )
}

export function sendChannelDisconnect(channelId: string, compositorSessionId: string) {
  const clientDisconnect: SignalingMessage = {
    type: SignalingMessageType.DISCONNECT,
    identity,
    data: channelId,
  }
  findProxySessionById(compositorSessionId)?.signalingSend(textEncoder.encode(JSON.stringify(clientDisconnect)))
}

export function sendClientConnectionsDisconnect(clientId: string, compositorSessionId: string) {
  for (const [channelId, channel] of Object.entries(channels)) {
    if (channel.desc.clientId === clientId) {
      sendChannelDisconnect(channelId, compositorSessionId)
    }
  }
}
