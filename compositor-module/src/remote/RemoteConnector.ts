// Copyright 2020 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

import { RemoteClientConnectionListener, RemoteCompositorConnector } from '../index'
import { RemoteConnectionHandler } from './RemoteConnectionHandler'
import Session from '../Session'
import {
  ARQChannel,
  ChannelDesc,
  ChannelDescriptionType,
  ChannelType,
  FeedbackChannelDesc,
  SimpleChannel,
  WebSocketChannel,
} from './Channel'
import { Client } from 'westfield-runtime-server'
import ReconnectingWebSocket from './reconnecting-websocket'

const textDecoder = new TextDecoder()

const webSocketReconnectOptions = {
  minReconnectionDelay: 3000,
  maxReconnectionDelay: 6000,
  reconnectionDelayGrowFactor: 1000,
}

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

function isSignalingMessage(messageObject: any): messageObject is SignalingMessage {
  if (messageObject === null) {
    return false
  }

  return (
    messageObject.type === SignalingMessageType.CONNECTION ||
    messageObject.type === SignalingMessageType.DISCONNECT ||
    messageObject.type === SignalingMessageType.PONG
  )
}

class RemoteProxyConnectionListener implements RemoteClientConnectionListener {
  onClient = (client: Client): void => {
    /*noop*/
  }

  onConnectionStateChange = (state: 'closed' | 'open'): void => {
    /*noop*/
  }

  onError = (error: Error): void => {
    /*noop*/
  }

  proxySessionKey?: string

  remoteIdentityChanged = (remoteIdentity: string): void => {
    /*noop*/
  }

  readonly type = 'remote'

  private signalingWebSocket?: ReconnectingWebSocket
  private clientConnections: WebSocketChannel[] = []
  private pongSerial = 1
  private proxySessionProps?: { proxySessionKey: string; baseURL: string; proxySessionSignalURL: string }

  constructor(private readonly session: Session, private readonly remoteSocket: RemoteConnectionHandler) {}

  close(): void {
    for (const clientConnection of this.clientConnections) {
      clientConnection.close()
      const client = this.session.display.clients[clientConnection.desc.clientId]
      if (client) {
        client.close()
      }
    }

    if (this.signalingWebSocket) {
      this.signalingWebSocket.close(4001, 'connection closed by user')
      this.signalingWebSocket = undefined
    }
  }

