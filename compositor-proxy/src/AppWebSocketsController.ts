import { createLogger } from './Logger'
import type { WebSocket, WebSocketBehavior } from 'uWebSockets.js'
import { URLSearchParams } from 'url'
import type { WebSocketChannel } from './Channel'
import { findProxySessionByCompositorSessionId } from './ProxySession'
import { isSignalingMessage, NativeAppContext, SignalingMessageType } from './NativeAppContext'

const logger = createLogger('compositor-proxy-signaling')

const textDecoder = new TextDecoder()

export type AppSignalingUserData = {
  nativeAppContext?: NativeAppContext
  message?: string
}

export function signalHandling(): WebSocketBehavior<AppSignalingUserData> {
  logger.info(`Listening for connections.`)

  return {
    sendPingsAutomatically: true,
    upgrade(res, req, context) {
      /* This immediately calls open handler, you must not use res after this call */
      const searchParams = new URLSearchParams(req.getQuery())

      const compositorSessionId = searchParams.get('compositorSessionId')
      if (compositorSessionId === null) {
        const message = '403 Missing compositorSessionId query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const signalingKey = searchParams.get('key')
      if (signalingKey === null) {
        const message = '403 Missing key query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const proxySession = findProxySessionByCompositorSessionId(compositorSessionId)
      if (proxySession === undefined) {
        const message = '403 Bad proxySessionKey query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const nativeAppContext = proxySession.findNativeAppContextByKey(signalingKey)
      if (nativeAppContext === undefined) {
        const message = '403 Bad key query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      if (nativeAppContext.signalingWebSocket !== undefined) {
        const message = '403 client signaling connection already established.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const userData: AppSignalingUserData = {
        nativeAppContext: nativeAppContext,
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
    open(ws: WebSocket<AppSignalingUserData>) {
      const { nativeAppContext, message } = ws.getUserData()
      if (nativeAppContext === undefined) {
        ws.end(4001, message)
        return
      }

      logger.info(`New signaling connection from ${textDecoder.decode(ws.getRemoteAddressAsText())}.`)
      nativeAppContext.onConnect(ws)
    },
    message(ws: WebSocket<AppSignalingUserData>, message: ArrayBuffer) {
      const messageData = textDecoder.decode(message)
      const messageObject = JSON.parse(messageData)
      const { nativeAppContext } = ws.getUserData()
      if (nativeAppContext === undefined) {
        throw new Error('BUG. Got a websocket message without a native app context.')
      }

      if (isSignalingMessage(messageObject)) {
        switch (messageObject.type) {
          case SignalingMessageType.KILL_APP: {
            nativeAppContext.kill(messageObject.data.signal)
            break
          }
        }
      } else {
        throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
      }
    },
    close(ws: WebSocket<AppSignalingUserData>, code: number, message: ArrayBuffer) {
      logger.info(`Signaling connection closed. Code: ${code}. Message: ${textDecoder.decode(message)}`)
      const { nativeAppContext } = ws.getUserData()
      nativeAppContext?.onDisconnect()
    },
  }
}

type ConnectionUserData = {
  channel?: WebSocketChannel
  message?: string
}

export function channelHandling(): WebSocketBehavior<ConnectionUserData> {
  return {
    sendPingsAutomatically: true,
    maxPayloadLength: 256 * 1450,
    upgrade(res, req, context) {
      const searchParams = new URLSearchParams(req.getQuery())

      const compositorSessionId = searchParams.get('compositorSessionId')
      if (compositorSessionId === null) {
        const message = '403 Missing compositorSessionId query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const proxySession = findProxySessionByCompositorSessionId(compositorSessionId)
      if (proxySession === undefined) {
        const message = '403 Bad compositorSessionId query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const key = searchParams.get('key')
      if (key === null) {
        const message = '403 Missing key query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const nativeAppContext = proxySession.findNativeAppContextByKey(key)
      if (nativeAppContext === undefined) {
        const message = '403 Bad key query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const channelId = searchParams.get('id')
      if (channelId === null) {
        const message = '403 Missing channel id query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

      const channel = nativeAppContext.findChannelById(channelId)
      if (channel === undefined) {
        const message = 'Bad channel id query parameter.'
        res.upgrade(
          { message },
          /* Spell these correctly */
          req.getHeader('sec-websocket-key'),
          req.getHeader('sec-websocket-protocol'),
          req.getHeader('sec-websocket-extensions'),
          context,
        )
        return
      }

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
      const { channel, message } = ws.getUserData()
      if (channel === undefined) {
        ws.end(4001, message)
        return
      }
      channel.doOpen(ws)
      logger.info(`channel (re)connection from ${textDecoder.decode(ws.getRemoteAddressAsText())})}`)
    },
    message(ws, message: ArrayBuffer) {
      const channel = ws.getUserData().channel
      if (channel === undefined) {
        throw new Error('BUG. Got a websocket message without a channel.')
      }
      channel.doMessage(Buffer.from(message))
    },
    close(ws, code: number, message: ArrayBuffer) {
      const channel = ws.getUserData().channel
      if (code === 4001) {
        // user closed connection
        channel?.doClose()
      }
      if (channel) {
        channel.ws = undefined
      }
      logger.info(`Data connection closed. Code: ${code}. Message: ${textDecoder.decode(message)}`)
    },
  }
}
