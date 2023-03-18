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
import { Channel, ChannelDescriptionType, FeedbackChannelDesc } from './Channel'
import { ensureProxyConnection } from './connection-signaling'

export class RemoteConnection {}

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

  private listenForChannels(
    compositorProxyURL: URL,
    channel: Channel,
    clientConnectionListener: RemoteClientConnectionListener,
  ) {
    if (channel.desc.type === ChannelDescriptionType.PROTOCOL) {
      const client = this.session.display.createClient(channel.desc.clientId)
      client.onClose().then(() => channel.close())
      this.remoteSocket.onProtocolChannel(channel, compositorProxyURL, client)
      clientConnectionListener.onClient(client)
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
    } else if (channel.desc.type === ChannelDescriptionType.AUDIO) {
      const client = this.session.display.clients[channel.desc.clientId]
      if (client) {
        client.onClose().then(() => channel.close())
        this.remoteSocket.setupAudioChannel(client, channel)
      } else {
        channel.close()
      }
    }
  }

  listen(compositorProxyURL: URL): RemoteClientConnectionListener {
    return ensureProxyConnection(this.session, compositorProxyURL, (channel, clientConnectionListener) => {
      this.listenForChannels(compositorProxyURL, channel, clientConnectionListener)
    })
  }
}