  get state(): 'closed' | 'closing' | 'connecting' | 'open' {
    if (this.signalingWebSocket === undefined) {
      return 'closed'
    } else {
      switch (this.signalingWebSocket.readyState) {
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
    }
  }

  listen(proxySessionProps: { proxySessionKey: string; baseURL: string; proxySessionSignalURL: string }) {
    this.proxySessionProps = proxySessionProps
    this.signalingWebSocket = new ReconnectingWebSocket(proxySessionProps.proxySessionSignalURL)
    this.signalingWebSocket.binaryType = 'arraybuffer'

    this.signalingWebSocket.addEventListener('open', (event) => {
      this.onConnectionStateChange('open')
    })
    this.signalingWebSocket.addEventListener('close', (event) => {
      this.onConnectionStateChange('closed')
    })
    this.signalingWebSocket.addEventListener('error', (event) => {
      this.onError(event.error)
    })

    this.handleProxySessionMessages(this.signalingWebSocket, proxySessionProps)
    this.remoteIdentityChanged(proxySessionProps.proxySessionKey)
  }

  private handleProxySessionMessages(
    signalingConnection: ReconnectingWebSocket,
    proxySessionProps: {
      proxySessionKey: string
      baseURL: string
      proxySessionSignalURL: string
    },
  ) {
    signalingConnection.onmessage = async (event) => {
      const messageObject = JSON.parse(textDecoder.decode(event.data as ArrayBuffer))
      if (isSignalingMessage(messageObject)) {
        switch (messageObject.type) {
          case SignalingMessageType.CONNECTION: {
            // TODO define a connection timeout
            const webSocket = new ReconnectingWebSocket(messageObject.data.url, undefined, webSocketReconnectOptions)
            const desc = messageObject.data.desc
            let channel: WebSocketChannel
            if (desc.channelType === ChannelType.ARQ) {
              channel = new ARQChannel(webSocket, desc)
            } else if (desc.channelType === ChannelType.SIMPLE) {
              channel = new SimpleChannel(webSocket, desc)
            } else {
              throw new Error(`BUG. Unknown channel description: ${JSON.stringify(desc)}`)
            }
            this.clientConnections.push(channel)
            this.onChannel(channel, messageObject.sessionKey, proxySessionProps)
            break
          }
          case SignalingMessageType.DISCONNECT: {
            this.clientConnections = this.clientConnections.filter((clientConnection) => {
              if (clientConnection.desc.id === messageObject.data) {
                clientConnection.webSocket.close(4001)
                return false
              }
              return true
            })
            break
          }
          case SignalingMessageType.PONG: {
            this.pongSerial = messageObject.data
            break
          }
        }
      } else {
        throw new Error(`BUG. Received an unknown message: ${JSON.stringify(messageObject)}`)
      }
    }
  }

  private onChannel(
    channel: WebSocketChannel,
    proxySessionKey: string,
    proxySessionProps: {
      proxySessionKey: string
      baseURL: string
      proxySessionSignalURL: string
    },
  ) {
    if (channel.desc.type === ChannelDescriptionType.PROTOCOL) {
      const client = this.session.display.createClient(channel.desc.clientId)
      client.onClose().then(() => channel.close())
      this.remoteSocket.onProtocolChannel(channel, proxySessionProps, client, proxySessionKey)
      this.onClient(client)
    } else if (channel.desc.type === ChannelDescriptionType.FRAME) {
      const client = this.session.display.clients[channel.desc.clientId]
      if (client) {
        client.onClose().then(() => channel.close())
        this.remoteSocket.setupFrameDataChannel(client, channel)
      } else {
        channel.close()
      }
    } else if (channel.desc.type === ChannelDescriptionType.XWM) {
      const client = this.session.display.clients[channel.desc.clientId]
      if (client) {
        // TODO associate with proxy connection & cleanup on disconnect?
        client.onClose().then(() => channel.close())
        this.remoteSocket.setupXWM(client, channel)
      } else {
        channel.close()
      }
    } else if (channel.desc.type === ChannelDescriptionType.FEEDBACK) {
      const feedbackDesc = channel.desc as FeedbackChannelDesc
      const surfaceId = feedbackDesc.surfaceId
      const client = this.session.display.clients[channel.desc.clientId]
      if (client) {
        client.onClose().then(() => channel.close())
        client.userData.clientEncodersFeedback?.addFeedbackChannel(channel, surfaceId)
      } else {
        channel.close()
      }
    }
  }
}

export class RemoteConnector implements RemoteCompositorConnector {
  public readonly type = 'remote'
  private readonly session: Session
  private readonly remoteSocket: RemoteConnectionHandler

  static create(session: Session): RemoteConnector {
    return new RemoteConnector(session, RemoteConnectionHandler.create(session))
  }

  private constructor(session: Session, remoteSocket: RemoteConnectionHandler) {
    this.session = session
    this.remoteSocket = remoteSocket
  }

  launch(proxyAppURL: URL): RemoteClientConnectionListener {
    const remoteProxyConnectionListener = new RemoteProxyConnectionListener(this.session, this.remoteSocket)
    fetch(proxyAppURL).then((response) => {
      if (response.ok) {
        return response
          .json()
          .then((proxySessionProps: { proxySessionKey: string; baseURL: string; proxySessionSignalURL: string }) => {
            remoteProxyConnectionListener.listen(proxySessionProps)
          })
      } else {
        // TODO log error(s)
        remoteProxyConnectionListener.close()
      }
    })

    return remoteProxyConnectionListener
  }
}
