import type { RemoteClientConnectionListener } from '../index'
import { Client } from 'westfield-runtime-server'
import Session from '../Session'
import ReconnectingWebSocket from './reconnecting-websocket'
import type { Channel, ChannelDesc, WebSocketChannel } from './Channel'
import { ARQChannel, ChannelType, SimpleChannel } from './Channel'

const enum SignalingMessageType {
  IDENTITY,
  CONNECTION,
  DISCONNECT,
}

type SignalingMessage =
  | {
      type: SignalingMessageType.IDENTITY
      identity: string
    }
  | {
      type: SignalingMessageType.CONNECTION
      data: { url: string; desc: ChannelDesc }
      identity: string
    }
  | {
      type: SignalingMessageType.DISCONNECT
      data: string
      identity: string
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

const connectionsByProxyURL: Record<
  string,
  {
    clientConnectionListener: RemoteClientConnectionListener
    clientConnections: WebSocketChannel[]
  }
> = {}

function addClientConnection(
  proxyURL: string,
  clientConnectionListener: RemoteClientConnectionListener,
  channel: WebSocketChannel,
) {
  let proxyConnection = connectionsByProxyURL[proxyURL]
  if (proxyConnection === undefined) {
    proxyConnection = {
      clientConnectionListener,
      clientConnections: [],
    }
    connectionsByProxyURL[proxyURL] = proxyConnection
  }
  proxyConnection.clientConnections.push(channel)
}

function closeClientConnections(session: Session, signalingURL: string) {
  const proxyConnection = connectionsByProxyURL[signalingURL]
  if (proxyConnection) {
    for (const clientId of new Set(
      proxyConnection.clientConnections.map((clientConnection) => {
        clientConnection.close()
        return clientConnection.desc.clientId
      }),
    )) {
      const client = session.display.clients[clientId]
      if (client) {
        client.close()
      }
    }

    proxyConnection.clientConnections = []
  }
}

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }

  return (
    messageObject.type === SignalingMessageType.IDENTITY ||
    messageObject.type === SignalingMessageType.CONNECTION ||
    messageObject.type === SignalingMessageType.DISCONNECT
  )
}

function createProxyConnection(
  session: Session,
  signalingWebSocket: ReconnectingWebSocket,
  signalingURL: string,
  clientConnectionListener: RemoteClientConnectionListener,
  onChannel: (channel: Channel, clientConnectionListener: RemoteClientConnectionListener) => void,
  remotePeerIdentity?: string,
) {
  signalingWebSocket.onmessage = async (event) => {
    const messageObject = JSON.parse(textDecoder.decode(event.data as ArrayBuffer))
    if (isSignalingMessage(messageObject)) {
      if (messageObject.type === SignalingMessageType.IDENTITY) {
        session.logger.info(`Received remote signaling identity: ${messageObject.identity}.`)
        if (remotePeerIdentity && messageObject.identity !== remotePeerIdentity) {
          session.logger.info(
            `Remote signaling identity has changed. Old: ${remotePeerIdentity}. New: ${messageObject.identity}. Creating new peer connection.`,
          )
          // Remote proxy has restarted. Shutdown old connections before handling any signaling.
          remotePeerIdentity = messageObject.identity
          closeClientConnections(session, signalingURL)
        } else if (remotePeerIdentity === undefined) {
          // Connecting to remote proxy for the first time
          remotePeerIdentity = messageObject.identity
        } // else re-connecting, ignore.
      } else if (messageObject.type === SignalingMessageType.CONNECTION) {
        // TODO define a connection timeout
        const url = new URL(messageObject.data.url.replace('http', 'ws'))
        url.searchParams.append('compositorSessionId', session.compositorSessionId)
        const webSocket = new ReconnectingWebSocket(url.href)

        const desc = messageObject.data.desc

        let channel: WebSocketChannel
        if (desc.channelType === ChannelType.ARQ) {
          channel = new ARQChannel(webSocket, desc)
        } else if (desc.channelType === ChannelType.SIMPLE) {
          channel = new SimpleChannel(webSocket, desc)
        } else {
          throw new Error(`BUG. Unknown channel description: ${JSON.stringify(desc)}`)
        }
        addClientConnection(signalingURL, clientConnectionListener, channel)
        onChannel(channel, clientConnectionListener)
      } else if (messageObject.type === SignalingMessageType.DISCONNECT) {
        const proxyConnection = connectionsByProxyURL[signalingURL]
        if (proxyConnection) {
          proxyConnection.clientConnections = proxyConnection.clientConnections.filter((clientConnection) => {
            if (clientConnection.desc.id === messageObject.data) {
              clientConnection.webSocket.close(4001)
              return false
            }
            return true
          })
        }
      }
    } else {
      throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
    }
  }

  signalingWebSocket.onopen = (event, queue) => {
    queue.unshift(encodedCompositorIdentityMessage)
  }
}

export function ensureProxyConnection(
  session: Session,
  compositorProxyURL: URL,
  onChannel: (channel: Channel, clientConnectionListener: RemoteClientConnectionListener) => void,
): RemoteClientConnectionListener {
  const signalingPath = compositorProxyURL.pathname.endsWith('/') ? 'signaling' : '/signaling'
  const signalingURL = `${compositorProxyURL.protocol}//${compositorProxyURL.host}${compositorProxyURL.pathname}${signalingPath}?${compositorProxyURL.searchParams}`
  const peerConnectionEntry = connectionsByProxyURL[signalingURL]
  if (peerConnectionEntry) {
    return peerConnectionEntry.clientConnectionListener
  }

  session.logger.info(`Trying to connect using compositor proxy signaling URL: ${signalingURL}`)
  const signalingWebSocket = new ReconnectingWebSocket(signalingURL, undefined, {
    minReconnectionDelay: 1000,
    maxReconnectionDelay: 3000,
    reconnectionDelayGrowFactor: 100,
  })
  signalingWebSocket.binaryType = 'arraybuffer'

  const clientConnectionListener: RemoteClientConnectionListener = {
    type: 'remote',
    onClient(client: Client) {
      /*noop*/
    },
    close() {
      closeClientConnections(session, signalingURL)
      delete connectionsByProxyURL[signalingURL]
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

  createProxyConnection(session, signalingWebSocket, signalingURL, clientConnectionListener, onChannel)
  return clientConnectionListener
}
