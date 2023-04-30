import { createLogger } from './Logger'
import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import { config } from './config'
import type { ChannelDesc, WebSocketChannel } from './Channel'
import {
  findProxySessionByKey,
  findProxySessionsByCompositorSessionId,
  ProxySession,
  SignalingUserData,
} from './ProxySession'

const logger = createLogger('compositor-proxy-signaling')

const enum SignalingMessageType {
  CONNECTION,
  DISCONNECT,
  PING,
  PONG,
}

type SignalingMessage =
  | {
      readonly type: SignalingMessageType.CONNECTION
      readonly data: { url: string; desc: ChannelDesc }
      readonly sessionKey: string
    }
  | {
      readonly type: SignalingMessageType.DISCONNECT
      readonly data: string
      readonly sessionKey: string
    }
  | {
      readonly type: SignalingMessageType.PING
      readonly data: number
      readonly sessionKey: string
    }
  | {
      readonly type: SignalingMessageType.PONG
      readonly data: number
      readonly sessionKey: string
    }

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

export function signalHandling(): WebSocketBehavior<SignalingUserData> {
  logger.info(`Listening for connections.`)

  return {
    sendPingsAutomatically: true,
    upgrade(res, req, context) {
      /* This immediately calls open handler, you must not use res after this call */
      const searchParams = new URLSearchParams(req.getQuery())

      // FIXME move these errors to the ws open function so we can cleanly close the websocket connection.

      const compositorSessionId = searchParams.get('compositorSessionId')
      if (compositorSessionId === null) {
        const message = '403 Missing compositorSessionId query parameter.'
        res.end(message, true)
        return
      }

      const proxySessionKey = searchParams.get('proxySessionKey')
      if (proxySessionKey === null) {
        const message = '403 Missing proxySessionKey query parameter.'
        res.end(message, true)
        return
      }

      const proxySession = findProxySessionByKey(proxySessionKey)
      if (proxySession === undefined) {
        const message = '403 Bad proxySessionKey query parameter.'
        res.end(message, true)
        return
      }

      if (proxySession.compositorSessionId !== compositorSessionId) {
        const message = '403 Bad compositorSessionId query parameter.'
        res.end(message, true)
        return
      }

      if (proxySession.signalingWebSocket !== undefined) {
        const message = '403 Proxy session already connected.'
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

      proxySession.signalingWebSocket = ws
      proxySession.flushCachedSignalingSends()
    },
    message(ws: WebSocket<SignalingUserData>, message: ArrayBuffer) {
      const messageData = textDecoder.decode(message)
      const messageObject = JSON.parse(messageData)
      const { proxySession } = ws.getUserData()

      if (isSignalingMessage(messageObject)) {
        switch (messageObject.type) {
          case SignalingMessageType.PING: {
            const pongMessage: SignalingMessage = {
              type: SignalingMessageType.PONG,
              data: messageObject.data,
              sessionKey: proxySession.sessionKey,
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
  return messageObject.type === SignalingMessageType.PING
}

type ConnectionUserData = {
  channel: WebSocketChannel
}

export function channelHandling(): WebSocketBehavior<ConnectionUserData> {
  return {
    sendPingsAutomatically: true,
    maxPayloadLength: 256 * 1450,
    upgrade(res, req, context) {
      const searchParams = new URLSearchParams(req.getQuery())

      const proxySessionKey = searchParams.get('proxySessionKey')
      if (proxySessionKey && findProxySessionByKey(proxySessionKey) === undefined) {
        const message = 'Bad or missing proxySessionKey query parameter.'
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
  const url: URL = new URL(config.public.baseURL.replace('http', 'ws'))
  url.searchParams.append('id', `${channel.desc.id}`)
  url.searchParams.append('proxySessionKey', channel.proxySession.sessionKey)
  url.pathname = url.pathname.endsWith('/') ? `${url.pathname}channel` : `${url.pathname}/channel`
  const connectionRequest: SignalingMessage = {
    type: SignalingMessageType.CONNECTION,
    sessionKey: channel.proxySession.sessionKey,
    data: { url: url.href, desc: channel.desc },
  }
  channels[channel.desc.id] = channel
  channel.proxySession.signalingSend(textEncoder.encode(JSON.stringify(connectionRequest)))
}

export function sendChannelDisconnect(channelId: string, proxySession: ProxySession) {
  const clientDisconnect: SignalingMessage = {
    type: SignalingMessageType.DISCONNECT,
    sessionKey: proxySession.sessionKey,
    data: channelId,
  }
  proxySession.signalingSend(textEncoder.encode(JSON.stringify(clientDisconnect)))
}

export function sendClientConnectionsDisconnect(clientId: string, proxySession: ProxySession) {
  for (const [channelId, channel] of Object.entries(channels)) {
    if (channel.desc.clientId === clientId) {
      sendChannelDisconnect(channelId, proxySession)
    }
  }
}
