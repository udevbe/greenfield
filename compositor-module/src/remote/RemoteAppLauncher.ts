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

import { Client } from 'westfield-runtime-server'
import { CompositorConnector } from '../index'
import { createRetransmittingWebSocket, randomString, RemoteConnectionHandler } from './RemoteConnectionHandler'
import Session from '../Session'

export class RemoteAppLauncher implements CompositorConnector {
  private readonly session: Session
  private readonly remoteSocket: RemoteConnectionHandler

  static create(session: Session): RemoteAppLauncher {
    return new RemoteAppLauncher(session, RemoteConnectionHandler.create(session))
  }

  private constructor(session: Session, remoteSocket: RemoteConnectionHandler) {
    this.session = session
    this.remoteSocket = remoteSocket
  }

  async connectTo(compositorProxyURL: URL): Promise<Client> {
    this.remoteSocket.ensureXWayland(compositorProxyURL)
    const clientId = randomString()
    return this.remoteSocket.onWebSocket(
      createRetransmittingWebSocket(compositorProxyURL, clientId),
      compositorProxyURL,
      clientId,
    )
  }
}
