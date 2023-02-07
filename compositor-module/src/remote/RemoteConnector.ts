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

import { ClientConnectionListener, CompositorConnector } from '../index'
import { RemoteConnectionHandler } from './RemoteConnectionHandler'
import Session from '../Session'
import { DataChannelDesc, ensureProxyPeerConnection, FeedbackDataChannelDesc } from './proxy-peer-connections'
import { ARQChannel, Channel, SimpleChannel } from './Channel'

export class RemoteConnection {}

export class RemoteConnector implements CompositorConnector {
  private readonly session: Session
  private readonly remoteSocket: RemoteConnectionHandler

  static create(session: Session): RemoteConnector {
    return new RemoteConnector(session, RemoteConnectionHandler.create(session))
  }

  private constructor(session: Session, remoteSocket: RemoteConnectionHandler) {
    this.session = session
    this.remoteSocket = remoteSocket
  }

  private listenForDataChannels(
    compositorProxyURL: URL,
    dataChannel: RTCDataChannel,
    desc: DataChannelDesc,
    clientConnectionListener: ClientConnectionListener,
  ) {
    const type = desc.type
    const clientId = desc.clientId
    if (type === 'protocol' && clientId) {
      const client = this.session.display.createClient(clientId)
      const protocolDataChannel: Channel = new ARQChannel(dataChannel)
      client.onClose().then(() => protocolDataChannel.close())
      this.remoteSocket.onProtocolChannel(protocolDataChannel, compositorProxyURL, client)
      clientConnectionListener.onClient(client)
    } else if (type === 'frame' && clientId) {
      const client = this.session.display.clients[clientId]
      const frameDataChannel: Channel = new ARQChannel(dataChannel)
      client.onClose().then(() => frameDataChannel.close())
      this.remoteSocket.setupFrameDataChannel(client, frameDataChannel)
    } else if (type === 'xwm' && clientId) {
      const client = this.session.display.clients[clientId]
      // TODO associate with proxy connection & cleanup on disconnect?
      const xwmDataChannel: Channel = new ARQChannel(dataChannel)
      client.onClose().then(() => xwmDataChannel.close())
      this.remoteSocket.setupXWM(client, xwmDataChannel)
    } else if (type === 'feedback' && clientId) {
      const feedbackDesc = desc as FeedbackDataChannelDesc
      const surfaceId = feedbackDesc.surfaceId
      const client = this.session.display.clients[clientId]
      const feedbackChannel: Channel = new SimpleChannel(dataChannel)
      client.onClose().then(() => feedbackChannel.close())
      client.userData.clientEncodersFeedback?.addFeedbackChannel(feedbackChannel, surfaceId)
    }
  }

  listen(compositorProxyURL: URL): ClientConnectionListener {
    return ensureProxyPeerConnection(
      this.session,
      compositorProxyURL,
      (dataChannel, desc, clientConnectionListener) => {
        this.listenForDataChannels(compositorProxyURL, dataChannel, desc, clientConnectionListener)
      },
    )
  }
}
