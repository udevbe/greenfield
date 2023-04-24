import type { RemoteClientConnectionListener } from '../index'
import { Client } from 'westfield-runtime-server'
import Session from '../Session'
import ReconnectingWebSocket, { Options } from './reconnecting-websocket'
import type { Channel, ChannelDesc, WebSocketChannel } from './Channel'
import { ARQChannel, ChannelType, SimpleChannel } from './Channel'

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

const identity = Array(17)
  .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
  .slice(0, 16)
const compositorIdentityMessage: SignalingMessage = {
  type: SignalingMessageType.IDENTITY,
  identity,
}
const encodedCompositorIdentityMessage = textEncoder.encode(JSON.stringify(compositorIdentityMessage))

const webSocketReconnectOptions = {
  minReconnectionDelay: 2000,
  maxReconnectionDelay: 4000,
  reconnectionDelayGrowFactor: 500,
}

type Connections = {
  signalingConnection: ReconnectingWebSocket
  clientConnectionListener: RemoteClientConnectionListener
  clientConnections: WebSocketChannel[]
  pongSerial: number
}

function closeClientConnections(session: Session, clientConnections: Connections) {
  for (const clientId of new Set(
    clientConnections.clientConnections.map((clientConnection) => {
      clientConnection.close()
      return clientConnection.desc.clientId
    }),
  )) {
    const client = session.display.clients[clientId]
    if (client) {
      client.close()
    }
  }

  clientConnections.clientConnections = []
}

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }

  return (
    messageObject.type === SignalingMessageType.IDENTITY ||
    messageObject.type === SignalingMessageType.CONNECTION ||
    messageObject.type === SignalingMessageType.DISCONNECT ||
    messageObject.type === SignalingMessageType.PONG
  )
}

function createProxyConnection(
  connections: Connections,
  session: Session,
  proxyURL: string,
  clientConnectionListener: RemoteClientConnectionListener,
  onChannel: (channel: Channel, clientConnectionListener: RemoteClientConnectionListener, proxyIdentity: string) => void,
  remotePeerIdentity?: string,
) {
  connections.signalingConnection.onmessage = async (event) => {
    const messageObject = JSON.parse(textDecoder.decode(event.data as ArrayBuffer))
    if (isSignalingMessage(messageObject)) {
      switch (messageObject.type) {
        case SignalingMessageType.IDENTITY: {
          session.logger.info(`Received remote signaling identity: ${messageObject.identity}.`)
          if (remotePeerIdentity && messageObject.identity !== remotePeerIdentity) {
            session.logger.info(
              `Remote signaling identity has changed. Old: ${remotePeerIdentity}. New: ${messageObject.identity}. Creating new peer connection.`,
            )
            // Remote proxy has restarted. Shutdown old connections before handling any signaling.
            remotePeerIdentity = messageObject.identity
            closeClientConnections(session, connections)
          } else if (remotePeerIdentity === undefined) {
            // Connecting to remote proxy for the first time
            remotePeerIdentity = messageObject.identity
          } // else re-connecting, ignore.
          break
        }
        case SignalingMessageType.CONNECTION: {
          // TODO define a connection timeout
          const url = new URL(messageObject.data.url.replace('http', 'ws'))
          url.searchParams.append('compositorSessionId', session.compositorSessionId)
          const webSocket = new ReconnectingWebSocket(url.href, undefined, webSocketReconnectOptions)

          const desc = messageObject.data.desc

          let channel: WebSocketChannel
          if (desc.channelType === ChannelType.ARQ) {
            channel = new ARQChannel(webSocket, desc)
          } else if (desc.channelType === ChannelType.SIMPLE) {
            channel = new SimpleChannel(webSocket, desc)
          } else {
            throw new Error(`BUG. Unknown channel description: ${JSON.stringify(desc)}`)
          }
          connections.clientConnections.push(channel)
          onChannel(channel, clientConnectionListener, messageObject.identity)
          break
        }
        case SignalingMessageType.DISCONNECT: {
          connections.clientConnections = connections.clientConnections.filter((clientConnection) => {
            if (clientConnection.desc.id === messageObject.data) {
              clientConnection.webSocket.close(4001)
              return false
            }
            return true
          })
          break
        }
        case SignalingMessageType.PONG: {
          connections.pongSerial = messageObject.data
          break
        }
      }
    } else {
      throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
    }
  }

  connections.signalingConnection.onopen = (event, queue) => {
    queue.unshift(encodedCompositorIdentityMessage)
  }
}

export function ensureProxyConnection(
  session: Session,
  compositorProxyURL: URL,
  onChannel: (channel: Channel, clientConnectionListener: RemoteClientConnectionListener, proxyIdentityId: string) => void,
): RemoteClientConnectionListener {
  const signalingPath = compositorProxyURL.pathname.endsWith('/') ? 'signaling' : '/signaling'
  const signalingURL = `${compositorProxyURL.protocol}//${compositorProxyURL.host}${compositorProxyURL.pathname}${signalingPath}?${compositorProxyURL.searchParams}`

  session.logger.info(`Trying to connect using compositor proxy signaling URL: ${signalingURL}`)
  const signalingWebSocket = new ReconnectingWebSocket(signalingURL, undefined, webSocketReconnectOptions)
  signalingWebSocket.binaryType = 'arraybuffer'

  const clientConnectionListener: RemoteClientConnectionListener = {
    type: 'remote',
    onClient(client: Client) {
      /*noop*/
    },
    close() {
      closeClientConnections(session, connections)
      signalingWebSocket.close(4001, 'connection closed by user')
    },
    onConnectionStateChange(state: 'open' | 'closed') {
      /*noop*/
    },
    onError(error: Error) {
      /*noop*/
    },
    get state() {
      switch (signalingWebSocket.readyState) {
        case ReconnectingWebSocket.CONNECTING:
          return 'connecting'
        case ReconnectingWebSocket.OPEN:
          return 'open'
        case ReconnectingWebSocket.CLOSING:
          return 'closing'
        case ReconnectingWebSocket.CLOSED:
          return 'closed'
        default:
          return 'closed'
      }
    },
  }

  signalingWebSocket.addEventListener('open', (event) => {
    clientConnectionListener.onConnectionStateChange('open')
  })
  signalingWebSocket.addEventListener('close', (event) => {
    clientConnectionListener.onConnectionStateChange('closed')
  })
  signalingWebSocket.addEventListener('error', (event) => {
    clientConnectionListener.onError(event.error)
  })

  const connections: Connections = {
    signalingConnection: signalingWebSocket,
    clientConnectionListener,
    clientConnections: [] as WebSocketChannel[],
    pongSerial: 1,
  }

  createProxyConnection(connections, session, signalingURL, clientConnectionListener, onChannel)
  return clientConnectionListener
}
