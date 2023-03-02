import { RemoteClientConnectionListener } from '../index'
import { Client } from 'westfield-runtime-server'
import Session from '../Session'
import ReconnectingWebSocket from './reconnecting-websocket'

export type ChannelDesc = { id: number; type: 'protocol' | 'frame' | 'xwm' | 'feedback'; clientId: string }
export type FeedbackDataChannelDesc = ChannelDesc & { type: 'feedback'; surfaceId: number }

const enum SignalingMessageType {
  IDENTITY,
  CONNECTION,
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

const textDecoder = new TextDecoder()
const textEncoder = new TextEncoder()

const identity = Array(17)
  .join((Math.random().toString(36) + '00000000000000000').slice(2, 18))
  .slice(0, 16)
const peerIdentity: SignalingMessage = {
  type: SignalingMessageType.IDENTITY,
  identity,
}
const peerIdentityMessage = textEncoder.encode(JSON.stringify(peerIdentity))

const proxyConnections: Record<
  string,
  { clientConnectionListener: RemoteClientConnectionListener; clientConnections: ReconnectingWebSocket[] }
> = {}

function addClientConnection(
  signalingURL: string,
  clientConnectionListener: RemoteClientConnectionListener,
  webSocket: ReconnectingWebSocket,
) {
  let proxyConnection = proxyConnections[signalingURL]
  if (proxyConnection === undefined) {
    proxyConnection = {
      clientConnectionListener,
      clientConnections: [],
    }
    proxyConnections[signalingURL] = proxyConnection
  }
  proxyConnection.clientConnections.push(webSocket)
}

function closeClientConnections(signalingURL: string) {
  const proxyConnection = proxyConnections[signalingURL]
  if (proxyConnection) {
    for (const clientConnection of proxyConnection.clientConnections) {
      clientConnection.close()
    }
    proxyConnection.clientConnections = []
  }
}

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }
  return (
    messageObject.type === SignalingMessageType.CONNECTION || messageObject.type === SignalingMessageType.CONNECTION
  )
}

function createProxyConnection(
  session: Session,
  signalingWebSocket: ReconnectingWebSocket,
  signalingURL: string,
  clientConnectionListener: RemoteClientConnectionListener,
  onWebSocket: (
    webSocket: ReconnectingWebSocket,
    desc: ChannelDesc,
    clientConnectionListener: RemoteClientConnectionListener,
  ) => void,
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
          closeClientConnections(signalingURL)
          // TODO close all associated websockets
        } else if (remotePeerIdentity === undefined) {
          // Connecting to remote proxy for the first time
          remotePeerIdentity = messageObject.identity
        } // else re-connecting, ignore.
      } else if (messageObject.type === SignalingMessageType.CONNECTION) {
        // TODO define a connection timeout
        const url = new URL(messageObject.data.url.replace('http', 'ws'))
        url.searchParams.append('compositorSessionId', session.compositorSessionId)
        const webSocket = new ReconnectingWebSocket(url.href)
        addClientConnection(signalingURL, clientConnectionListener, webSocket)
        onWebSocket(webSocket, messageObject.data.desc, clientConnectionListener)
      }
    }
  }

  signalingWebSocket.onopen = (event, queue) => {
    queue.unshift(peerIdentityMessage)
  }
}

export function ensureProxyPeerConnection(
  session: Session,
  compositorProxyURL: URL,
  onWebSocket: (
    webSocket: ReconnectingWebSocket,
    desc: ChannelDesc,
    clientConnectionListener: RemoteClientConnectionListener,
  ) => void,
): RemoteClientConnectionListener {
  const signalingPath = compositorProxyURL.pathname.endsWith('/') ? 'signaling' : '/signaling'
  const signalingURL = `${compositorProxyURL.protocol}//${compositorProxyURL.host}${compositorProxyURL.pathname}${signalingPath}?${compositorProxyURL.searchParams}`
  const peerConnectionEntry = proxyConnections[signalingURL]
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
      closeClientConnections(signalingURL)
      delete proxyConnections[signalingURL]
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

  createProxyConnection(session, signalingWebSocket, signalingURL, clientConnectionListener, onWebSocket)
  return clientConnectionListener
}
