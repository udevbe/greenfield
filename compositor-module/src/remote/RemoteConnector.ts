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
import { ensureProxyPeerConnection } from './proxy-peer-connections'
import { ARQDataChannel } from './ARQDataChannel'

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
    peerConnection: RTCPeerConnection,
    clientConnectionListener: ClientConnectionListener,
  ) {
    peerConnection.ondatachannel = (ev) => {
      const dataChannel = ev.channel
      const params = new URLSearchParams(dataChannel.label)
      const type = params.get('t')
      const clientId = params.get('cid')
      if (type === 'prtcl' && clientId) {
        const client = this.session.display.createClient(clientId)
        const protocolDataChannel = new ARQDataChannel(dataChannel)
        client.onClose().then(() => protocolDataChannel.close())
        this.remoteSocket.onProtocolChannel(protocolDataChannel, compositorProxyURL, client)
        clientConnectionListener.onClient(client)
      } else if (type === 'frmdt' && clientId) {
        const client = this.session.display.clients[clientId]
        const frameDataChannel = new ARQDataChannel(dataChannel)
        client.onClose().then(() => frameDataChannel.close())
        this.remoteSocket.setupFrameDataChannel(client, frameDataChannel)
      } else if (type === 'xwm' && clientId) {
        const client = this.session.display.clients[clientId]
        // TODO associate with proxy connection & cleanup on disconnect?
        const xwmDataChannel = new ARQDataChannel(dataChannel)
        client.onClose().then(() => xwmDataChannel.close())
        this.remoteSocket.setupXWM(client, xwmDataChannel)
      }
    }
  }

  listen(compositorProxyURL: URL): ClientConnectionListener {
    const { peerConnection, clientConnectionListener } = ensureProxyPeerConnection(
      this.session,
      compositorProxyURL,
      (newPeerConnection, clientConnectionListener) => {
        peerConnection.ondatachannel = null
        this.listenForDataChannels(compositorProxyURL, newPeerConnection, clientConnectionListener)
      },
    )

    this.listenForDataChannels(compositorProxyURL, peerConnection, clientConnectionListener)
    return clientConnectionListener
  }
}
